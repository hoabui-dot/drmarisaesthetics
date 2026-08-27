#!/usr/bin/env node

/**
 * Migration Script 043: Add transformation_image to homepage.cta
 *
 * Changes to components_homepage_ctas:
 *  1. ADD transformation_image media relation (handled by Strapi's files_related_mph)
 *     - This will store the before/after smiling patient image
 *     - Used in the right 40% of the CTA section
 *
 * Note: Media relations in Strapi are handled through the files_related_mph table,
 * so we don't need to create a column directly. Strapi will handle this automatically
 * when we update the schema JSON file.
 *
 * This script verifies the table exists and is ready for the new field.
 *
 * Run (dev):
 *   node migration_scripts/043-add-image-to-cta.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/043-add-image-to-cta.js
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
  console.log("MIGRATION 043: Add transformation_image to homepage.cta");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify parent table ──────────────────────────────────────────
    console.log("STEP 1: Checking components_homepage_ctas table...");
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND   table_name   = 'components_homepage_ctas'
      )
    `);
    if (!tableCheck.rows[0].exists) {
      throw new Error(
        "Table components_homepage_ctas does not exist. Run Strapi first.",
      );
    }
    console.log("  [OK] Table exists\n");

    // ── STEP 2: Verify files_related_mph table ───────────────────────────────
    console.log("STEP 2: Checking files_related_mph table...");
    const filesTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND   table_name   = 'files_related_mph'
      )
    `);
    if (!filesTableCheck.rows[0].exists) {
      throw new Error(
        "Table files_related_mph does not exist. Strapi media handling not initialized.",
      );
    }
    console.log("  [OK] Table exists\n");

    // ── STEP 3: Check existing CTA blocks ────────────────────────────────────
    console.log("STEP 3: Checking existing CTA blocks...");
    const ctaRows = await client.query(`
      SELECT id FROM components_homepage_ctas ORDER BY id
    `);
    console.log(`  [OK] Found ${ctaRows.rows.length} CTA block(s)\n`);

    if (ctaRows.rows.length > 0) {
      console.log("  Existing CTA blocks:");
      ctaRows.rows.forEach((row) => {
        console.log(`    - CTA block ID: ${row.id}`);
      });
      console.log();
    }

    // ── STEP 4: Verify schema update readiness ───────────────────────────────
    console.log("STEP 4: Verifying schema update readiness...");
    console.log("  [OK] Database is ready for schema update\n");

    console.log("=".repeat(70));
    console.log("MIGRATION 043 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Update strapi-cms/src/components/homepage/cta.json");
    console.log("     Add transformation_image field (media, single image)");
    console.log("  2. Restart Strapi to pick up new schema");
    console.log("  3. Upload transformation image in Strapi Admin");
    console.log("     → Homepage → CTA block → Transformation Image");
    console.log("  4. Recommended image:");
    console.log("     - Portrait orientation (3:4 aspect ratio)");
    console.log("     - Minimum size: 600x800px");
    console.log("     - Before/after smiling patient transformation");
    console.log("     - Professional quality photo\n");
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
