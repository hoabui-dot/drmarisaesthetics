#!/usr/bin/env node

/**
 * Convert the authoritative service DOCX files to semantic Markdown and sync
 * that content into Strapi's separate Service collection.
 *
 * DOCX paragraph styles, lists and tables are converted instead of treating
 * the copied plain text as one long paragraph. The source wording is kept.
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_API_TOKEN;
const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'services-docs', 'docx-docs', 'content dịch vụ');
const OUTPUT_DIR = path.join(ROOT, 'services-docs', 'docx-docs', 'normalized-md');
const DRY_RUN = process.argv.includes('--dry-run');

const sources = {
  'nâng ngực.docx': 'breast-augmentation',
  'hút mỡ.docx': 'liposuction',
  'trẻ hoá vùng mắt.docx': 'blepharoplasty',
  'thu nhỏ dạ dày.docx': 'gastric-sleeve',
  'căng da mặt.docx': 'facelift',
  'nâng mông.docx': 'buttock-augmentation',
  'tạo hình vùng kín.docx': 'labiaplasty',
};

function decodeXml(value) {
  return value
    .replace(/<w:tab\s*\/?>(?![\s\S]*<w:tab)/g, '\t')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

function textFromXml(xml, inline = true) {
  const runs = [...xml.matchAll(/<w:r\b[^>]*>([\s\S]*?)<\/w:r>/g)];
  if (!runs.length) return decodeXml(xml.replace(/<[^>]+>/g, '')) .replace(/\s+/g, ' ').trim();
  return runs.map((match) => {
    const run = match[1];
    const text = decodeXml([...run.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((item) => item[1]).join(''))
      .replace(/<w:tab\s*\/?\s*>/g, '\t');
    if (!text) return '';
    if (!inline) return text;
    const bold = /<w:b(?:\s[^>]*)?\/>|<w:b\b[^>]*>/.test(run);
    const italic = /<w:i(?:\s[^>]*)?\/>|<w:i\b[^>]*>/.test(run);
    if (bold && italic) return `***${text}***`;
    if (bold) return `**${text}**`;
    if (italic) return `*${text}*`;
    return text;
  }).join('').replace(/\s+([,.;:!?])/g, '$1').trim();
}

function numberingMap(numberingXml) {
  const abstract = new Map();
  for (const match of numberingXml.matchAll(/<w:abstractNum\b[^>]*w:abstractNumId="(\d+)"[\s\S]*?<\/w:abstractNum>/g)) {
    abstract.set(match[1], /w:numFmt\s+w:val="(bullet|decimal|lowerLetter|upperLetter)"/.exec(match[0])?.[1] || 'bullet');
  }
  const result = new Map();
  for (const match of numberingXml.matchAll(/<w:num\b[^>]*w:numId="(\d+)"[\s\S]*?<\/w:num>/g)) {
    const abstractId = /w:abstractNumId\s+w:val="(\d+)"/.exec(match[0])?.[1];
    result.set(match[1], abstract.get(abstractId) || 'bullet');
  }
  return result;
}

function tableToMarkdown(xml) {
  const rows = [...xml.matchAll(/<w:tr\b[\s\S]*?<\/w:tr>/g)].map((row) =>
    [...row[0].matchAll(/<w:tc\b[\s\S]*?<\/w:tc>/g)].map((cell) => textFromXml(cell[0]).replace(/\|/g, '\\|').replace(/\n+/g, ' '))
  ).filter((row) => row.length);
  if (!rows.length) return '';
  const width = Math.max(...rows.map((row) => row.length));
  const normalized = rows.map((row) => [...row, ...Array(width - row.length).fill('')]);
  return [
    `| ${normalized[0].join(' | ')} |`,
    `| ${normalized[0].map(() => '---').join(' | ')} |`,
    ...normalized.slice(1).map((row) => `| ${row.join(' | ')} |`),
  ].join('\n');
}

function docxToMarkdown(filePath) {
  const documentXml = execFileSync('unzip', ['-p', filePath, 'word/document.xml'], { encoding: 'utf8' });
  const numberingXml = execFileSync('unzip', ['-p', filePath, 'word/numbering.xml'], { encoding: 'utf8' });
  const lists = numberingMap(numberingXml);
  const body = /<w:body>([\s\S]*?)<\/w:body>/.exec(documentXml)?.[1] || '';
  const blocks = [...body.matchAll(/(<w:tbl\b[\s\S]*?<\/w:tbl>)|(<w:p\b[\s\S]*?<\/w:p>)/g)];
  const output = [];
  let orderedIndex = 1;
  let inList = false;
  for (const block of blocks) {
    const xml = block[0];
    if (xml.startsWith('<w:tbl')) {
      const table = tableToMarkdown(xml);
      if (table) { if (inList && output.at(-1) !== '') output.push(''); output.push(table, ''); }
      inList = false;
      continue;
    }
    const text = textFromXml(xml);
    if (!text) { output.push(''); continue; }
    const style = /<w:pStyle\s+w:val="([^"]+)"/.exec(xml)?.[1] || '';
    const numberId = /<w:numId\s+w:val="(\d+)"/.exec(xml)?.[1];
    const level = Number(/<w:ilvl\s+w:val="(\d+)"/.exec(xml)?.[1] || 0);
    const headingText = text.replace(/\*+/g, '').replace(/^#+\s*/, '').trim();
    if (/^Heading1$/i.test(style)) { if (inList && output.at(-1) !== '') output.push(''); output.push(`# ${headingText}`, ''); inList = false; }
    else if (/^Heading2$/i.test(style)) { if (inList && output.at(-1) !== '') output.push(''); output.push(`## ${headingText}`, ''); inList = false; }
    else if (/^Heading3$/i.test(style)) { if (inList && output.at(-1) !== '') output.push(''); output.push(`### ${headingText}`, ''); inList = false; }
    else if (numberId) {
      const kind = lists.get(numberId) || 'bullet';
      const prefix = kind === 'decimal' || kind === 'lowerLetter' || kind === 'upperLetter' ? `${orderedIndex++}.` : '-';
      output.push(`${'  '.repeat(level)}${prefix} ${text}`);
      inList = true;
    } else {
      if (inList && output.at(-1) !== '') output.push('');
      orderedIndex = 1;
      output.push(text, '');
      inList = false;
    }
  }
  let markdown = output.join('\n')
    .replace(/^\*\*Meta Description:\s*\*\*\s*/m, 'Meta Description: ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  // Some source DOCX files use bold formatting for the title instead of the
  // Heading 1 paragraph style. Promote the first content line so every
  // Service record has the same Markdown hierarchy.
  if (!/^#\s+/m.test(markdown)) {
    const lines = markdown.split('\n');
    const first = lines.findIndex((line) => line.trim() && !/^Meta Description:/i.test(line.trim()));
    if (first >= 0) lines[first] = `# ${lines[first].replace(/^\*+|\*+$/g, '').trim()}`;
    markdown = lines.join('\n');
  }
  return `${markdown}\n`;
}

