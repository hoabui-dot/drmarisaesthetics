#!/usr/bin/env node

/**
 * Seed CMS media icons and move About Doctors/Why Choose content into their
 * current component shapes. Icons are Lucide SVGs (ISC licensed) chosen to
 * match the existing Target/Eye and lucide-react fallback icon language.
 * Run inside the Strapi container after the schema has been rebuilt.
 */
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

const ICONS = [
  ['about-mission-target.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0B2F8A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>'],
  ['about-vision-eye.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0B2F8A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>'],
  ['about-why-team.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0B2F8A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>'],
  ['about-why-technology.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0B2F8A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4M7 7h10M7 11h6"/></svg>'],
  ['about-why-plans.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0B2F8A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h4"/><path d="m15 15 1.5 1.5L19 14"/></svg>'],
  ['about-why-consultation.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0B2F8A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8 8 0 0 1-8.5 8 8.5 8.5 0 0 1-4-.9L3 20l1.4-4.7A8 8 0 1 1 21 11.5Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>'],
  ['about-why-global.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0B2F8A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>'],
  ['about-why-comfort.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0B2F8A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11V7a2 2 0 0 1 4 0v4M9 11V5a2 2 0 0 1 4 0v6M13 11V6a2 2 0 0 1 4 0v6M17 12V9a2 2 0 0 1 4 0v5c0 4-3 7-7 7h-2c-3 0-5-2-6-4l-2-4a2 2 0 0 1 3-2l2 2"/></svg>'],
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

async function uploadIcons() {
  const media = {};
  for (const [fileName, svg] of ICONS) {
    const existing = await api(`/api/upload/files?filters[name][$eq]=${encodeURIComponent(fileName)}&pagination[pageSize]=1`);
    if (existing?.[0]) {
      media[fileName] = existing[0].id;
      continue;
    }
    const form = new FormData();
    form.append('files', new Blob([svg], { type: 'image/svg+xml' }), fileName);
    form.append('fileInfo', JSON.stringify({ name: fileName, alternativeText: fileName.replace('.svg', '').replaceAll('-', ' ') }));
    const uploaded = await api('/api/upload', { method: 'POST', body: form });
    media[fileName] = uploaded[0].id;
  }
  return media;
}

async function linkMedia(fileId, relatedId, relatedType, field) {
  await client.query('DELETE FROM files_related_mph WHERE related_type = $1 AND related_id = $2 AND field = $3', [relatedType, relatedId, field]);
  await client.query('INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order") VALUES ($1, $2, $3, $4, 1)', [fileId, relatedId, relatedType, field]);
}

async function run() {
  if (!API_TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const media = await uploadIcons();
  await client.connect();
  try {
    await client.query('BEGIN');

    const missionRows = await client.query("SELECT cmp_id FROM about_pages_cmps WHERE field = 'sections' AND component_type = 'about.mission-vision'");
    for (const row of missionRows.rows) {
      await linkMedia(media['about-mission-target.svg'], row.cmp_id, 'about.mission-vision', 'missionIcon');
      await linkMedia(media['about-vision-eye.svg'], row.cmp_id, 'about.mission-vision', 'visionIcon');
    }

    const whyRows = await client.query("SELECT cmp_id FROM about_pages_cmps WHERE field = 'sections' AND component_type = 'about.why-choose-us'");
    for (const row of whyRows.rows) {
      const benefits = await client.query("SELECT id, cmp_id, \"order\" FROM components_about_why_choose_us_cmps WHERE entity_id = $1 AND field = 'features' AND component_type = 'about.feature-item' ORDER BY \"order\", id", [row.cmp_id]);
      for (let index = 0; index < benefits.rows.length; index += 1) {
        const old = await client.query('SELECT title, description FROM components_about_feature_items WHERE id = $1', [benefits.rows[index].cmp_id]);
        if (!old.rows[0]) continue;
        const item = await client.query('INSERT INTO components_about_why_choose_benefits (title, description) VALUES ($1, $2) RETURNING id', [old.rows[0].title, old.rows[0].description]);
        await client.query("UPDATE components_about_why_choose_us_cmps SET cmp_id = $1, component_type = 'about.why-choose-benefit' WHERE id = $2", [item.rows[0].id, benefits.rows[index].id]);
        await linkMedia(media[ICONS[index + 2]?.[0] || 'about-why-team.svg'], item.rows[0].id, 'about.why-choose-benefit', 'icon_image');
      }
    }

    const aboutPages = await client.query('SELECT id, published_at FROM about_pages ORDER BY id');
    for (const page of aboutPages.rows) {
      const doctorEntity = page.published_at ? 148 : 143;
      const doctorRows = await client.query("SELECT cmp_id, \"order\" FROM components_homepage_doctors_cmps WHERE entity_id = $1 AND field = 'doctors' ORDER BY \"order\"", [doctorEntity]);
      const aboutDoctor = await client.query("SELECT cmp_id FROM about_pages_cmps WHERE entity_id = $1 AND field = 'sections' AND component_type = 'about.doctors'", [page.id]);
      if (!aboutDoctor.rows[0]) continue;
      await client.query("DELETE FROM components_about_doctors_cmps WHERE entity_id = $1 AND field = 'doctors'", [aboutDoctor.rows[0].cmp_id]);
      for (const doctor of doctorRows.rows) {
        await client.query("INSERT INTO components_about_doctors_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'homepage.doctor-profile', 'doctors', $3)", [aboutDoctor.rows[0].cmp_id, doctor.cmp_id, doctor.order]);
      }
    }

    await client.query('COMMIT');
    console.log(`[ABOUT ICONS] uploaded/reused ${Object.keys(media).length} SVG icons and seeded doctors/benefits`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(`[ABOUT ICONS] failed: ${error.message}`);
  process.exitCode = 1;
});
