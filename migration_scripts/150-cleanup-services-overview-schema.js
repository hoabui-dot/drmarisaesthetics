#!/usr/bin/env node

/** Remove Services Overview fields that are no longer part of the current UI contract. */
const { Client } = require('pg');

const client = new Client({
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT || 5437),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

async function run() {
  await client.connect();
  try {
    await client.query('BEGIN');

    // The active hero only uses badge, title, description and hero_image.
    await client.query(`
      DO $$
      BEGIN
        IF to_regclass('public.components_services_overview_hero_cmps') IS NOT NULL THEN
          DELETE FROM components_services_overview_hero_cmps WHERE field = 'trust';
        END IF;
      END $$;
    `);
    await client.query('DROP TABLE IF EXISTS components_services_overview_trust_items CASCADE');

    // The active service cards do not render category metadata.
    await client.query('ALTER TABLE components_services_overview_service_items DROP COLUMN IF EXISTS category');

    // The active CTA is a background-image banner; legacy highlight/person fields are unused.
    await client.query("DELETE FROM files_related_mph WHERE related_type = 'services-overview.cta' AND field = 'human_image'");
    await client.query('ALTER TABLE components_services_overview_ctas DROP COLUMN IF EXISTS highlight_text');

    // Remove orphaned feature rows left by earlier non-idempotent seeds.
    await client.query(`
      DELETE FROM components_services_overview_feature_items item
      WHERE NOT EXISTS (
        SELECT 1 FROM components_services_overview_features_cmps link
        WHERE link.cmp_id = item.id
      )
    `);

    await client.query('COMMIT');
    console.log('[SERVICES SCHEMA] removed legacy trust, category, CTA highlight/person fields and orphan features');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(`[SERVICES SCHEMA] failed: ${error.message}`);
  process.exitCode = 1;
});
