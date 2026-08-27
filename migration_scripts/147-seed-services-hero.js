#!/usr/bin/env node

/** Seed the Services hero copy and treatment-room image for draft/published entries. */
const { Client } = require('pg');

const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const SOURCE_IMAGE_URL = 'https://images.unsplash.com/photo-1642844771937-23accb161a3d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400';
const IMAGE_NAME = 'services-hero-treatment-room.jpg';
const client = new Client({
  host: process.env.DATABASE_HOST || 'dental-postgres',
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

async function api(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, { ...options, headers: { Authorization: `Bearer ${API_TOKEN}`, ...(options.headers || {}) } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function uploadImage() {
  const existing = await api(`/api/upload/files?filters[name][$eq]=${encodeURIComponent(IMAGE_NAME)}&pagination[pageSize]=1`);
  if (existing?.[0]) return existing[0].id;
  const source = await fetch(SOURCE_IMAGE_URL);
  if (!source.ok) throw new Error(`Image download failed: ${source.status}`);
  const form = new FormData();
  form.append('files', await source.blob(), IMAGE_NAME);
  form.append('fileInfo', JSON.stringify({ name: IMAGE_NAME, alternativeText: 'Modern Smilux dental treatment room with dental chair and monitor' }));
  const uploaded = await api('/api/upload', { method: 'POST', body: form });
  return uploaded[0].id;
}

async function linkMedia(fileId, relatedId) {
  await client.query('DELETE FROM files_related_mph WHERE related_type = $1 AND related_id = $2 AND field = $3', ['services-overview.hero', relatedId, 'hero_image']);
  await client.query('INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order") VALUES ($1, $2, $3, $4, 1)', [fileId, relatedId, 'services-overview.hero', 'hero_image']);
}

async function run() {
  if (!API_TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const imageId = await uploadImage();
  await client.connect();
  try {
    await client.query('BEGIN');
    const heroes = await client.query("SELECT cmp_id FROM services_overview_cmps WHERE field = 'layout' AND component_type = 'services-overview.hero' ORDER BY entity_id");
    for (const hero of heroes.rows) {
      await client.query('UPDATE components_services_overview_hero SET badge = $1, title = $2, description = $3 WHERE id = $4', [
        'OUR SERVICES',
        'Comprehensive Dental Care for Every Smile',
        'From advanced treatments to cosmetic enhancements, Smilux Dental provides personalized care using modern technology and a patient-first approach.',
        hero.cmp_id,
      ]);
      await linkMedia(imageId, hero.cmp_id);
    }
    await client.query('COMMIT');
    console.log(`[SERVICES HERO] seeded ${heroes.rows.length} hero components with image ${imageId}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => { console.error(`[SERVICES HERO] failed: ${error.message}`); process.exitCode = 1; });
