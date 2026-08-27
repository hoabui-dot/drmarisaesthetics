#!/usr/bin/env node

/**
 * Migration 125: Convert center_icon from VARCHAR to Media (image upload)
 *
 * Strapi media fields are stored in files_related_mph, NOT as a column.
 * So we DROP the existing center_icon VARCHAR column, and Strapi will
 * manage the media relation via files_related_mph automatically.
 *
 * Run: node migration_scripts/125-convert-center-icon-to-media.js
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
  console.log("MIGRATION 125: Convert center_icon VARCHAR → Media field");
  console.log("=".repeat(70));

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // STEP 1: Check if center_icon VARCHAR column exists
    const colCheck = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'components_about_core_values'
      AND column_name = 'center_icon'
    `);

    if (colCheck.rows.length > 0) {
      const colType = colCheck.rows[0].data_type;
      if (colType === 'character varying') {
        console.log(`[INFO] Dropping VARCHAR center_icon column (type: ${colType})`);
        await client.query(`
          ALTER TABLE components_about_core_values DROP COLUMN center_icon
        `);
        console.log("[OK] Dropped VARCHAR center_icon column");
      } else {
        console.log(`[INFO] center_icon column exists but type is: ${colType} — skipping drop`);
      }
    } else {
      console.log("[INFO] No center_icon VARCHAR column found — nothing to drop");
    }

    // STEP 2: Clean up any stale files_related_mph entries for this field
    const cleaned = await client.query(`
      DELETE FROM files_related_mph
      WHERE related_type = 'about.core-values'
      AND field = 'center_icon'
    `);
    console.log(`[OK] Cleaned ${cleaned.rowCount} stale media relations for center_icon`);

    // STEP 3: Verify table structure
    const cols = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'components_about_core_values'
      ORDER BY ordinal_position
    `);
    console.log("\nRemaining columns:", cols.rows.map(r => r.column_name).join(", "));

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 125 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up schema change");
    console.log("  2. Upload an image in Strapi admin: About Page → Core Values → Center Icon");
    console.log("  3. Media relation will be stored in files_related_mph by Strapi automatically\n");
  } catch (err) {
    console.error("\n[ERROR]", err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("[OK] Connection closed");
  }
}

run();
