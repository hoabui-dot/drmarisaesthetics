#!/usr/bin/env node

/** Remove the deprecated FAQ component from both Contact Page documents. */
const { Client } = require('pg');

const client = new Client({
  host: process.env.DATABASE_HOST || 'dental-postgres',
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

async function run() {
  await client.connect();
  try {
    await client.query('BEGIN');
    const faqLinks = await client.query("SELECT cmp_id FROM contact_pages_cmps WHERE component_type = 'contact.faq'");
    for (const row of faqLinks.rows) {
      await client.query('DELETE FROM components_contact_faqs_cmps WHERE entity_id = $1', [row.cmp_id]);
      await client.query('DELETE FROM components_contact_faqs WHERE id = $1', [row.cmp_id]);
    }
    await client.query("DELETE FROM contact_pages_cmps WHERE component_type = 'contact.faq'");
    await client.query('COMMIT');
    console.log(`[CONTACT FAQ] removed ${faqLinks.rows.length} FAQ links`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => { console.error(`[CONTACT FAQ] failed: ${error.message}`); process.exitCode = 1; });
