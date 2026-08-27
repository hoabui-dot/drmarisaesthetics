#!/usr/bin/env node

/** Seed the CMS-owned tooth image, trust statistics, and accreditation logos. */
const { Client } = require('pg');

const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const client = new Client({
  host: process.env.DATABASE_HOST || 'dental-postgres',
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

const toothFile = ['about-why-tooth.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" fill="none" stroke="#0151F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 9c5-5 10-4 16-1 6-3 11-4 16 1 8 7 6 19 2 28-3 7-5 17-8 25-2 5-7 5-10 0l-4-10-4 10c-3 5-8 5-10 0-3-8-5-18-8-25C10 28 8 16 16 9Z"/><path d="M28 25c2-2 6-2 8 0"/></svg>'];

async function api(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, { ...options, headers: { Authorization: `Bearer ${API_TOKEN}`, ...(options.headers || {}) } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function uploadTooth() {
  const fileName = toothFile[0];
  const existing = await api(`/api/upload/files?filters[name][$eq]=${encodeURIComponent(fileName)}&pagination[pageSize]=1`);
  if (existing?.[0]) return existing[0].id;
  const form = new FormData();
  form.append('files', new Blob([toothFile[1]], { type: 'image/svg+xml' }), fileName);
  form.append('fileInfo', JSON.stringify({ name: fileName, alternativeText: 'Tooth trust statistic icon' }));
  const uploaded = await api('/api/upload', { method: 'POST', body: form });
  return uploaded[0].id;
}

async function linkMedia(fileId, relatedId, relatedType, field) {
  await client.query('DELETE FROM files_related_mph WHERE related_type = $1 AND related_id = $2 AND field = $3', [relatedType, relatedId, field]);
  await client.query('INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order") VALUES ($1, $2, $3, $4, 1)', [fileId, relatedId, relatedType, field]);
}

async function run() {
  if (!API_TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const toothId = await uploadTooth();
  await client.connect();
  try {
    await client.query('BEGIN');
    const whyRows = await client.query("SELECT cmp_id FROM about_pages_cmps WHERE field = 'sections' AND component_type = 'about.why-choose-us'");
    const stats = [['10,000+', 'Happy Patients'], ['15+', 'Years of Experience'], ['98%', 'Patient Satisfaction']];
    for (const row of whyRows.rows) {
      await linkMedia(toothId, row.cmp_id, 'about.why-choose-us', 'toothImage');
      const oldLinks = await client.query("SELECT id, cmp_id FROM components_about_why_choose_us_cmps WHERE entity_id = $1 AND field = 'statistics' ORDER BY \"order\", id", [row.cmp_id]);
      await client.query("DELETE FROM components_about_why_choose_us_cmps WHERE entity_id = $1 AND field = 'statistics'", [row.cmp_id]);
      for (const old of oldLinks.rows) await client.query('DELETE FROM components_about_why_choose_statistics WHERE id = $1', [old.cmp_id]);
      for (let index = 0; index < stats.length; index += 1) {
        const item = await client.query('INSERT INTO components_about_why_choose_statistics (value, label) VALUES ($1, $2) RETURNING id', stats[index]);
        await client.query("INSERT INTO components_about_why_choose_us_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'about.why-choose-statistic', 'statistics', $3)", [row.cmp_id, item.rows[0].id, index]);
      }
    }

    const media = await client.query("SELECT id, name FROM files WHERE name IN ('certificate-icon.png', 'iso-icon.png', 'icoi-icon.png', 'aao-icon.png')");
    const mediaByName = Object.fromEntries(media.rows.map((item) => [item.name, item.id]));
    const accreditationRows = await client.query("SELECT cmp_id, \"order\" FROM components_about_why_choose_us_cmps WHERE field = 'accreditations' AND component_type = 'about.accreditation' ORDER BY entity_id, \"order\"");
    const logoNames = ['certificate-icon.png', 'iso-icon.png', 'icoi-icon.png', 'aao-icon.png'];
    for (const row of accreditationRows.rows) {
      const fileId = mediaByName[logoNames[row.order] || logoNames[0]];
      if (fileId) await linkMedia(fileId, row.cmp_id, 'about.accreditation', 'logo');
    }
    await client.query('COMMIT');
    console.log(`[ABOUT TRUST] seeded tooth image, ${whyRows.rows.length * 3} statistics, and ${accreditationRows.rows.length} accreditation logos`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => { console.error(`[ABOUT TRUST] failed: ${error.message}`); process.exitCode = 1; });
