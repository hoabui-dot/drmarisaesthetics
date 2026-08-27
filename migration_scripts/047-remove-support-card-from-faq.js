#!/usr/bin/env node

/**
 * Migration Script 047: Remove support card fields from homepage.faq
 *
 * This script removes the SupportCard component from FAQ section:
 *  1. DROP contact_items link table
 *  2. DROP contact_items component table
 *  3. DROP cta_label column
 *  4. DROP cta_link column
 *  5. DROP doctor_image relation (files_related_mph)
 *
 * Run (dev):
 *   node migration_scripts/047-remove-support-card-from-faq.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 \
 *   DATABASE_NAME=dental_cms_strapi DATABASE_USERNAME=postgres \
 *   DATABASE_PASSWORD=postgres \
 *   node migration_scripts/047-remove-support-card-from-faq.js
 *
 * Or with Cloudflare tunnel:
 *   STRAPI_URL=https://corp-circle-register-restricted.trycloudflare.com \
 *   STRAPI_API_TOKEN=<your-token> \
 *   node migration_scripts/047-remove-support-card-from-faq.js
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
  console.log("MIGRATION 047: Remove support card from homepage.faq");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify parent table ──────────────────────────────────────────
    console.log("STEP 1: Checking components_homepage_faqs table...");
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND   table_name   = 'components_homepage_faqs'
      )
    `);
    if (!tableCheck.rows[0].exists) {
      throw new Error("Table components_homepage_faqs does not exist.");
    }
    console.log("  [OK] Table exists\n");

    // ── STEP 2: Remove doctor_image relations ─────────────────────────────────
    console.log(
      "STEP 2: Removing doctor_image relations from files_related_mph...",
    );
    const doctorImageDeleted = await client.query(`
      DELETE FROM files_related_mph
      WHERE related_type = 'homepage.faq'
      AND field = 'doctor_image'
      RETURNING id
    `);
    console.log(
      `  [OK] Deleted ${doctorImageDeleted.rowCount} doctor_image relations\n`,
    );

    // ── STEP 3: Drop contact_items link table ─────────────────────────────────
    console.log("STEP 3: Dropping contact_items link table...");
    await client.query(`
      DROP TABLE IF EXISTS components_homepage_faqs_contact_items_cmps CASCADE
    `);
    console.log("  [OK] Dropped components_homepage_faqs_contact_items_cmps\n");

    // ── STEP 4: Drop contact_items component table ────────────────────────────
    console.log("STEP 4: Dropping contact_items component table...");
    await client.query(`
      DROP TABLE IF EXISTS components_homepage_faq_contact_items CASCADE
    `);
    console.log("  [OK] Dropped components_homepage_faq_contact_items\n");

    // ── STEP 5: Drop cta_label and cta_link columns ───────────────────────────
    console.log("STEP 5: Dropping cta_label and cta_link columns...");
    for (const col of ["cta_label", "cta_link"]) {
      const exists = await client.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.columns
          WHERE table_schema = 'public'
          AND   table_name   = 'components_homepage_faqs'
          AND   column_name  = $1
        )
      `,
        [col],
      );
      if (exists.rows[0].exists) {
        await client.query(
          `ALTER TABLE components_homepage_faqs DROP COLUMN ${col}`,
        );
        console.log(`  [OK] Dropped ${col}`);
      } else {
        console.log(`  [SKIP] ${col} does not exist`);
      }
    }
    console.log();

    // ── STEP 6: Verify ────────────────────────────────────────────────────────
    console.log("STEP 6: Verifying...");
    const verify = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'components_homepage_faqs'
      ORDER BY ordinal_position
    `);
    console.log("  Remaining columns in components_homepage_faqs:");
    verify.rows.forEach((r) => console.log(`    - ${r.column_name}`));

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 047 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log(
      "  1. Update strapi-cms/src/components/homepage/faq.json schema",
    );
    console.log("  2. Restart Strapi to pick up schema changes");
    console.log(
      "  3. Update dental-frontend/src/components/blocks/FAQSection.tsx",
    );
    console.log("  4. Remove SupportCard component from frontend");
    console.log("  5. Test FAQ section on homepage\n");
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
