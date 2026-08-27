#!/usr/bin/env node

/**
 * Migration Script 117: Remove subtitle from components_about_heroes
 *
 * Changes:
 *  1. Drop subtitle column from components_about_heroes table
 *
 * Run (dev):
 *   node migration_scripts/117-remove-subtitle-from-about-hero.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/117-remove-subtitle-from-about-hero.js
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
  console.log("MIGRATION 117: Remove subtitle from components_about_heroes");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify prerequisites ──────────────────────────────────────
    console.log("STEP 1: Verifying prerequisites...");
    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='components_about_heroes' and column_name='subtitle';
    `);
    
    if (res.rows.length === 0) {
        console.log("  [INFO] Column 'subtitle' does not exist in 'components_about_heroes'. Already removed or table missing.\n");
    } else {
        console.log("  [OK] Column 'subtitle' exists. Proceeding to drop...\n");
        // ── STEP 2: Perform migration ─────────────────────────────────────────
        console.log("STEP 2: Performing migration...");
        await client.query(`ALTER TABLE components_about_heroes DROP COLUMN IF EXISTS subtitle;`);
        console.log("  [OK] Migration completed\n");
    }

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 117 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi");
    console.log("  2. Rebuild Frontend\n");
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
