#!/usr/bin/env node

/**
 * Migration Script 063: Remove Marker Icon Field
 *
 * Changes:
 *  1. Remove marker_icon_id column from components_contact_map_sections table
 *  2. Remove any media relations for marker icons
 *  3. Keep: title, description, name, address, lat, lng
 *
 * Run:
 *   node migration_scripts/063-remove-marker-icon-field.js
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
  console.log("MIGRATION 063: Remove Marker Icon Field");
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

    // ── STEP 2: Remove marker icon media relations ───────────────────────
    console.log("STEP 2: Removing marker icon media relations...");

    const mediaRelationsCheck = await client.query(`
      SELECT COUNT(*) as count
      FROM files_related_mph
      WHERE related_type = 'contact.map-section'
      AND field = 'marker_icon';
    `);

    if (mediaRelationsCheck.rows[0].count > 0) {
      const deleteResult = await client.query(`
        DELETE FROM files_related_mph
        WHERE related_type = 'contact.map-section'
        AND field = 'marker_icon';
      `);
      console.log(
        `  [OK] Deleted ${deleteResult.rowCount} marker icon media relation(s)`,
      );
    } else {
      console.log("  [SKIP] No marker icon media relations found");
    }
    console.log();

    // ── STEP 3: Drop foreign key constraint ──────────────────────────────
    console.log("STEP 3: Dropping foreign key constraint...");

    const constraintCheck = await client.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'components_contact_map_sections'
      AND constraint_name = 'components_contact_map_sections_marker_icon_fk';
    `);

    if (constraintCheck.rows.length > 0) {
      await client.query(`
        ALTER TABLE components_contact_map_sections
        DROP CONSTRAINT IF EXISTS components_contact_map_sections_marker_icon_fk CASCADE;
      `);
      console.log("  [OK] Dropped foreign key constraint");
    } else {
      console.log("  [SKIP] Foreign key constraint does not exist");
    }
    console.log();

    // ── STEP 4: Remove marker_icon_id column ─────────────────────────────
    console.log("STEP 4: Removing marker_icon_id column...");

    const markerIconExists = columnsCheck.rows.some(
      (row) => row.column_name === "marker_icon_id",
    );
    if (markerIconExists) {
      await client.query(`
        ALTER TABLE components_contact_map_sections 
        DROP COLUMN IF EXISTS marker_icon_id CASCADE;
      `);
      console.log("  [OK] Removed marker_icon_id column");
    } else {
      console.log("  [SKIP] marker_icon_id column does not exist");
    }
    console.log();

    // ── STEP 5: Verify final structure ───────────────────────────────────
    console.log("STEP 5: Verifying final table structure...");

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

    // ── STEP 6: Check current data ────────────────────────────────────────
    console.log("STEP 6: Checking current map section data...");

    const dataCheck = await client.query(`
      SELECT id, title, name, address, lat, lng
      FROM components_contact_map_sections;
    `);

    console.log(`  Map sections count: ${dataCheck.rows.length}`);
    dataCheck.rows.forEach((row) => {
      console.log(`    - ID ${row.id}:`);
      console.log(`      Title: ${row.title}`);
      console.log(`      Name: ${row.name}`);
      console.log(`      Address: ${row.address}`);
      console.log(`      Coordinates: ${row.lat}, ${row.lng}`);
    });
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 063 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Update Strapi schema file:");
    console.log("     strapi-cms/src/components/contact/map-section.json");
    console.log("  2. Remove marker_icon field from schema");
    console.log("  3. Restart Strapi to pick up schema changes");
    console.log("  4. Update frontend GoogleMapSection component");
    console.log("  5. Remove marker overlay and tooltip");
    console.log("  6. Add address card in top-left corner\n");
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
