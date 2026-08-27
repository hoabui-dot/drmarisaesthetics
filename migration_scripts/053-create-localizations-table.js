#!/usr/bin/env node

/**
 * Migration Script 053: Create localizations link table for contact_pages
 *
 * This script creates the localizations link table that Strapi expects when
 * i18n is enabled. This is a temporary fix until the schema files are deployed
 * to production with i18n disabled.
 *
 * Changes:
 *  1. CREATE contact_pages_localizations_lnk table
 *  2. UPDATE contact_pages SET locale = 'en' WHERE locale IS NULL
 *
 * Run (dev):
 *   node migration_scripts/053-create-localizations-table.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 \
 *   DATABASE_NAME=dental_cms_strapi DATABASE_USERNAME=postgres \
 *   DATABASE_PASSWORD=postgres \
 *   node migration_scripts/053-create-localizations-table.js
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
  console.log("MIGRATION 053: Create localizations table");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Create localizations link table ──────────────────────────
    console.log("STEP 1: Creating contact_pages_localizations_lnk table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_pages_localizations_lnk (
        id SERIAL PRIMARY KEY,
        contact_page_id INTEGER REFERENCES contact_pages(id) ON DELETE CASCADE,
        inv_contact_page_id INTEGER REFERENCES contact_pages(id) ON DELETE CASCADE,
        contact_page_ord DOUBLE PRECISION
      )
    `);

    console.log("  [OK] Table created\n");

    // ── STEP 2: Create indexes ───────────────────────────────────────────
    console.log("STEP 2: Creating indexes...");

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

    // ── STEP 3: Update locale column ─────────────────────────────────────
    console.log("STEP 3: Updating locale column...");

    const updateResult = await client.query(`
      UPDATE contact_pages 
      SET locale = 'en' 
      WHERE locale IS NULL OR locale = ''
    `);

    console.log(`  [OK] Updated ${updateResult.rowCount} rows\n`);

    // ── STEP 4: Do the same for clinic_locations ─────────────────────────
    console.log("STEP 4: Creating clinic_locations_localizations_lnk table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS clinic_locations_localizations_lnk (
        id SERIAL PRIMARY KEY,
        clinic_location_id INTEGER REFERENCES clinic_locations(id) ON DELETE CASCADE,
        inv_clinic_location_id INTEGER REFERENCES clinic_locations(id) ON DELETE CASCADE,
        clinic_location_ord DOUBLE PRECISION
      )
    `);

    console.log("  [OK] Table created\n");

    console.log("STEP 5: Creating indexes for clinic_locations...");

    await client.query(`
      CREATE INDEX IF NOT EXISTS clinic_locations_localizations_lnk_fk 
      ON clinic_locations_localizations_lnk(clinic_location_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS clinic_locations_localizations_lnk_inv_fk 
      ON clinic_locations_localizations_lnk(inv_clinic_location_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS clinic_locations_localizations_lnk_order_fk 
      ON clinic_locations_localizations_lnk(clinic_location_ord)
    `);

    console.log("  [OK] Indexes created\n");

    console.log("STEP 6: Updating locale for clinic_locations...");

    const updateResult2 = await client.query(`
      UPDATE clinic_locations 
      SET locale = 'en' 
      WHERE locale IS NULL OR locale = ''
    `);

    console.log(`  [OK] Updated ${updateResult2.rowCount} rows\n`);

    // ── STEP 7: Verify ────────────────────────────────────────────────────
    console.log("STEP 7: Verifying...");

    const verifyTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name = 'contact_pages_localizations_lnk' 
           OR table_name = 'clinic_locations_localizations_lnk')
      ORDER BY table_name
    `);

    console.log(
      `  [OK] Found ${verifyTables.rows.length} localizations tables`,
    );

    const verifyLocale = await client.query(`
      SELECT COUNT(*) as count 
      FROM contact_pages 
      WHERE locale IS NULL OR locale = ''
    `);

    if (parseInt(verifyLocale.rows[0].count) === 0) {
      console.log("  [OK] All contact_pages have locale set");
    } else {
      console.log(
        `  [WARNING] ${verifyLocale.rows[0].count} contact_pages have NULL locale`,
      );
    }

    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 053 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nIMPORTANT:");
    console.log("  This is a TEMPORARY fix to make Strapi Admin work.");
    console.log(
      "  The PROPER fix is to deploy schema files with i18n disabled.",
    );
    console.log("");
    console.log("Next steps:");
    console.log("  1. Test Strapi Admin: Content Manager → Contact Page");
    console.log("  2. The error should be resolved");
    console.log("  3. Deploy schema files to permanently fix this");
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
