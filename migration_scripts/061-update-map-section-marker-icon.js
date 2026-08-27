#!/usr/bin/env node

/**
 * Migration Script 061: Update Map Section - Add Marker Icon, Remove Phone/Email
 *
 * Changes:
 *  1. Remove phone and email fields from map_section
 *  2. Add marker_icon field for custom marker image upload
 *  3. Keep: title, description, name, address, hours, lat, lng
 *
 * Run:
 *   node migration_scripts/061-update-map-section-marker-icon.js
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
  console.log("MIGRATION 061: Update Map Section - Add Marker Icon");
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

    // ── STEP 2: Remove phone and email columns ───────────────────────────
    console.log("STEP 2: Removing phone and email columns...");

    // Check if phone column exists
    const phoneExists = columnsCheck.rows.some(
      (row) => row.column_name === "phone",
    );
    if (phoneExists) {
      await client.query(`
        ALTER TABLE components_contact_map_sections 
        DROP COLUMN IF EXISTS phone CASCADE;
      `);
      console.log("  [OK] Removed phone column");
    } else {
      console.log("  [SKIP] Phone column does not exist");
    }

    // Check if email column exists
    const emailExists = columnsCheck.rows.some(
      (row) => row.column_name === "email",
    );
    if (emailExists) {
      await client.query(`
        ALTER TABLE components_contact_map_sections 
        DROP COLUMN IF EXISTS email CASCADE;
      `);
      console.log("  [OK] Removed email column");
    } else {
      console.log("  [SKIP] Email column does not exist");
    }
    console.log();

    // ── STEP 3: Add marker_icon_id column ─────────────────────────────────
    console.log("STEP 3: Adding marker_icon_id column for custom marker...");

    const markerIconExists = columnsCheck.rows.some(
      (row) => row.column_name === "marker_icon_id",
    );
    if (!markerIconExists) {
      await client.query(`
        ALTER TABLE components_contact_map_sections 
        ADD COLUMN marker_icon_id INTEGER;
      `);

      // Add foreign key constraint to files table
      await client.query(`
        ALTER TABLE components_contact_map_sections
        ADD CONSTRAINT components_contact_map_sections_marker_icon_fk
        FOREIGN KEY (marker_icon_id) 
        REFERENCES files(id) 
        ON DELETE SET NULL;
      `);

      console.log(
        "  [OK] Added marker_icon_id column with foreign key to files",
      );
    } else {
      console.log("  [SKIP] marker_icon_id column already exists");
    }
    console.log();

    // ── STEP 4: Verify final structure ───────────────────────────────────
    console.log("STEP 4: Verifying final table structure...");

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

    // ── STEP 5: Check current data ────────────────────────────────────────
    console.log("STEP 5: Checking current map section data...");

    const dataCheck = await client.query(`
      SELECT id, title, name, address, hours, lat, lng, marker_icon_id
      FROM components_contact_map_sections;
    `);

    console.log(`  Map sections count: ${dataCheck.rows.length}`);
    dataCheck.rows.forEach((row) => {
      console.log(`    - ID ${row.id}:`);
      console.log(`      Title: ${row.title}`);
      console.log(`      Name: ${row.name}`);
      console.log(`      Address: ${row.address}`);
      console.log(`      Coordinates: ${row.lat}, ${row.lng}`);
      console.log(
        `      Marker Icon ID: ${row.marker_icon_id || "null (no custom marker)"}`,
      );
    });
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 061 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Update Strapi schema file:");
    console.log("     strapi-cms/src/components/contact/map-section.json");
    console.log("  2. Add marker_icon field (type: media, single image)");
    console.log("  3. Remove phone and email fields from schema");
    console.log("  4. Restart Strapi to pick up schema changes");
    console.log("  5. Update frontend GoogleMapSection component");
    console.log("  6. Upload custom marker icon in Strapi Admin\n");
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
