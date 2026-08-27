#!/usr/bin/env node
/**
 * Migration Script 082: Add Contact Info Suite to Contact Page
 *
 * Creates:
 *  - components_contact_contact_infos table
 *  - components_contact_contact_info_tiles table
 *  - components_contact_contact_infos_tiles_links link table
 *
 * Populates 4 tiles: website, phone, address, hours
 * Links to contact_pages_components
 *
 * Run: node migration_scripts/082-add-contact-info-suite.js
 */

const { Client } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../strapi-cms/.env") });

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
    await client.query("BEGIN");
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Create parent table ──────────────────────────────────────────
    console.log("STEP 1: Creating components_contact_contact_infos...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_contact_infos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255)
      )
    `);
    console.log("  [OK] Table created\n");

    // ── STEP 2: Create tile table ─────────────────────────────────────────────
    console.log("STEP 2: Creating components_contact_contact_info_tiles...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_contact_info_tiles (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        value TEXT NOT NULL,
        value_secondary VARCHAR(255),
        cta_label VARCHAR(255),
        cta_link VARCHAR(255)
      )
    `);
    console.log("  [OK] Table created\n");

    // ── STEP 3: Create link table ─────────────────────────────────────────────
    console.log("STEP 3: Creating link table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_contact_infos_tiles_links (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER NOT NULL REFERENCES components_contact_contact_infos(id) ON DELETE CASCADE,
        cmp_id INTEGER NOT NULL REFERENCES components_contact_contact_info_tiles(id) ON DELETE CASCADE,
        component_type VARCHAR(255) NOT NULL,
        field VARCHAR(255) NOT NULL,
        "order" DOUBLE PRECISION
      )
    `);
    console.log("  [OK] Link table created\n");

    // ── STEP 4: Seed parent ───────────────────────────────────────────────────
    console.log("STEP 4: Inserting Contact Info Suite parent...");
    const resParent = await client.query(`
      INSERT INTO components_contact_contact_infos (title, subtitle)
      VALUES (
        'Contact Our Dental Clinic in Ho Chi Minh City',
        'Sai Gon International Dental Clinic – Leading Reputable Excellence.'
      ) RETURNING id
    `);
    const parentId = resParent.rows[0].id;
    console.log(`  [OK] Parent ID: ${parentId}\n`);

    // ── STEP 5: Seed 4 tiles ──────────────────────────────────────────────────
    console.log("STEP 5: Inserting 4 contact tiles...");
    const tiles = [
      {
        type: "website",
        title: "Visit Our Website",
        value: "",
        value_secondary: null,
        cta_label: null,
        cta_link: "https://nhakhoaquoctesg.vn",
      },
      {
        type: "phone",
        title: "24/7 Hotline",
        value: "0903 123 456",
        value_secondary: "0909 456 789",
        cta_label: null,
        cta_link: null,
      },
      {
        type: "address",
        title: "Heritage Address",
        value: "233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam",
        value_secondary: null,
        cta_label: "Open in Google Maps",
        cta_link:
          "https://www.google.com/maps/search/?api=1&query=233%20%E2%80%93%20233A%20Nguy%E1%BB%85n%20Tr%E1%BB%8Dng%20Tuy%E1%BB%83n%2C%20Ph%C6%B0%E1%BB%9Dng%20Ph%C3%BA%20Nhu%E1%BA%ADn%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vi%E1%BB%87t%20Nam",
      },
      {
        type: "hours",
        title: "Operating Hours",
        value:
          "Mon – Sat: 8:00 AM – 7:00 PM\nSunday: 8:00 AM – 5:00 PM",
        value_secondary: null,
        cta_label: null,
        cta_link: null,
      },
    ];

    let order = 1;
    for (const tile of tiles) {
      const res = await client.query(
        `INSERT INTO components_contact_contact_info_tiles 
          (type, title, value, value_secondary, cta_label, cta_link)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [tile.type, tile.title, tile.value, tile.value_secondary, tile.cta_label, tile.cta_link]
      );
      const tileId = res.rows[0].id;

      await client.query(
        `INSERT INTO components_contact_contact_infos_tiles_links
          (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, $3, $4, $5)`,
        [parentId, tileId, "contact.contact-info-tile", "tiles", order]
      );
      console.log(`  [OK] Tile "${tile.title}" (${tile.type}) inserted`);
      order++;
    }
    console.log();

    // ── STEP 6: Link parent to contact_pages_components ──────────────────────
    console.log("STEP 6: Linking to contact_pages...");
    const resPage = await client.query(
      `SELECT id FROM contact_pages ORDER BY id ASC LIMIT 1`
    );
    if (resPage.rows.length > 0) {
      const pageId = resPage.rows[0].id;
      // Remove any stale mapping
      await client.query(
        `DELETE FROM contact_pages_components WHERE entity_id = $1 AND field = 'contact_info'`,
        [pageId]
      );
      await client.query(
        `INSERT INTO contact_pages_components (entity_id, cmp_id, component_type, field, "order")
         VALUES ($1, $2, $3, $4, $5)`,
        [pageId, parentId, "contact.contact-info", "contact_info", 3]
      );
      console.log(`  [OK] Linked to Contact Page ID ${pageId}\n`);
    } else {
      console.warn("  [WARN] No contact_pages row found — link manually in CMS\n");
    }

    await client.query("COMMIT");
    console.log("=".repeat(70));
    console.log("MIGRATION 082 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up new schemas");
    console.log("  2. Run: npm run build (frontend)");
    console.log("  3. Open http://localhost:3000/contact\n");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("\n[ERROR]", err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("[OK] Connection closed");
  }
}

run();
