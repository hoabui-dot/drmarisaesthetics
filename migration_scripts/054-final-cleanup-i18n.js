#!/usr/bin/env node

/**
 * Migration Script 054: Final cleanup - Remove i18n infrastructure
 *
 * This script removes all i18n-related columns and tables now that the schema
 * files have been updated with i18n disabled.
 *
 * Run this AFTER:
 *  1. Schema files are deployed with "i18n": { "localized": false }
 *  2. Strapi cache is cleared
 *  3. Strapi is restarted
 *
 * Changes:
 *  1. DROP locale column from contact_pages
 *  2. DROP locale column from clinic_locations
 *  3. DROP localizations link tables
 *
 * Run (dev):
 *   node migration_scripts/054-final-cleanup-i18n.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 \
 *   DATABASE_NAME=dental_cms_strapi DATABASE_USERNAME=postgres \
 *   DATABASE_PASSWORD=postgres \
 *   node migration_scripts/054-final-cleanup-i18n.js
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
  console.log("MIGRATION 054: Final i18n cleanup");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Drop localizations tables ────────────────────────────────
    console.log("STEP 1: Dropping localizations tables...");

    await client.query(`
      DROP TABLE IF EXISTS contact_pages_localizations_lnk CASCADE
    `);
    console.log("  [OK] Dropped contact_pages_localizations_lnk");

    await client.query(`
      DROP TABLE IF EXISTS clinic_locations_localizations_lnk CASCADE
    `);
    console.log("  [OK] Dropped clinic_locations_localizations_lnk\n");

    // ── STEP 2: Drop locale columns ──────────────────────────────────────
    console.log("STEP 2: Dropping locale columns...");

    const checkLocale1 = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contact_pages' 
      AND column_name = 'locale'
    `);

    if (checkLocale1.rows.length > 0) {
      await client.query(`
        ALTER TABLE contact_pages DROP COLUMN locale
      `);
      console.log("  [OK] Dropped locale from contact_pages");
    } else {
      console.log("  [SKIP] locale not found in contact_pages");
    }

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
      console.log("  [OK] Dropped locale from clinic_locations");
    } else {
      console.log("  [SKIP] locale not found in clinic_locations");
    }

    console.log();

    // ── STEP 3: Verify ────────────────────────────────────────────────────
    console.log("STEP 3: Verifying cleanup...");

    const verifyTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%localizations%'
      ORDER BY table_name
    `);

    if (verifyTables.rows.length === 0) {
      console.log("  [OK] No localizations tables found");
    } else {
      console.log(
        `  [WARNING] Found ${verifyTables.rows.length} localizations tables:`,
      );
      verifyTables.rows.forEach((row) => {
        console.log(`    - ${row.table_name}`);
      });
    }

    const verifyLocale1 = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contact_pages' 
      AND column_name = 'locale'
    `);

    if (verifyLocale1.rows.length === 0) {
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
    console.log("MIGRATION 054 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNOTE:");
    console.log("  - i18n infrastructure has been removed");
    console.log("  - Schema files have i18n disabled");
    console.log("  - Strapi will NOT recreate locale columns on restart");
    console.log("");
    console.log("IMPORTANT: You MUST restart Strapi now:");
    console.log("  1. Clear cache: rm -rf .cache");
    console.log("  2. Restart: pm2 restart strapi");
    console.log("  3. Test Strapi Admin: Content Manager → Contact Page");
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
