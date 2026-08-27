#!/usr/bin/env node

/**
 * Seed CMS-managed images for About Us featured service cards.
 *
 * Images are uploaded through Strapi's media API and linked to every draft
 * and published service-item component row. Existing seeded files are reused,
 * so this script is safe to run repeatedly.
 *
 * Run from the repository root after Strapi is healthy:
 *   set -a; source .env; set +a
 *   node migration_scripts/134-seed-about-service-images.js
 */

const { execFileSync } = require('node:child_process');

const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337')
  .replace('smilux-strapi', 'localhost')
  .replace(/\/$/, '');
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const POSTGRES_CONTAINER = process.env.POSTGRES_CONTAINER || 'dental-postgres';
const POSTGRES_DATABASE = process.env.DATABASE_NAME || 'dental_cms_strapi';
const POSTGRES_USER = process.env.DATABASE_USERNAME || 'postgres';

const SERVICES = [
  ['dental-implants', 'service-dental-implants.jpg', 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=82&w=1200'],
  ['dental-braces', 'service-dental-braces.jpg', 'https://images.unsplash.com/photo-1657470179447-0f5aa16daa91?auto=format&fit=crop&q=82&w=1200'],
  ['dental-bleaching', 'service-teeth-whitening.jpg', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=82&w=1200'],
  ['dental-veneers', 'service-dental-veneers.jpg', 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=82&w=1200'],
  ['dental-veneers-cost', 'service-dental-crowns.jpg', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=82&w=1200'],
  ['general-check-up', 'service-general-dentistry.jpg', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=82&w=1200'],
];

function psql(sql, inherit = false) {
  const args = [
    'exec', POSTGRES_CONTAINER, 'psql', '-U', POSTGRES_USER, '-d', POSTGRES_DATABASE,
    '-At', '-c', sql,
  ];
  if (inherit) {
    execFileSync('docker', args, { stdio: 'inherit' });
    return '';
  }
  return execFileSync('docker', args, { encoding: 'utf8' }).trim();
}

async function strapi(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${API_TOKEN}`, ...(options.headers || {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path} failed (${response.status}): ${JSON.stringify(body)}`);
  return body;
}

async function findOrUpload([slug, fileName, source]) {
  const query = new URLSearchParams({
    'filters[name][$eq]': fileName,
    'pagination[pageSize]': '1',
  });
  const existing = await strapi(`/api/upload/files?${query}`);
  if (existing?.length) {
    console.log(`[REUSE] ${slug} -> media ${existing[0].id}`);
    return [slug, existing[0].id];
  }

  const sourceResponse = await fetch(source);
  if (!sourceResponse.ok) throw new Error(`Download failed for ${slug}: ${sourceResponse.status}`);
  const form = new FormData();
  form.append('files', new Blob([await sourceResponse.arrayBuffer()], {
    type: sourceResponse.headers.get('content-type') || 'image/jpeg',
  }), fileName);
  form.append('fileInfo', JSON.stringify({
    name: fileName,
    alternativeText: `${slug.replaceAll('-', ' ')} service`,
    caption: 'Smilux Dental service image',
  }));
  const uploaded = await strapi('/api/upload', { method: 'POST', body: form });
  const file = uploaded?.[0];
  if (!file?.id) throw new Error(`Upload returned no media ID for ${slug}`);
  console.log(`[UPLOAD] ${slug} -> media ${file.id}`);
  return [slug, file.id];
}

async function run() {
  if (!API_TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const media = Object.fromEntries(await Promise.all(SERVICES.map(findOrUpload)));
  const values = SERVICES.map(([slug]) => `(${Number(media[slug])}, '${slug}')`).join(',');
  const sql = `
    BEGIN;
    CREATE TEMP TABLE seeded_service_media (file_id integer, slug text) ON COMMIT DROP;
    INSERT INTO seeded_service_media (file_id, slug) VALUES ${values};
    DELETE FROM files_related_mph rel
    USING components_services_overview_service_items item, seeded_service_media seed
    WHERE rel.related_type = 'services-overview.service-item'
      AND rel.field = 'image' AND rel.related_id = item.id AND item.slug = seed.slug;
    INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
    SELECT seed.file_id, item.id, 'services-overview.service-item', 'image', 1
    FROM components_services_overview_service_items item
    JOIN seeded_service_media seed ON seed.slug = item.slug;
    COMMIT;
  `;
  psql(sql, true);
  console.log('[VERIFY] service media links');
  console.log(psql("SELECT item.slug || ':' || file.id || ':' || file.url FROM components_services_overview_service_items item JOIN files_related_mph rel ON rel.related_id = item.id AND rel.related_type = 'services-overview.service-item' AND rel.field = 'image' JOIN files file ON file.id = rel.file_id WHERE item.slug IN ('dental-implants','dental-braces','dental-bleaching','dental-veneers','dental-veneers-cost','general-check-up') ORDER BY item.slug, item.id;"));
}

run().catch((error) => {
  console.error(`[FAIL] ${error.message}`);
  process.exitCode = 1;
});
