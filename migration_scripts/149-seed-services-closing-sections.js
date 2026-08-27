#!/usr/bin/env node

/** Seed the CMS-driven Why Choose and consultation CTA sections for Services. */
const { Client } = require('pg');

const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const CLINIC_IMAGE_URL = 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=85&w=1600';
const CLINIC_IMAGE_NAME = 'services-closing-clinic-reception.jpg';
const client = new Client({
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT || 5437),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

const reasons = [
  ['ShieldCheck', 'Experienced Dentists', 'Over 15 years of expertise delivering safe and effective treatments.'],
  ['Cpu', 'Advanced Technology', 'State-of-the-art equipment for precise diagnosis and comfortable care.'],
  ['UserRound', 'Personalized Treatment', 'Tailored solutions designed around your unique needs and goals.'],
  ['HeartHandshake', 'Patient Comfort', 'A welcoming environment with a focus on your comfort and well-being.'],
  ['Award', 'Proven Results', "Thousands of happy patients and beautiful smiles we're proud of."],
];

async function api(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${API_TOKEN}`, ...(options.headers || {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function uploadClinicImage() {
  const existing = await api(`/api/upload/files?filters[name][$eq]=${encodeURIComponent(CLINIC_IMAGE_NAME)}&pagination[pageSize]=1`);
  if (existing?.[0]) return existing[0].id;
  const source = await fetch(CLINIC_IMAGE_URL);
  if (!source.ok) throw new Error(`Clinic image download failed: ${source.status}`);
  const form = new FormData();
  form.append('files', await source.blob(), CLINIC_IMAGE_NAME);
  form.append('fileInfo', JSON.stringify({ name: CLINIC_IMAGE_NAME, alternativeText: 'Smilux Dental clinic reception and waiting area' }));
  const uploaded = await api('/api/upload', { method: 'POST', body: form });
  return uploaded[0].id;
}

async function seed() {
  if (!API_TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const imageId = await uploadClinicImage();
  await client.connect();
  try {
    await client.query('BEGIN');
    const entries = await client.query("SELECT id FROM services_overview ORDER BY id");
    if (!entries.rows.length) throw new Error('No services overview entries found');

    const featureParents = await client.query("SELECT cmp_id FROM services_overview_cmps WHERE field = 'layout' AND component_type = 'services-overview.features'");
    for (const parent of featureParents.rows) {
      await client.query('UPDATE components_services_overview_features SET eyebrow = $1, title = $2 WHERE id = $3', ['WHY CHOOSE SMILUX DENTAL?', 'Trusted Care. Lasting Smiles.', parent.cmp_id]);
      await client.query("DELETE FROM components_services_overview_features_cmps WHERE entity_id = $1 AND field = 'features'", [parent.cmp_id]);
      for (let index = 0; index < reasons.length; index += 1) {
        const [icon, title, description] = reasons[index];
        const item = await client.query('INSERT INTO components_services_overview_feature_items (icon, title, description) VALUES ($1, $2, $3) RETURNING id', [icon, title, description]);
        await client.query('INSERT INTO components_services_overview_features_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, $3, $4, $5)', [parent.cmp_id, item.rows[0].id, 'services-overview.feature-item', 'features', index + 1]);
      }
    }

    for (const entry of entries.rows) {
      const existingCta = await client.query("SELECT cmp_id FROM services_overview_cmps WHERE entity_id = $1 AND field = 'layout' AND component_type = 'services-overview.cta' LIMIT 1", [entry.id]);
      const ctaId = existingCta.rows[0]?.cmp_id || (await client.query('INSERT INTO components_services_overview_ctas (heading, description, button_label, button_link) VALUES ($1, $2, $3, $4) RETURNING id', [
        'Ready for Your Best Smile?',
        'Book a consultation with our experts today and take the first step toward a healthier, more confident you.',
        'BOOK APPOINTMENT',
        '/contact',
      ])).rows[0].id;
      await client.query('UPDATE components_services_overview_ctas SET heading = $1, description = $2, button_label = $3, button_link = $4 WHERE id = $5', ['Ready for Your Best Smile?', 'Book a consultation with our experts today and take the first step toward a healthier, more confident you.', 'BOOK APPOINTMENT', '/contact', ctaId]);
      await client.query('DELETE FROM files_related_mph WHERE related_type = $1 AND related_id = $2 AND field = $3', ['services-overview.cta', ctaId, 'background_image']);
      await client.query('INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order") VALUES ($1, $2, $3, $4, 1)', [imageId, ctaId, 'services-overview.cta', 'background_image']);
      if (!existingCta.rows[0]) {
        const maxOrder = await client.query("SELECT COALESCE(MAX(\"order\"), 0) AS max FROM services_overview_cmps WHERE entity_id = $1 AND field = 'layout'", [entry.id]);
        await client.query('INSERT INTO services_overview_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, $3, $4, $5)', [entry.id, ctaId, 'services-overview.cta', 'layout', Number(maxOrder.rows[0].max) + 1]);
      }
    }
    await client.query('COMMIT');
    console.log(`[SERVICES CLOSING] seeded ${featureParents.rows.length} Why Choose blocks, ${entries.rows.length} CTA blocks, image ${imageId}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

seed().catch((error) => { console.error(`[SERVICES CLOSING] failed: ${error.message}`); process.exitCode = 1; });
