#!/usr/bin/env node

/** Seed the six CMS-managed Why Choose benefits and four compact accreditations. */
const { Client } = require('pg');

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || '100.68.50.41',
  port: Number(process.env.DATABASE_PORT || 5437),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
};

const BENEFITS = [
  ['Experienced Dentists', 'Board-certified specialists with years of clinical expertise.', 'team'],
  ['Advanced Digital Technology', 'State-of-the-art equipment for precise diagnosis and treatment.', 'medical-monitor'],
  ['Personalized Treatment Plans', 'Care plans tailored to your needs and lifestyle.', 'clipboard'],
  ['Transparent Consultation', 'Clear explanations and honest, upfront recommendations.', 'message'],
  ['International-Quality Care', 'Standards aligned with leading global dental practices.', 'globe'],
  ['Comfortable Modern Clinic', 'Relaxing environment designed for your comfort and safety.', 'dental-chair'],
];

const ACCREDITATIONS = [
  ['ADA', 'American Dental Association'],
  ['ISO', 'International Standards'],
  ['ICOI', 'International Congress of Oral Implantologists'],
  ['AACD', 'American Academy of Cosmetic Dentistry'],
];

const STATISTICS = [
  ['10,000+', 'Happy Patients', 'Users'],
  ['15+', 'Years of Experience', 'Award'],
  ['98%', 'Patient Satisfaction', 'Smile'],
];

async function run() {
  const client = new Client(DB_CONFIG);
  await client.connect();
  try {
    await client.query('BEGIN');
    const whyRows = await client.query('SELECT id FROM components_about_why_choose_us ORDER BY id');
    if (whyRows.rows.length < 2) throw new Error('Expected draft and published Why Choose component rows');

    for (const { id: whyId } of whyRows.rows) {
      await client.query("UPDATE components_about_why_choose_us SET title = 'Why Choose Smilux', badge = NULL, description = NULL, updated_at = NOW() WHERE id = $1", [whyId]);
      await client.query("DELETE FROM components_about_why_choose_us_cmps WHERE entity_id = $1 AND field IN ('features', 'accreditations')", [whyId]);

      for (let index = 0; index < BENEFITS.length; index += 1) {
        const [title, description, icon] = BENEFITS[index];
        const result = await client.query(
          'INSERT INTO components_about_feature_items (title, description, icon, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
          [title, description, icon],
        );
        await client.query(
          "INSERT INTO components_about_why_choose_us_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'about.feature-item', 'features', $3)",
          [whyId, result.rows[0].id, index + 1],
        );
      }

      for (let index = 0; index < ACCREDITATIONS.length; index += 1) {
        const [shortName, description] = ACCREDITATIONS[index];
        const result = await client.query(
          'INSERT INTO components_about_accreditations (short_name, description) VALUES ($1, $2) RETURNING id',
          [shortName, description],
        );
        await client.query(
          "INSERT INTO components_about_why_choose_us_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'about.accreditation', 'accreditations', $3)",
          [whyId, result.rows[0].id, index + 1],
        );
      }
    }

    const heroRows = await client.query("SELECT cmp_id FROM about_pages_cmps WHERE component_type = 'about.hero'");
    for (const { cmp_id: heroId } of heroRows.rows) {
      await client.query("DELETE FROM components_about_heroes_cmps WHERE entity_id = $1 AND field = 'statistics'", [heroId]);
      for (let index = 0; index < STATISTICS.length; index += 1) {
        const [value, label, icon] = STATISTICS[index];
        const result = await client.query(
          'INSERT INTO components_about_hero_stats (value, label, icon) VALUES ($1, $2, $3) RETURNING id',
          [value, label, icon],
        );
        await client.query(
          "INSERT INTO components_about_heroes_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'about.hero-stat', 'statistics', $3)",
          [heroId, result.rows[0].id, index + 1],
        );
      }
    }

    await client.query('COMMIT');
    console.log('[ABOUT WHY CHOOSE] seeded 6 benefits, 4 accreditations, and shared 3 statistics');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(`[ABOUT WHY CHOOSE] failed: ${error.message}`);
  process.exitCode = 1;
});
