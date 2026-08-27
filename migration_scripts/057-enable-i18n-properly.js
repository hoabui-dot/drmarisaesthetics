#!/usr/bin/env node

/**
 * Migration Script 057: Enable i18n properly for contact-page
 *
 * Since Strapi keeps adding the locale column regardless of our schema configuration,
 * this script properly sets up i18n infrastructure so it works correctly.
 *
 * Run (dev):
 *   node migration_scripts/057-enable-i18n-properly.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 \
 *   DATABASE_NAME=dental_cms_strapi DATABASE_USERNAME=postgres \
 *   DATABASE_PASSWORD=postgres \
 *   node migration_scripts/057-enable-i18n-properly.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 057: Enable i18n properly");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Ensure locale column exists and is set ───────────────────
    console.log("STEP 1: Ensuring locale column exists and is set...");

    const checkLocale = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contact_pages' 
      AND column_name = 'locale'
    `);

    if (checkLocale.rows.length === 0) {
      await client.query(`
        ALTER TABLE contact_pages ADD COLUMN locale VARCHAR(255)
      `);
      console.log("  [OK] Added locale column");
    } else {
      console.log("  [OK] locale column exists");
    }

    // Set locale to 'en' for all rows
    await client.query(`
      UPDATE contact_pages SET locale = 'en' WHERE locale IS NULL OR locale = ''
    `);
    console.log("  [OK] Set locale to 'en'\n");

    // ── STEP 2: Create localizations link table ──────────────────────────
    console.log("STEP 2: Creating localizations link table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_pages_localizations_lnk (
        id SERIAL PRIMARY KEY,
        contact_page_id INTEGER REFERENCES contact_pages(id) ON DELETE CASCADE,
        inv_contact_page_id INTEGER REFERENCES contact_pages(id) ON DELETE CASCADE,
        contact_page_ord DOUBLE PRECISION
      )
    `);
    console.log("  [OK] Table created");

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS contact_pages_localizations_lnk_fk 
      ON contact_pages_localizations_lnk(contact_page_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS contact_pages_localizations_lnk_inv_fk 
      ON contact_pages_localizations_lnk(inv_contact_page_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS contact_pages_localizations_lnk_order_fk 
      ON contact_pages_localizations_lnk(contact_page_ord)
    `);
    console.log("  [OK] Indexes created\n");

    // ── STEP 3: Do the same for clinic_locations ─────────────────────────
    console.log("STEP 3: Setting up clinic_locations...");

    const checkLocale2 = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'clinic_locations' 
      AND column_name = 'locale'
    `);

    if (checkLocale2.rows.length === 0) {
      await client.query(`
        ALTER TABLE clinic_locations ADD COLUMN locale VARCHAR(255)
      `);
      console.log("  [OK] Added locale column");
    } else {
      console.log("  [OK] locale column exists");
    }

    await client.query(`
      UPDATE clinic_locations SET locale = 'en' WHERE locale IS NULL OR locale = ''
    `);
    console.log("  [OK] Set locale to 'en'");

    await client.query(`
      CREATE TABLE IF NOT EXISTS clinic_locations_localizations_lnk (
        id SERIAL PRIMARY KEY,
        clinic_location_id INTEGER REFERENCES clinic_locations(id) ON DELETE CASCADE,
        inv_clinic_location_id INTEGER REFERENCES clinic_locations(id) ON DELETE CASCADE,
        clinic_location_ord DOUBLE PRECISION
      )
    `);
    console.log("  [OK] Localizations table created\n");

    // ── STEP 4: Update schema files to enable i18n ───────────────────────
    console.log("STEP 4: Schema files need to be updated...");
    console.log("  [INFO] Change pluginOptions from:");
    console.log('    "i18n": { "localized": false }');
    console.log("  [INFO] To:");
    console.log('    "i18n": { "localized": true }');
    console.log("  [INFO] Or remove pluginOptions entirely\n");

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 057 COMPLETED");
    console.log("=".repeat(70));
    console.log("\nNOTE:");
    console.log("  i18n infrastructure is now properly set up.");
    console.log("  The error should be resolved.");
    console.log("");
    console.log("IMPORTANT:");
    console.log("  1. Restart Strapi: pm2 restart strapi");
    console.log("  2. Test Strapi Admin: Content Manager → Contact Page");
    console.log("\n");
  } catch (err) {
    console.error("\n[ERROR]", err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log("[OK] Connection closed");
  }
}

run();
