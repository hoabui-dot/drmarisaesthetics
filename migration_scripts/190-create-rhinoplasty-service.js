#!/usr/bin/env node

/**
 * Create the standalone Rhinoplasty Service from the authoritative DOCX.
 *
 * The source DOCX contains no embedded images, so this migration downloads one
 * editorial medical-consultation image, uploads it to Strapi Media Library,
 * and references the resulting media object both as coverImage and as a
 * Better Blocks image node in the opening clinical section.
 */
const fs = require('node:fs');
const path = require('node:path');
const { docxToBetterBlocks } = require('../dental-frontend/../strapi-cms/src/lib/docx-better-blocks');
const { validateDocument } = require('../strapi-cms/node_modules/@qkix/better-blocks-core');

const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_API_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'services-docs', 'docx-docs', 'content dịch vụ');
const SOURCE_IMAGE_URL = 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&fm=jpg&q=82&w=1600';
const IMAGE_NAME = 'rhinoplasty-consultation.jpg';
const IMAGE_ALT = 'Plastic surgeon discussing rhinoplasty planning with a patient';
const IMAGE_CAPTION = 'Rhinoplasty planning begins with structural assessment, facial proportion and a clear surgical plan.';

const MEDIA_KEYS = [
  'name', 'alternativeText', 'url', 'caption', 'width', 'height', 'formats',
  'hash', 'ext', 'mime', 'size', 'previewUrl', 'provider', 'provider_metadata',
  'createdAt', 'updatedAt',
];

const textOf = (block) => (block?.children || []).map((child) => child.text || '').join('').trim();

const api = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status} ${endpoint}: ${JSON.stringify(body)}`);
  return body;
};

const findDocx = () => {
  const file = fs.readdirSync(SOURCE_DIR).find((name) => name.normalize('NFC') === 'nâng mũi.docx');
  if (!file) throw new Error(`Missing rhinoplasty DOCX in ${SOURCE_DIR}`);
  return path.join(SOURCE_DIR, file);
};

const mediaForBetterBlocks = (media) => Object.fromEntries(MEDIA_KEYS.map((key) => [
  key,
  key === 'alternativeText' ? (media.alternativeText || IMAGE_ALT) : media[key],
]));

const uploadImage = async () => {
  const existing = await api(`/api/upload/files?filters[name][$eq]=${encodeURIComponent(IMAGE_NAME)}&pagination[pageSize]=1`);
  if (existing[0]) return existing[0];

  const source = await fetch(SOURCE_IMAGE_URL);
  if (!source.ok) throw new Error(`Unable to download rhinoplasty image: ${source.status}`);
  const buffer = Buffer.from(await source.arrayBuffer());
  const form = new FormData();
  form.append('files', new Blob([buffer], { type: 'image/jpeg' }), IMAGE_NAME);
  form.append('fileInfo', JSON.stringify({ name: IMAGE_NAME, alternativeText: IMAGE_ALT, caption: IMAGE_CAPTION }));
  const response = await fetch(`${BASE}/api/upload`, {
    method: 'POST',
    body: form,
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body[0]) throw new Error(`Rhinoplasty image upload failed: ${JSON.stringify(body)}`);
  return body[0];
};

const buildBlocks = async (image) => {
  const imported = await docxToBetterBlocks(fs.readFileSync(findDocx()));
  if (imported.warnings.length) imported.warnings.forEach((warning) => console.warn(`[WARN] ${warning}`));

  const titleBlock = imported.blocks.find((block) => block.type === 'heading' && block.level === 1);
  const title = textOf(titleBlock) || 'Rhinoplasty in Vietnam: Structural & Rib Cartilage Nose Surgery';
  const metaBlock = imported.blocks.find((block) => block.type === 'paragraph' && /^Meta Description\s*:/i.test(textOf(block)));
  const metaDescription = (textOf(metaBlock) || 'Explore structural and rib cartilage rhinoplasty in Vietnam with Dr. Maris, including hospital-based surgery, recovery, risks and international patient planning.')
    .replace(/^Meta Description\s*:\s*/i, '').trim();
  const blocks = imported.blocks.filter((block) => block !== titleBlock && block !== metaBlock);
  const imageNode = {
    type: 'image',
    image: mediaForBetterBlocks(image),
    caption: IMAGE_CAPTION,
    children: [{ type: 'text', text: '' }],
  };
  const insertionIndex = blocks.findIndex((block) => textOf(block) === 'Understanding Rhinoplasty');
  blocks.splice(insertionIndex >= 0 ? insertionIndex + 1 : 0, 0, imageNode);
  const validation = validateDocument(blocks);
  if (!validation.valid) throw new Error(`Generated Rhinoplasty Better Blocks are invalid: ${JSON.stringify(validation)}`);
  return { title, metaDescription, blocks, importedWarnings: imported.warnings };
};

async function run() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const image = await uploadImage();
  const content = await buildBlocks(image);
  console.log(`[VERIFY] rhinoplasty: ${content.blocks.length} blocks, image=${image.id}, source=${path.basename(findDocx())}`);
  if (DRY_RUN) return;

  const existing = (await api('/api/services?filters[slug][$eq]=rhinoplasty&pagination[pageSize]=1')).data?.[0];
  const data = {
    title: content.title,
    slug: 'rhinoplasty',
    category: 'Plastic Surgery',
    coverImage: image.id,
    metaDescription: content.metaDescription,
    contentBetterBlocks: content.blocks,
  };
  const saved = existing
    ? await api(`/api/services/${existing.documentId || existing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data }) })
    : await api('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data }) });
  const documentId = saved.data?.documentId || existing?.documentId || existing?.id;
  if (documentId) await api(`/api/services/${documentId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: {}, status: 'published' }) });
  console.log(`[DONE] Published /services/rhinoplasty with ${content.blocks.length} Better Blocks.`);
}

run().catch((error) => { console.error(`[FAILED] ${error.message}`); process.exitCode = 1; });
