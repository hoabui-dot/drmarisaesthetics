#!/usr/bin/env node

/**
 * Migration 124: Add center_icon column to components_about_core_values
 *
 * Run: node migration_scripts/124-add-center-icon-to-core-values.js
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
  console.log("MIGRATION 124: Add center_icon to core_values");
  console.log("=".repeat(70));

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // Check if column already exists
    const colCheck = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'components_about_core_values'
      AND column_name = 'center_icon'
    `);

    if (colCheck.rows.length > 0) {
      console.log("[INFO] center_icon column already exists — skipping ALTER");
    } else {
      await client.query(`
        ALTER TABLE components_about_core_values
        ADD COLUMN center_icon VARCHAR(255) DEFAULT 'Smile'
      `);
      console.log("[OK] Added center_icon column with default 'Smile'");
    }

    // Set the value for the current published record
    const updated = await client.query(`
      UPDATE components_about_core_values
      SET center_icon = 'Smile'
      WHERE center_icon IS NULL
    `);
    console.log(`[OK] Set center_icon = 'Smile' on ${updated.rowCount} rows`);

    // Verify
    const verify = await client.query(
      "SELECT id, center_icon, title FROM components_about_core_values"
    );
    console.log("\nVerification:", JSON.stringify(verify.rows));

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 124 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up schema change");
    console.log("  2. center_icon field now editable in Strapi admin\n");
  } catch (err) {
    console.error("\n[ERROR]", err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("[OK] Connection closed");
  }
}

run();