async function api(endpoint, options = {}) {
  const response = await fetch(`${BASE}${endpoint}`, { ...options, headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status} ${endpoint}: ${JSON.stringify(body)}`);
  return body;
}

async function run() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const [fileName, slug] of Object.entries(sources)) {
    const markdown = docxToMarkdown(path.join(SOURCE_DIR, fileName));
    fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.md`), markdown);
    const title = (markdown.match(/^#\s+(.+)$/m)?.[1] || slug).replace(/\*+/g, '').trim();
    const metaDescription = (markdown.match(/^\**Meta Description:\**\s*(.+)$/m)?.[1] || '').replace(/\*+/g, '').trim();
    const current = (await api(`/api/services?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`)).data?.[0];
    if (!current) { console.warn(`[SKIP] No Service entry for ${slug}`); continue; }
    console.log(`[SYNC] ${slug}: ${markdown.length} chars`);
    if (DRY_RUN) continue;
    await api(`/api/services/${current.documentId || current.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { title, content: markdown, metaDescription: metaDescription.replace(/^\*\*|\*\*$/g, '') } }),
    });
  }
  console.log(`[DONE] ${DRY_RUN ? 'Dry run complete.' : 'Normalized DOCX Markdown and updated Service content.'}`);
}

run().catch((error) => { console.error(`[FAILED] ${error.message}`); process.exitCode = 1; });
