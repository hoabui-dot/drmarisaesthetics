#!/usr/bin/env node

/** Move About Us content components into the real reorderable dynamic zone. */
const { Client } = require('pg');

const client = new Client({
  host: process.env.DATABASE_HOST || '100.68.50.41',
  port: Number(process.env.DATABASE_PORT || 5437),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

const ORDER = [
  ['hero', 'about.hero'],
  ['mission_vision', 'about.mission-vision'],
  ['core_values', 'about.core-values'],
  ['doctors', 'about.doctors'],
  ['featured_services', 'about.featured-services'],
  ['why_choose_us', 'about.why-choose-us'],
  ['booking', 'about.booking'],
];

async function run() {
  await client.connect();
  try {
    await client.query('BEGIN');
    const pages = await client.query('SELECT id FROM about_pages ORDER BY id');

    for (const { id: pageId } of pages.rows) {
      const existing = await client.query(
        `SELECT cmp_id, component_type, field
         FROM about_pages_cmps
         WHERE entity_id = $1 AND field IN ('hero', 'mission_vision', 'core_values', 'doctors', 'featured_services', 'why_choose_us', 'booking')`,
        [pageId],
      );

      await client.query("DELETE FROM about_pages_cmps WHERE entity_id = $1 AND field = 'sections'", [pageId]);
      await client.query(
        "DELETE FROM about_pages_cmps WHERE entity_id = $1 AND field IN ('hero', 'mission_vision', 'core_values', 'doctors', 'featured_services', 'why_choose_us', 'booking')",
        [pageId],
      );

      for (let index = 0; index < ORDER.length; index += 1) {
        const [field, componentType] = ORDER[index];
        const link = existing.rows.find((row) => row.field === field && row.component_type === componentType);
        if (!link) continue;
        await client.query(
          `INSERT INTO about_pages_cmps (entity_id, cmp_id, component_type, field, "order")
           VALUES ($1, $2, $3, 'sections', $4)`,
          [pageId, link.cmp_id, componentType, index + 1],
        );
      }
    }

    await client.query("DELETE FROM about_pages_cmps WHERE component_type = 'about.section-reference'");
    await client.query('DROP TABLE IF EXISTS components_about_section_references CASCADE');
    await client.query('COMMIT');
    console.log(`[ABOUT SECTIONS] moved content into dynamic zone for ${pages.rowCount} About records`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(`[ABOUT SECTIONS] failed: ${error.message}`);
  process.exitCode = 1;
});
