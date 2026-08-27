#!/usr/bin/env node

/**
 * Migration Script 062: Add icon field to stat-item component
 *
 * Changes:
 *  1. Creates files_related_mph entries are handled by Strapi automatically
 *     when using media fields — no separate link table needed in Strapi 5.
 *  2. This script verifies the components_homepage_stat_items table exists
 *     and checks current columns.
 *
 * In Strapi 5, media fields are stored in the 'files_related_mph' table.
 * No extra DB table is needed — simply updating the schema JSON is sufficient.
 *
 * Run (dev):
 *   node migration_scripts/062-add-icon-to-stat-item.js
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
  console.log("MIGRATION 062: Add icon to stat-item component");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // STEP 1: Verify table exists
    console.log("STEP 1: Verifying components_homepage_stat_items table...");
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'components_homepage_stat_items'
      );
    `);
    if (!tableCheck.rows[0].exists) {
      console.log("  [INFO] Table does not exist yet - will be created by Strapi on startup\n");
    } else {
      console.log("  [OK] Table exists\n");

      // STEP 2: Show current columns
      console.log("STEP 2: Current columns in components_homepage_stat_items:");
      const cols = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'components_homepage_stat_items'
        ORDER BY ordinal_position;
      `);
      cols.rows.forEach((r) => console.log(`  - ${r.column_name} (${r.data_type})`));
      console.log("");
    }

    // STEP 3: Check files_related_mph for icon entries
    console.log("STEP 3: Checking if any 'icon' relations already exist in files_related_mph...");
    const iconCheck = await client.query(`
      SELECT COUNT(*) as count
      FROM files_related_mph
      WHERE related_type = 'homepage.stat-item'
      AND field = 'icon';
    `);
    console.log(`  [OK] Found ${iconCheck.rows[0].count} existing icon relations\n`);

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 062 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up the stat-item.json schema change");
    console.log("  2. In Strapi Admin, upload icons for each stat card");
    console.log("  3. The frontend TrustSection is already updated to render icons\n");
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
