#!/usr/bin/env node

/**
 * Migration Script 048: Create clinic-locations collection
 *
 * This script creates a new collection type for clinic locations that can be
 * reused across the site (Contact page, About Us, Homepage, etc.)
 *
 * Changes:
 *  1. CREATE clinic_locations table
 *  2. CREATE clinic_locations_localizations table (for i18n support)
 *  3. INSERT default clinic locations (District 1 and District 7)
 *
 * Run (dev):
 *   node migration_scripts/048-create-clinic-locations-collection.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 \
 *   DATABASE_NAME=dental_cms_strapi DATABASE_USERNAME=postgres \
 *   DATABASE_PASSWORD=postgres \
 *   node migration_scripts/048-create-clinic-locations-collection.js
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
  console.log("MIGRATION 048: Create clinic-locations collection");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Create clinic_locations table ────────────────────────────
    console.log("STEP 1: Creating clinic_locations table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS clinic_locations (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        hours TEXT,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        google_maps_url TEXT,
        is_primary BOOLEAN DEFAULT false,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP,
        created_by_id INTEGER,
        updated_by_id INTEGER,
        locale VARCHAR(255)
      )
    `);
    console.log("  [OK] Table clinic_locations created\n");

    // ── STEP 2: Create indexes ───────────────────────────────────────────
    console.log("STEP 2: Creating indexes...");

    await client.query(`
      CREATE INDEX IF NOT EXISTS clinic_locations_document_id_idx 
      ON clinic_locations(document_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS clinic_locations_created_by_id_idx 
      ON clinic_locations(created_by_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS clinic_locations_updated_by_id_idx 
      ON clinic_locations(updated_by_id)
    `);

    console.log("  [OK] Indexes created\n");

    // ── STEP 3: Insert default locations ──────────────────────────────────
    console.log("STEP 3: Inserting default clinic locations...");

    const checkExisting = await client.query(`
      SELECT COUNT(*) as count FROM clinic_locations
    `);

    if (parseInt(checkExisting.rows[0].count) === 0) {
      // Insert District 1 location
      await client.query(`
        INSERT INTO clinic_locations (
          document_id, name, address, phone, email, hours,
          latitude, longitude, google_maps_url, is_primary,
          display_order, published_at, locale
        ) VALUES (
          'district-1',
          'Saigon International Dental - District 1',
          '233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam',
          '+84 1900 8089',
          'district1@saigondental.com',
          'Monday - Saturday: 8:00 AM - 8:00 PM\nSunday: 9:00 AM - 5:00 PM',
          10.7769,
          106.7009,
          'https://maps.google.com/?q=10.7769,106.7009',
          true,
          1,
          CURRENT_TIMESTAMP,
          'en'
        )
      `);

      // Insert District 7 location
      await client.query(`
        INSERT INTO clinic_locations (
          document_id, name, address, phone, email, hours,
          latitude, longitude, google_maps_url, is_primary,
          display_order, published_at, locale
        ) VALUES (
          'district-7',
          'Saigon International Dental - District 7',
          '233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam',
          '+84 1900 8089',
          'district7@saigondental.com',
          'Monday - Saturday: 8:00 AM - 8:00 PM\nSunday: 9:00 AM - 5:00 PM',
          10.7293,
          106.7217,
          'https://maps.google.com/?q=10.7293,106.7217',
          false,
          2,
          CURRENT_TIMESTAMP,
          'en'
        )
      `);

      console.log("  [OK] Inserted 2 default clinic locations\n");
    } else {
      console.log(
        `  [SKIP] ${checkExisting.rows[0].count} locations already exist\n`,
      );
    }

    // ── STEP 4: Verify ────────────────────────────────────────────────────
    console.log("STEP 4: Verifying...");
    const verify = await client.query(`
      SELECT id, name, address, latitude, longitude, is_primary
      FROM clinic_locations
      ORDER BY display_order
    `);

    console.log(`  [OK] Found ${verify.rows.length} clinic locations:`);
    verify.rows.forEach((row) => {
      console.log(
        `    - ${row.name} (${row.latitude}, ${row.longitude})${row.is_primary ? " [PRIMARY]" : ""}`,
      );
    });
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 048 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log(
      "  1. Create strapi-cms/src/api/clinic-location/content-types/clinic-location/schema.json",
    );
    console.log("  2. Restart Strapi to register the new collection");
    console.log("  3. Update Contact page to use clinic-locations collection");
    console.log("  4. Create unified ClinicLocationsSection component");
    console.log("  5. Test the new component on Contact page\n");
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
