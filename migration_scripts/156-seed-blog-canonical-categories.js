#!/usr/bin/env node

/** Normalize blog categories to the values exposed by the Knowledge Center filter. */
const { Client } = require('pg');

const client = new Client({
  host: process.env.DATABASE_HOST || 'dental-postgres',
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

const categories = {
  'dental-implants': 'Implant Dentistry',
  'cosmetic-dental-crowns': 'Cosmetic Dentistry',
  'professional-teeth-whitening': 'Cosmetic Dentistry',
  'invisalign-clear-aligners': 'Orthodontics',
  'pediatric-oral-care': 'Preventive Care',
  'safe-wisdom-tooth-extraction': 'Preventive Care',
};

async function run() {
  await client.connect();
  try {
    await client.query('BEGIN');
    let updated = 0;
    for (const [slug, category] of Object.entries(categories)) {
      const result = await client.query(
        `UPDATE blogs
         SET category = $1,
             author_name = COALESCE(NULLIF(author_name, ''), 'Smilux Dental Team'),
             meta_description = COALESCE(NULLIF(meta_description, ''), excerpt),
             reading_time = COALESCE(NULLIF(reading_time, ''), '1 min read'),
             updated_at = NOW()
         WHERE slug = $2`,
        [category, slug],
      );
      updated += result.rowCount || 0;
    }
    await client.query('COMMIT');
    console.log(`[BLOG CATEGORY] normalized ${updated} blog records to canonical filter values`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(`[BLOG CATEGORY] failed: ${error.message}`);
  process.exitCode = 1;
});
