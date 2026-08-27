#!/usr/bin/env node

/**
 * Migration Script 063: Update clinic_locations columns
 *
 * Changes:
 *  1. RENAME latitude to lat
 *  2. RENAME longitude to lng
 *  3. DROP google_maps_url
 *
 * Run (dev):
 *   node migration_scripts/063-update-clinic-locations-columns.js
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
  console.log("MIGRATION 063: Update clinic_locations columns");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // STEP 1: Check column existence
    console.log("STEP 1: Checking current columns in clinic_locations...");
    const cols = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'clinic_locations'
    `);
    const columnNames = cols.rows.map(r => r.column_name);
    console.log(`  Current columns: ${columnNames.join(", ")}\n`);

    // STEP 2: Rename latitude to lat
    if (columnNames.includes("latitude") && !columnNames.includes("lat")) {
      console.log("STEP 2: Renaming latitude to lat...");
      await client.query("ALTER TABLE clinic_locations RENAME COLUMN latitude TO lat");
      console.log("  [OK] Renamed latitude to lat\n");
    } else {
      console.log("STEP 2: [SKIP] latitude column not found or lat already exists\n");
    }

    // STEP 3: Rename longitude to lng
    if (columnNames.includes("longitude") && !columnNames.includes("lng")) {
      console.log("STEP 3: Renaming longitude to lng...");
      await client.query("ALTER TABLE clinic_locations RENAME COLUMN longitude TO lng");
      console.log("  [OK] Renamed longitude to lng\n");
    } else {
      console.log("STEP 3: [SKIP] longitude column not found or lng already exists\n");
    }

    // STEP 4: Drop google_maps_url
    if (columnNames.includes("google_maps_url")) {
      console.log("STEP 4: Dropping google_maps_url...");
      await client.query("ALTER TABLE clinic_locations DROP COLUMN google_maps_url");
      console.log("  [OK] Dropped google_maps_url\n");
    } else {
      console.log("STEP 4: [SKIP] google_maps_url column not found\n");
    }

    // STEP 5: Verify
    console.log("STEP 5: Verifying final columns...");
    const finalCols = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'clinic_locations'
    `);
    const finalColumnNames = finalCols.rows.map(r => r.column_name);
    console.log(`  Final columns: ${finalColumnNames.join(", ")}\n`);

    if (finalColumnNames.includes("lat") && finalColumnNames.includes("lng") && !finalColumnNames.includes("google_maps_url")) {
      console.log("\n" + "=".repeat(70));
      console.log("MIGRATION 063 COMPLETED SUCCESSFULLY");
      console.log("=".repeat(70));
    } else {
      console.log("\n" + "=".repeat(70));
      console.log("MIGRATION 063 COMPLETED WITH WARNINGS");
      console.log("=".repeat(70));
    }

    console.log("\nNext steps:");
    console.log("  1. Update dental-frontend/src/lib/api/queries.ts to use lat/lng");
    console.log("  2. Update dental-frontend/src/app/contact/page.tsx mapping");
    console.log("  3. Update dental-frontend/src/components/maps/GoogleMapSection.tsx");
    console.log("  4. Restart Strapi to pick up the schema changes\n");

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
