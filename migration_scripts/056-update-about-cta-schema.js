#!/usr/bin/env node

/**
 * Migration Script 056: Update About CTA Schema to Match Homepage CTA
 *
 * Changes:
 *  1. Drop old columns (badge, title, description, primary_button_*, secondary_button_*, image)
 *  2. Add new columns (heading, highlight_text, button_label, button_link)
 *  3. Note: background_image and user_avatars are handled via files_related_mph
 *
 * Run (dev):
 *   node migration_scripts/056-update-about-cta-schema.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 DATABASE_NAME=dental_cms_strapi \
 *   DATABASE_USERNAME=postgres DATABASE_PASSWORD=postgres \
 *   node migration_scripts/056-update-about-cta-schema.js
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
  console.log("MIGRATION 056: Update About CTA Schema");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check current schema ──────────────────────────────────────
    console.log("STEP 1: Checking current schema...");
    const checkTable = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_about_ctas'
      ORDER BY ordinal_position
    `);
    console.log(
      "  Current columns:",
      checkTable.rows.map((r) => r.column_name).join(", "),
    );

    // ── STEP 2: Remove old media relations ────────────────────────────────
    console.log("\nSTEP 2: Removing old media relations...");
    const deleteOldMedia = await client.query(`
      DELETE FROM files_related_mph
      WHERE related_type = 'about.cta'
      AND field = 'image'
    `);
    console.log(
      `  [OK] Deleted ${deleteOldMedia.rowCount} old image relations`,
    );

    // ── STEP 3: Drop old columns ──────────────────────────────────────────
    console.log("\nSTEP 3: Dropping old columns...");

    const oldColumns = [
      "badge",
      "title",
      "description",
      "primary_button_text",
      "primary_button_link",
      "secondary_button_text",
      "secondary_button_link",
    ];

    for (const col of oldColumns) {
      try {
        await client.query(`
          ALTER TABLE components_about_ctas 
          DROP COLUMN IF EXISTS ${col}
        `);
        console.log(`  [OK] Dropped column: ${col}`);
      } catch (err) {
        console.log(`  [SKIP] Column ${col} doesn't exist or already dropped`);
      }
    }

    // ── STEP 4: Add new columns ───────────────────────────────────────────
    console.log("\nSTEP 4: Adding new columns...");

    await client.query(`
      ALTER TABLE components_about_ctas 
      ADD COLUMN IF NOT EXISTS heading TEXT
    `);
    console.log("  [OK] Added column: heading");

    await client.query(`
      ALTER TABLE components_about_ctas 
      ADD COLUMN IF NOT EXISTS highlight_text VARCHAR(255)
    `);
    console.log("  [OK] Added column: highlight_text");

    await client.query(`
      ALTER TABLE components_about_ctas 
      ADD COLUMN IF NOT EXISTS button_label VARCHAR(255)
    `);
    console.log("  [OK] Added column: button_label");

    await client.query(`
      ALTER TABLE components_about_ctas 
      ADD COLUMN IF NOT EXISTS button_link VARCHAR(255)
    `);
    console.log("  [OK] Added column: button_link");

    // ── STEP 5: Verify new schema ─────────────────────────────────────────
    console.log("\nSTEP 5: Verifying new schema...");
    const verifyTable = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_about_ctas'
      ORDER BY ordinal_position
    `);
    console.log(
      "  New columns:",
      verifyTable.rows.map((r) => r.column_name).join(", "),
    );

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 056 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up schema changes");
    console.log("  2. Update About CTA content in Strapi admin");
    console.log("  3. Update frontend AboutUsContent.tsx component\n");
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
