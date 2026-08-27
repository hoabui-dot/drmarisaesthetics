#!/usr/bin/env node

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

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Add columns to map_sections ────────────────
    console.log("STEP 1: Adding columns to components_contact_map_sections...");
    
    // Check if columns already exist
    const checkCols = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='components_contact_map_sections' 
      AND column_name='name'
    `);
    
    if (checkCols.rowCount === 0) {
      await client.query(`
        ALTER TABLE components_contact_map_sections 
        ADD COLUMN name VARCHAR(255),
        ADD COLUMN address TEXT,
        ADD COLUMN phone VARCHAR(255),
        ADD COLUMN email VARCHAR(255),
        ADD COLUMN hours TEXT,
        ADD COLUMN lat DECIMAL,
        ADD COLUMN lng DECIMAL
      `);
      console.log("  [OK] Added columns");
    } else {
      console.log("  [OK] Columns already exist");
    }

    // ── STEP 2: Migrate data ─────────────────────────────────────────
    console.log("STEP 2: Migrating data...");
    
    await client.query(`
      UPDATE components_contact_map_sections ms
      SET 
        name = cl.name,
        address = cl.address,
        phone = cl.phone,
        email = cl.email,
        hours = cl.hours,
        lat = cl.lat,
        lng = cl.lng
      FROM contact_pages_components cp_c
      JOIN components_contact_clinic_locations cl ON cp_c.cmp_id = cl.id AND cp_c.component_type = 'contact.clinic-location'
      WHERE ms.id IN (
        SELECT ms_link.cmp_id 
        FROM contact_pages_components ms_link 
        WHERE ms_link.entity_id = cp_c.entity_id 
        AND ms_link.component_type = 'contact.map-section'
      )
      AND ms.name IS NULL
    `);
    
    console.log("  [OK] Data migrated successfully\n");

    // ── STEP 3: Remove old tables & references ───────────────────
    console.log("STEP 3: Removing old tables...");
    
    await client.query(`
      DELETE FROM contact_pages_components WHERE component_type = 'contact.clinic-location'
    `);
    await client.query(`
      DROP TABLE IF EXISTS components_contact_clinic_locations CASCADE
    `);
    
    // Remove old columns from contact_pages (if directly embedded in table, e.g. for strings)
    // clinic_locations_title, clinic_locations_subtitle
    await client.query(`ALTER TABLE contact_pages DROP COLUMN IF EXISTS clinic_locations_title`);
    await client.query(`ALTER TABLE contact_pages DROP COLUMN IF EXISTS clinic_locations_subtitle`);

    console.log("  [OK] Old schema tables dropped\n");

    console.log("MIGRATION COMPLETED SUCCESSFULLY");
  } catch (err) {
    console.error("\n[ERROR]", err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
