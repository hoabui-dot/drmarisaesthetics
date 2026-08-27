#!/usr/bin/env node

/**
 * Migration Script 062: Remove Hours Field from Map Section
 *
 * Changes:
 *  1. Remove hours column from components_contact_map_sections table
 *  2. Keep: title, description, name, address, lat, lng, marker_icon_id
 *
 * Run:
 *   node migration_scripts/062-remove-hours-field.js
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
  console.log("MIGRATION 062: Remove Hours Field from Map Section");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check current structure ──────────────────────────────────
    console.log("STEP 1: Checking current table structure...");

    const columnsCheck = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_contact_map_sections'
      ORDER BY ordinal_position;
    `);

    console.log(`  Current columns (${columnsCheck.rows.length}):`);
    columnsCheck.rows.forEach((row) => {
      console.log(`    - ${row.column_name} (${row.data_type})`);
    });
    console.log();

    // ── STEP 2: Remove hours column ──────────────────────────────────────
    console.log("STEP 2: Removing hours column...");

    const hoursExists = columnsCheck.rows.some(
      (row) => row.column_name === "hours",
    );
    if (hoursExists) {
      await client.query(`
        ALTER TABLE components_contact_map_sections 
        DROP COLUMN IF EXISTS hours CASCADE;
      `);
      console.log("  [OK] Removed hours column");
    } else {
      console.log("  [SKIP] Hours column does not exist");
    }
    console.log();

    // ── STEP 3: Verify final structure ───────────────────────────────────
    console.log("STEP 3: Verifying final table structure...");

    const finalColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_contact_map_sections'
      ORDER BY ordinal_position;
    `);

    console.log(`  Final columns (${finalColumns.rows.length}):`);
    finalColumns.rows.forEach((row) => {
      console.log(`    - ${row.column_name} (${row.data_type})`);
    });
    console.log();

    // ── STEP 4: Check current data ────────────────────────────────────────
    console.log("STEP 4: Checking current map section data...");

    const dataCheck = await client.query(`
      SELECT id, title, name, address, lat, lng, marker_icon_id
      FROM components_contact_map_sections;
    `);

    console.log(`  Map sections count: ${dataCheck.rows.length}`);
    dataCheck.rows.forEach((row) => {
      console.log(`    - ID ${row.id}:`);
      console.log(`      Title: ${row.title}`);
      console.log(`      Name: ${row.name}`);
      console.log(`      Address: ${row.address}`);
      console.log(`      Coordinates: ${row.lat}, ${row.lng}`);
      console.log(`      Marker Icon ID: ${row.marker_icon_id || "null"}`);
    });
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 062 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Update Strapi schema file:");
    console.log("     strapi-cms/src/components/contact/map-section.json");
    console.log("  2. Remove hours field from schema");
    console.log("  3. Restart Strapi to pick up schema changes");
    console.log("  4. Update frontend GoogleMapSection component");
    console.log("  5. Update API query to remove hours field\n");
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
