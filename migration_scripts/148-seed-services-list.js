#!/usr/bin/env node

/** Seed the ten CMS service cards required by the Services list specification. */
const { Client } = require('pg');

const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const client = new Client({ host: process.env.DATABASE_HOST || 'dental-postgres', port: Number(process.env.DATABASE_PORT || 5432), database: process.env.DATABASE_NAME || 'dental_cms_strapi', user: process.env.DATABASE_USERNAME || 'postgres', password: process.env.DATABASE_PASSWORD || 'postgres' });

const services = [
  ['dental-implants', 'Dental Implants', 'Implants', 'Replace missing teeth with strong, natural-looking implants that last a lifetime.', 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=900'],
  ['dental-veneers-cost', 'Cosmetic Crowns', 'Cosmetic', 'Enhance the shape, color, and strength of your teeth with custom-crafted crowns.', 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=900'],
  ['dental-braces', 'Orthodontics', 'Orthodontics', 'Straighten your teeth and improve your bite with advanced braces or clear aligners.', 'https://images.unsplash.com/photo-1588776814546-1ffbb083ac22?auto=format&fit=crop&q=80&w=900'],
  ['teeth-cleaning', 'Teeth Cleaning', 'General', 'Remove plaque and tartar buildup for healthier gums and a brighter smile.', 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=900'],
  ['tooth-extraction', 'Tooth Extraction', 'General', 'Safe and comfortable removal of damaged or problematic teeth when necessary.', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=900'],
  ['root-canal-treatment', 'Root Canal Treatment', 'General', 'Relieve pain and save damaged teeth with gentle and effective root canal therapy.', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=900'],
  ['tooth-filling', 'Tooth Filling', 'General', 'Restore cavities with tooth-colored fillings that blend seamlessly with your smile.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=900'],
  ['dental-jewelry', 'Dental Jewelry', 'Cosmetic', 'Add a touch of sparkle to your smile with safe and stylish dental gems.', 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=900'],
  ['dental-bleaching', 'Teeth Whitening', 'Cosmetic', 'Brighten stained or discolored teeth and achieve a noticeably whiter smile.', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=900'],
  ['pediatric-dentistry', 'Pediatric Dentistry', 'General', "Gentle, compassionate care designed to keep children's smiles healthy and happy.", 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=900'],
];

async function api(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, { ...options, headers: { Authorization: `Bearer ${API_TOKEN}`, ...(options.headers || {}) } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function uploadImage(slug, url) {
  const name = `service-${slug}.jpg`;
  const existing = await api(`/api/upload/files?filters[name][$eq]=${encodeURIComponent(name)}&pagination[pageSize]=1`);
  if (existing?.[0]) return existing[0].id;
  const source = await fetch(url);
  if (!source.ok) throw new Error(`Image download failed for ${slug}: ${source.status}`);
  const form = new FormData();
  form.append('files', await source.blob(), name);
  form.append('fileInfo', JSON.stringify({ name, alternativeText: `${slug.replaceAll('-', ' ')} dental service` }));
  const uploaded = await api('/api/upload', { method: 'POST', body: form });
  return uploaded[0].id;
}

async function linkImage(fileId, serviceId) {
  await client.query('DELETE FROM files_related_mph WHERE related_type = $1 AND related_id = $2 AND field = $3', ['services-overview.service-item', serviceId, 'image']);
  await client.query('INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order") VALUES ($1, $2, $3, $4, 1)', [fileId, serviceId, 'services-overview.service-item', 'image']);
}

async function run() {
  if (!API_TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  await client.connect();
  try {
    await client.query('BEGIN');
    const cards = await client.query("SELECT cmp_id FROM services_overview_cmps WHERE field = 'layout' AND component_type = 'services-overview.service-cards' ORDER BY entity_id");
    for (const card of cards.rows) await client.query("DELETE FROM components_services_overview_service_cards_cmps WHERE entity_id = $1 AND field = 'services'", [card.cmp_id]);
    for (let index = 0; index < services.length; index += 1) {
      const [slug, title, , description, imageUrl] = services[index];
      const existing = await client.query('SELECT id FROM components_services_overview_service_items WHERE slug = $1 ORDER BY id LIMIT 1', [slug]);
      const serviceId = existing.rows[0]
        ? existing.rows[0].id
        : (await client.query('INSERT INTO components_services_overview_service_items (slug, title, description) VALUES ($1, $2, $3) RETURNING id', [slug, title, description])).rows[0].id;
      await client.query('UPDATE components_services_overview_service_items SET title = $1, description = $2 WHERE id = $3', [title, description, serviceId]);
      const imageId = await uploadImage(slug, imageUrl);
      await linkImage(imageId, serviceId);
      for (const card of cards.rows) {
        await client.query('INSERT INTO components_services_overview_service_cards_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, $3, $4, $5)', [card.cmp_id, serviceId, 'services-overview.service-item', 'services', index + 1]);
      }
    }
    await client.query('COMMIT');
    console.log(`[SERVICES LIST] seeded ${services.length} services across ${cards.rows.length} CMS cards`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { await client.end(); }
}

run().catch((error) => { console.error(`[SERVICES LIST] failed: ${error.message}`); process.exitCode = 1; });
