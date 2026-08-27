#!/usr/bin/env node

/**
 * Migration Script 051: Remove locale columns from contact_pages and clinic_locations
 *
 * This script removes the locale column that's causing i18n errors in Strapi Admin.
 * The locale column was created by the migration but i18n is not properly configured,
 * causing "Invalid key title at localizations.contact_form.fields" error.
 *
 * Changes:
 *  1. DROP locale column from contact_pages
 *  2. DROP locale column from clinic_locations (if exists)
 *
 * Run (dev):
 *   node migration_scripts/051-remove-locale-columns.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 \
 *   DATABASE_NAME=dental_cms_strapi DATABASE_USERNAME=postgres \
 *   DATABASE_PASSWORD=postgres \
 *   node migration_scripts/051-remove-locale-columns.js
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
  console.log("MIGRATION 051: Remove locale columns");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check if locale column exists ────────────────────────────
    console.log("STEP 1: Checking for locale columns...");

    const checkContactPages = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contact_pages' 
      AND column_name = 'locale'
    `);

    const checkClinicLocations = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'clinic_locations' 
      AND column_name = 'locale'
    `);

    console.log(
      `  contact_pages.locale: ${checkContactPages.rows.length > 0 ? "EXISTS" : "NOT FOUND"}`,
    );
    console.log(
      `  clinic_locations.locale: ${checkClinicLocations.rows.length > 0 ? "EXISTS" : "NOT FOUND"}`,
    );
    console.log();

    // ── STEP 2: Remove locale from contact_pages ─────────────────────────
    if (checkContactPages.rows.length > 0) {
      console.log("STEP 2: Removing locale column from contact_pages...");

      await client.query(`
        ALTER TABLE contact_pages DROP COLUMN locale
      `);

      console.log("  [OK] Removed locale column from contact_pages\n");
    } else {
      console.log("STEP 2: [SKIP] locale column not found in contact_pages\n");
    }

    // ── STEP 3: Remove locale from clinic_locations ──────────────────────
    if (checkClinicLocations.rows.length > 0) {
      console.log("STEP 3: Removing locale column from clinic_locations...");

      await client.query(`
        ALTER TABLE clinic_locations DROP COLUMN locale
      `);

      console.log("  [OK] Removed locale column from clinic_locations\n");
    } else {
      console.log(
        "STEP 3: [SKIP] locale column not found in clinic_locations\n",
      );
    }

    // ── STEP 4: Verify ────────────────────────────────────────────────────
    console.log("STEP 4: Verifying...");

    const verifyContactPages = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contact_pages' 
      AND column_name = 'locale'
    `);

    const verifyClinicLocations = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'clinic_locations' 
      AND column_name = 'locale'
    `);

    if (verifyContactPages.rows.length === 0) {
      console.log("  [OK] contact_pages.locale removed");
    } else {
      console.log("  [ERROR] contact_pages.locale still exists");
    }

    if (verifyClinicLocations.rows.length === 0) {
      console.log("  [OK] clinic_locations.locale removed");
    } else {
      console.log("  [ERROR] clinic_locations.locale still exists");
    }

    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 051 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to apply changes");
    console.log("  2. Clear Strapi cache: rm -rf .cache");
    console.log("  3. Test Strapi Admin: Content Manager → Contact Page");
    console.log("  4. The i18n error should be resolved\n");
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
