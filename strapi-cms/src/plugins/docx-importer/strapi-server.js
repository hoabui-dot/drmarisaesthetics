'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const mammoth = require('mammoth');
const { docxToBetterBlocks } = require('../../lib/docx-better-blocks');
const { transformHtml } = require('../../lib/docx-better-blocks');
const { validateDocument } = require('@qkix/better-blocks-core');

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_HTML_SIZE = 2 * 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGE_COUNT = 50;
const MIME_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const ACCEPTED_DOCX_MIMES = new Set([MIME_DOCX, 'application/octet-stream', '']);
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);
const CLIPBOARD_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

const getUploadedFile = (ctx) => {
  const value = ctx.request.files?.file;
  return Array.isArray(value) ? value[0] : value;
};

const filePathOf = (file) => file?.filepath || file?.path;

const contentTypeExtension = (contentType) => {
  if (contentType === 'image/png') return '.png';
  if (contentType === 'image/jpeg') return '.jpg';
  if (contentType === 'image/gif') return '.gif';
  if (contentType === 'image/webp') return '.webp';
  return '.bin';
};

const uploadClipboardImage = async (ctx) => {
  const file = getUploadedFile(ctx);
  const sourcePath = filePathOf(file);
  const mimeType = file?.mimetype || '';
  const size = Number(file?.size || 0);
  const originalFilename = file?.originalFilename || file?.name || 'clipboard-image';

  if (!file || !sourcePath) return ctx.badRequest('Choose an image to upload.');
  if (!CLIPBOARD_IMAGE_TYPES.has(mimeType)) {
    return ctx.badRequest('Only PNG, JPEG or WebP images can be pasted.');
  }
  if (!size || size > MAX_IMAGE_SIZE) {
    return ctx.badRequest(`Clipboard images must be smaller than ${MAX_IMAGE_SIZE / 1024 / 1024} MB.`);
  }

  try {
    const [uploaded] = await strapi.plugin('upload').service('upload').upload({
      data: {
        fileInfo: {
          name: originalFilename,
          alternativeText: originalFilename.replace(/\.[^.]+$/, ''),
        },
      },
      files: {
        filepath: sourcePath,
        originalFilename,
        mimetype: mimeType,
        size,
      },
    });

    if (!uploaded?.url) return ctx.badRequest('The image upload did not return a Media Library asset.');
    strapi.log.info(`[docx-importer] clipboard image uploaded mime=${mimeType} size=${size}`);
    ctx.body = { data: { media: uploaded } };
  } catch (error) {
    strapi.log.error(`[docx-importer] clipboard image upload failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    ctx.badRequest('The image could not be uploaded. Please try again.');
  }
};

const countBlocks = (blocks) => blocks.reduce((counts, block) => {
  counts[block.type] = (counts[block.type] || 0) + 1;
  return counts;
}, {});

const importImageFactory = async (imageCache, temporaryFiles, image, imageCount) => {
  if (!ALLOWED_IMAGE_TYPES.has(image.contentType)) {
    throw new Error(`Unsupported embedded image type: ${image.contentType || 'unknown'}`);
  }
  if (imageCount.value >= MAX_IMAGE_COUNT) {
    throw new Error(`DOCX image count exceeds the limit of ${MAX_IMAGE_COUNT}.`);
  }
  const base64 = await image.read('base64');
  const imageSize = Buffer.byteLength(base64, 'base64');
  if (imageSize > MAX_IMAGE_SIZE) {
    throw new Error(`An embedded image exceeds the limit of ${MAX_IMAGE_SIZE / 1024 / 1024} MB.`);
  }
  const hash = crypto.createHash('sha256').update(base64).digest('hex');
  if (imageCache.has(hash)) return imageCache.get(hash);
  imageCount.value += 1;

  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'strapi-docx-image-'));
  const extension = contentTypeExtension(image.contentType);
  const filePath = path.join(directory, `${hash}${extension}`);
  await fs.writeFile(filePath, Buffer.from(base64, 'base64'));
  temporaryFiles.push(directory);

  const [uploaded] = await strapi.plugin('upload').service('upload').upload({
    data: {
      fileInfo: {
        name: `${hash}${extension}`,
        alternativeText: image.altText || null,
        caption: null,
      },
    },
    files: {
      filepath: filePath,
      originalFilename: `${hash}${extension}`,
      mimetype: image.contentType,
      size: Buffer.byteLength(base64, 'base64'),
    },
  });

  const imported = {
    url: uploaded?.url,
    alternativeText: uploaded?.alternativeText || image.altText || null,
    width: uploaded?.width,
    height: uploaded?.height,
  };
  imageCache.set(hash, imported);
  return imported;
};

const transform = async (ctx) => {
  const file = getUploadedFile(ctx);
  const sourcePath = filePathOf(file);
  const size = Number(file?.size || 0);
  const fileName = file?.originalFilename || file?.name || '';

  if (!file || !sourcePath) return ctx.badRequest('Choose a DOCX file to import.');
  if (!fileName.toLowerCase().endsWith('.docx') || !ACCEPTED_DOCX_MIMES.has(file.mimetype || '')) {
    return ctx.badRequest('The selected file must be a valid .docx document.');
  }
  if (!size || size > MAX_FILE_SIZE) return ctx.badRequest(`DOCX files must be smaller than ${MAX_FILE_SIZE / 1024 / 1024} MB.`);

  const temporaryFiles = [];
  const imageCache = new Map();
  try {
    strapi.log.info(`[docx-importer] import start file=${fileName} size=${size}`);
    const buffer = await fs.readFile(sourcePath);
    if (buffer.length < 4 || buffer.subarray(0, 4).toString('hex') !== '504b0304') {
      return ctx.badRequest('The selected file is not a valid DOCX ZIP document.');
    }
    const importedImages = {};
    const imageCount = { value: 0 };
    const convertImage = mammoth.images.imgElement((image) => importImageFactory(imageCache, temporaryFiles, image, imageCount).then((media) => {
      const source = `docx-image:${imageCache.size}:${crypto.createHash('sha1').update(`${image.contentType}:${image.altText || ''}`).digest('hex')}`;
      importedImages[source] = media;
      return { src: source, alt: image.altText || '' };
    }));
    const result = await docxToBetterBlocks(buffer, { convertImage, images: importedImages });
    const summary = { fileName, fileSize: size, blockCount: result.blocks.length, blockTypes: countBlocks(result.blocks), warnings: result.warnings };
    strapi.log.info(`[docx-importer] import success file=${fileName} blocks=${result.blocks.length} warnings=${result.warnings.length}`);
    ctx.body = { data: { blocks: result.blocks, summary } };
  } catch (error) {
    strapi.log.error(`[docx-importer] import failed file=${fileName}: ${error instanceof Error ? error.message : 'unknown error'}`);
    ctx.badRequest('The DOCX file could not be imported. It may be corrupted or contain unsupported content.');
  } finally {
    await Promise.all(temporaryFiles.map((directory) => fs.rm(directory, { recursive: true, force: true }).catch(() => undefined)));
  }
};

const transformPastedHtml = async (ctx) => {
  const html = typeof ctx.request.body?.html === 'string' ? ctx.request.body.html : '';
  if (!html.trim()) return ctx.badRequest('Paste Word, HTML or Markdown content before importing.');
  if (Buffer.byteLength(html, 'utf8') > MAX_HTML_SIZE) return ctx.badRequest(`Pasted content must be smaller than ${MAX_HTML_SIZE / 1024 / 1024} MB.`);

  try {
    const transformed = transformHtml(html);
    const validation = validateDocument(transformed.blocks);
    if (!validation.valid) return ctx.badRequest('The pasted content could not be converted into valid Better Blocks.');
    const summary = { fileName: 'Clipboard content', fileSize: Buffer.byteLength(html, 'utf8'), blockCount: transformed.blocks.length, blockTypes: countBlocks(transformed.blocks), warnings: transformed.warnings };
    ctx.body = { data: { blocks: transformed.blocks, summary } };
  } catch (error) {
    strapi.log.error(`[docx-importer] clipboard transform failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    ctx.badRequest('The clipboard content could not be imported.');
  }
};

module.exports = {
  register({ strapi: app }) {
    app.admin.services.permission.actionProvider.register({
      section: 'plugins',
      displayName: 'Import DOCX content',
      uid: 'transform',
      subCategory: 'docx-importer',
      pluginName: 'docx-importer',
    });
  },
  controllers: { importer: { transform, transformPastedHtml, uploadClipboardImage } },
  routes: {
    admin: {
      type: 'admin',
      routes: [
        { method: 'POST', path: '/transform', handler: 'importer.transform', config: { policies: [{ name: 'admin::hasPermissions', config: { actions: ['plugin::docx-importer.transform'] } }] } },
        { method: 'POST', path: '/transform-clipboard', handler: 'importer.transformPastedHtml', config: { policies: [{ name: 'admin::hasPermissions', config: { actions: ['plugin::docx-importer.transform'] } }] } },
        { method: 'POST', path: '/upload-clipboard-image', handler: 'importer.uploadClipboardImage', config: { policies: [{ name: 'admin::hasPermissions', config: { actions: ['plugin::docx-importer.transform'] } }] } },
      ],
    },
  },
};
