#!/usr/bin/env node

/**
 * Migration Script 064: Add map_section and clinic location labeling to contact_pages
 *
 * Changes:
 *  1. Create components_contact_map_sections table
 *  2. Add map_section_id FK column to contact_pages
 *  3. Add clinic_locations_title and clinic_locations_subtitle columns to contact_pages
 *  4. Seed default values for the map_section record and update contact_pages row
 *
 * Run (dev):
 *   node migration_scripts/064-add-map-section-to-contact-page.js
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
  console.log("MIGRATION 064: Add map_section + clinic location labels to contact_pages");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    await client.query("BEGIN");

    // ── STEP 1: Create components_contact_map_sections table ──────────────
    console.log("STEP 1: Creating components_contact_map_sections table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_map_sections (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL DEFAULT 'Find Us',
        description TEXT DEFAULT 'Visit our conveniently located clinics'
      )
    `);
    console.log("  [OK] Table created (or already exists)\n");

    // ── STEP 2: Add map_section_id FK to contact_pages ────────────────────
    console.log("STEP 2: Adding map_section_id column to contact_pages...");
    const mapColCheck = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'contact_pages' AND column_name = 'map_section_id'
    `);
    if (mapColCheck.rows.length === 0) {
      await client.query(`
        ALTER TABLE contact_pages
        ADD COLUMN map_section_id INTEGER
          REFERENCES components_contact_map_sections(id)
          ON DELETE SET NULL
      `);
      console.log("  [OK] Added map_section_id column\n");
    } else {
      console.log("  [SKIP] map_section_id already exists\n");
    }

    // ── STEP 3: Add clinic location label columns ─────────────────────────
    console.log("STEP 3: Adding clinic location label columns...");
    const titleColCheck = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'contact_pages' AND column_name = 'clinic_locations_title'
    `);
    if (titleColCheck.rows.length === 0) {
      await client.query(`
        ALTER TABLE contact_pages
        ADD COLUMN clinic_locations_title VARCHAR(255) DEFAULT 'Our Clinic Locations',
        ADD COLUMN clinic_locations_subtitle TEXT DEFAULT 'Visit us at any of our convenient locations'
      `);
      console.log("  [OK] Added clinic_locations_title and clinic_locations_subtitle\n");
    } else {
      console.log("  [SKIP] clinic_locations columns already exist\n");
    }

    // ── STEP 4: Seed default map_section record ───────────────────────────
    console.log("STEP 4: Seeding default map_section record...");
    const existing = await client.query(`SELECT id FROM components_contact_map_sections LIMIT 1`);
    let mapSectionId;
    if (existing.rows.length === 0) {
      const insert = await client.query(`
        INSERT INTO components_contact_map_sections (title, description)
        VALUES ('Find Us', 'Visit our conveniently located clinics')
        RETURNING id
      `);
      mapSectionId = insert.rows[0].id;
      console.log(`  [OK] Inserted map_section with id=${mapSectionId}\n`);
    } else {
      mapSectionId = existing.rows[0].id;
      console.log(`  [SKIP] map_section already exists with id=${mapSectionId}\n`);
    }

    // ── STEP 5: Link map_section and set defaults on contact_pages row ────
    console.log("STEP 5: Updating contact_pages with map_section and labels...");
    const updateResult = await client.query(`
      UPDATE contact_pages
      SET
        map_section_id = $1,
        clinic_locations_title = COALESCE(NULLIF(clinic_locations_title, ''), 'Our Clinic Locations'),
        clinic_locations_subtitle = COALESCE(NULLIF(clinic_locations_subtitle, ''), 'Visit us at any of our convenient locations')
    `, [mapSectionId]);
    console.log(`  [OK] Updated ${updateResult.rowCount} contact_pages row(s)\n`);

    // ── STEP 6: Verify ─────────────────────────────────────────────────────
    console.log("STEP 6: Verifying final schema...");
    const cols = await client.query(`
      SELECT column_name, data_type FROM information_schema.columns
      WHERE table_name = 'contact_pages'
      ORDER BY ordinal_position
    `);
    console.log("  contact_pages columns:");
    cols.rows.forEach(r => console.log(`    - ${r.column_name} (${r.data_type})`));

    await client.query("COMMIT");

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 064 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up the new schema components");
    console.log("  2. In Strapi Admin → Contact Page, fill in Map Section fields");
    console.log("  3. The frontend now reads title/description from the CMS\n");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("\n[ERROR]", err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log("[OK] Connection closed");
  }
}

run();
