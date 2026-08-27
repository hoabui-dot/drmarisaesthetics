#!/usr/bin/env node

/**
 * Migration Script 060: Update Map Section to Single Location
 *
 * Changes:
 *  1. Clean up duplicate map section entries
 *  2. Update map section with actual clinic location data
 *  3. Link the map section to the contact page
 *
 * Run:
 *   node migration_scripts/060-update-map-section-single-location.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

// Clinic location data - Update these values with actual clinic information
const CLINIC_DATA = {
  title: "Find Us",
  description: "Visit our conveniently located clinic in Ho Chi Minh City",
  name: "Saigon International Dental Clinic",
  address: "233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam",
  phone: "+84 28 1900 8059",
  email: "contact@saigondental.com",
  hours:
    "Monday - Friday: 8:00 AM - 8:00 PM\nSaturday: 8:00 AM - 6:00 PM\nSunday: 9:00 AM - 5:00 PM",
  lat: 10.7769, // Nguyen Hue Street, District 1, HCMC
  lng: 106.7009,
};

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 060: Update Map Section to Single Location");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check current state ──────────────────────────────────────
    console.log("STEP 1: Checking current state...");

    const mapSectionsCheck = await client.query(`
      SELECT id, title, name, address, phone 
      FROM components_contact_map_sections;
    `);
    console.log(`  Found ${mapSectionsCheck.rows.length} map section(s)`);
    mapSectionsCheck.rows.forEach((row) => {
      console.log(
        `    - ID ${row.id}: ${row.title} | ${row.name || "(empty)"}`,
      );
    });

    const contactPagesCheck = await client.query(`
      SELECT id, document_id, map_section_id 
      FROM contact_pages;
    `);
    console.log(`  Found ${contactPagesCheck.rows.length} contact page(s)`);
    contactPagesCheck.rows.forEach((row) => {
      console.log(
        `    - ID ${row.id}: document_id=${row.document_id}, map_section_id=${row.map_section_id || "null"}`,
      );
    });
    console.log();

    // ── STEP 2: Delete duplicate map sections ────────────────────────────
    console.log("STEP 2: Cleaning up duplicate map sections...");

    // Keep only the first map section (ID 1)
    const deleteResult = await client.query(`
      DELETE FROM components_contact_map_sections 
      WHERE id > 1;
    `);
    console.log(
      `  [OK] Deleted ${deleteResult.rowCount} duplicate map section(s)\n`,
    );

    // ── STEP 3: Update map section with clinic data ──────────────────────
    console.log("STEP 3: Updating map section with clinic location data...");

    const updateResult = await client.query(
      `
      UPDATE components_contact_map_sections
      SET 
        title = $1,
        description = $2,
        name = $3,
        address = $4,
        phone = $5,
        email = $6,
        hours = $7,
        lat = $8,
        lng = $9
      WHERE id = 1
      RETURNING *;
    `,
      [
        CLINIC_DATA.title,
        CLINIC_DATA.description,
        CLINIC_DATA.name,
        CLINIC_DATA.address,
        CLINIC_DATA.phone,
        CLINIC_DATA.email,
        CLINIC_DATA.hours,
        CLINIC_DATA.lat,
        CLINIC_DATA.lng,
      ],
    );

    if (updateResult.rows.length > 0) {
      console.log("  [OK] Map section updated successfully");
      console.log(`      Title: ${updateResult.rows[0].title}`);
      console.log(`      Name: ${updateResult.rows[0].name}`);
      console.log(`      Address: ${updateResult.rows[0].address}`);
      console.log(`      Phone: ${updateResult.rows[0].phone}`);
      console.log(
        `      Coordinates: ${updateResult.rows[0].lat}, ${updateResult.rows[0].lng}`,
      );
    } else {
      console.log("  [WARNING] No map section found with ID 1");
    }
    console.log();

    // ── STEP 4: Link map section to contact page ─────────────────────────
    console.log("STEP 4: Linking map section to contact page...");

    // Get the latest contact page
    const latestContactPage = await client.query(`
      SELECT id, document_id 
      FROM contact_pages 
      ORDER BY id DESC 
      LIMIT 1;
    `);

    if (latestContactPage.rows.length > 0) {
      const contactPageId = latestContactPage.rows[0].id;

      await client.query(
        `
        UPDATE contact_pages
        SET map_section_id = 1
        WHERE id = $1;
      `,
        [contactPageId],
      );

      console.log(
        `  [OK] Linked map section (ID 1) to contact page (ID ${contactPageId})\n`,
      );
    } else {
      console.log("  [WARNING] No contact page found\n");
    }

    // ── STEP 5: Verify results ────────────────────────────────────────────
    console.log("STEP 5: Verifying results...");

    const finalMapSections = await client.query(`
      SELECT id, title, name, address, phone, lat, lng 
      FROM components_contact_map_sections;
    `);
    console.log(`  Map sections count: ${finalMapSections.rows.length}`);
    finalMapSections.rows.forEach((row) => {
      console.log(`    - ID ${row.id}:`);
      console.log(`      Title: ${row.title}`);
      console.log(`      Name: ${row.name}`);
      console.log(`      Address: ${row.address}`);
      console.log(`      Phone: ${row.phone}`);
      console.log(`      Coordinates: ${row.lat}, ${row.lng}`);
    });

    const finalContactPages = await client.query(`
      SELECT id, document_id, map_section_id 
      FROM contact_pages;
    `);
    console.log(`\n  Contact pages count: ${finalContactPages.rows.length}`);
    finalContactPages.rows.forEach((row) => {
      console.log(
        `    - ID ${row.id}: map_section_id=${row.map_section_id || "null"}`,
      );
    });
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 060 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up changes");
    console.log("  2. Verify map section in Strapi Admin");
    console.log("  3. Test contact page on frontend");
    console.log("  4. Update CLINIC_DATA in this script if needed\n");
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
