#!/usr/bin/env node

/**
 * Migration Script 052: Disable i18n for contact-page in Strapi metadata
 *
 * This script updates Strapi's internal metadata to explicitly disable i18n
 * for the contact-page content type. This prevents the "Invalid key title at
 * localizations.contact_form.fields" error in Strapi Admin.
 *
 * Changes:
 *  1. Remove locale column from contact_pages table
 *  2. Update Strapi metadata to disable i18n for contact-page
 *  3. Remove any i18n-related configuration from content manager
 *
 * Run (dev):
 *   node migration_scripts/052-disable-i18n-for-contact-page.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 \
 *   DATABASE_NAME=dental_cms_strapi DATABASE_USERNAME=postgres \
 *   DATABASE_PASSWORD=postgres \
 *   node migration_scripts/052-disable-i18n-for-contact-page.js
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
  console.log("MIGRATION 052: Disable i18n for contact-page");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Remove locale column ─────────────────────────────────────
    console.log("STEP 1: Removing locale column from contact_pages...");

    const checkLocale = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contact_pages' 
      AND column_name = 'locale'
    `);

    if (checkLocale.rows.length > 0) {
      await client.query(`
        ALTER TABLE contact_pages DROP COLUMN locale
      `);
      console.log("  [OK] Removed locale column\n");
    } else {
      console.log("  [SKIP] locale column not found\n");
    }

    // ── STEP 2: Remove locale from clinic_locations ──────────────────────
    console.log("STEP 2: Removing locale column from clinic_locations...");

    const checkLocale2 = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'clinic_locations' 
      AND column_name = 'locale'
    `);

    if (checkLocale2.rows.length > 0) {
      await client.query(`
        ALTER TABLE clinic_locations DROP COLUMN locale
      `);
      console.log("  [OK] Removed locale column\n");
    } else {
      console.log("  [SKIP] locale column not found\n");
    }

    // ── STEP 3: Update Strapi metadata ───────────────────────────────────
    console.log("STEP 3: Updating Strapi metadata...");

    // Get current metadata
    const metadataResult = await client.query(`
      SELECT value 
      FROM strapi_core_store_settings 
      WHERE key = 'plugin_content_manager_configuration_content_types::api::contact-page.contact-page'
    `);

    if (metadataResult.rows.length > 0) {
      const metadata = JSON.parse(metadataResult.rows[0].value);

      // Remove localizations from metadatas if it exists
      if (metadata.metadatas && metadata.metadatas.localizations) {
        delete metadata.metadatas.localizations;
        console.log("  [OK] Removed localizations from metadatas");
      }

      // Update the metadata
      await client.query(
        `
        UPDATE strapi_core_store_settings 
        SET value = $1 
        WHERE key = 'plugin_content_manager_configuration_content_types::api::contact-page.contact-page'
      `,
        [JSON.stringify(metadata)],
      );

      console.log("  [OK] Updated Strapi metadata\n");
    } else {
      console.log("  [SKIP] No metadata found\n");
    }

    // ── STEP 4: Verify ────────────────────────────────────────────────────
    console.log("STEP 4: Verifying...");

    const verifyLocale = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contact_pages' 
      AND column_name = 'locale'
    `);

    if (verifyLocale.rows.length === 0) {
      console.log("  [OK] locale column removed from contact_pages");
    } else {
      console.log("  [ERROR] locale column still exists in contact_pages");
    }

    const verifyLocale2 = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'clinic_locations' 
      AND column_name = 'locale'
    `);

    if (verifyLocale2.rows.length === 0) {
      console.log("  [OK] locale column removed from clinic_locations");
    } else {
      console.log("  [ERROR] locale column still exists in clinic_locations");
    }

    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 052 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nIMPORTANT: Next steps:");
    console.log("  1. Restart Strapi: pm2 restart strapi");
    console.log("  2. Clear cache: rm -rf .cache");
    console.log("  3. Test Strapi Admin: Content Manager → Contact Page");
    console.log("  4. If error persists, check schema file has:");
    console.log('     "pluginOptions": { "i18n": { "localized": false } }');
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
