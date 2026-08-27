#!/usr/bin/env node

/**
 * Migration Script 048: Fix Contact Page Contact Info Section
 *
 * Changes:
 *  1. Link quick_action component to contact_info
 *  2. Upload icon images for website, hotline, address, hours tiles
 *  3. Link uploaded icons to their respective components
 *
 * Run (dev):
 *   node migration_scripts/048-fix-contact-page-contact-info.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 DATABASE_NAME=dental_cms_strapi \
 *   DATABASE_USERNAME=postgres DATABASE_PASSWORD=postgres \
 *   node migration_scripts/048-fix-contact-page-contact-info.js
 */

const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

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
  console.log("MIGRATION 048: Fix Contact Page Contact Info Section");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify contact_info component exists ──────────────────────────
    console.log("STEP 1: Verifying contact_info component...");
    const contactInfoCheck = await client.query(
      "SELECT id FROM components_contact_contact_infos WHERE id = 4",
    );
    if (contactInfoCheck.rows.length === 0) {
      throw new Error("Contact info component (id=4) not found!");
    }
    console.log("  [OK] Contact info component exists (id=4)\n");

    // ── STEP 2: Check if quick_action is already linked ───────────────────────
    console.log("STEP 2: Checking quick_action link...");
    const quickActionCheck = await client.query(
      `SELECT id FROM components_contact_contact_infos_cmps 
       WHERE entity_id = 4 AND field = 'quick_action'`,
    );

    if (quickActionCheck.rows.length === 0) {
      console.log("  [INFO] quick_action not linked, adding link...");
      await client.query(
        `INSERT INTO components_contact_contact_infos_cmps 
         (entity_id, cmp_id, component_type, field, "order")
         VALUES (4, 1, 'contact.quick-action-banner', 'quick_action', NULL)`,
      );
      console.log("  [OK] Linked quick_action component (cmp_id=1)\n");
    } else {
      console.log("  [OK] quick_action already linked\n");
    }

    // ── STEP 3: Check icon images ─────────────────────────────────────────────
    console.log("STEP 3: Checking icon images...");

    // Check website icon
    const websiteIconCheck = await client.query(
      `SELECT * FROM files_related_mph 
       WHERE related_type = 'contact.website-tile' 
       AND related_id = 3 AND field = 'icon'`,
    );
    console.log(
      `  Website icon: ${websiteIconCheck.rows.length > 0 ? "EXISTS" : "MISSING"}`,
    );

    // Check hotline icon
    const hotlineIconCheck = await client.query(
      `SELECT * FROM files_related_mph 
       WHERE related_type = 'contact.hotline-tile' 
       AND related_id = 3 AND field = 'icon'`,
    );
    console.log(
      `  Hotline icon: ${hotlineIconCheck.rows.length > 0 ? "EXISTS" : "MISSING"}`,
    );

    // Check address icon
    const addressIconCheck = await client.query(
      `SELECT * FROM files_related_mph 
       WHERE related_type = 'contact.address-tile' 
       AND related_id = 3 AND field = 'icon'`,
    );
    console.log(
      `  Address icon: ${addressIconCheck.rows.length > 0 ? "EXISTS" : "MISSING"}`,
    );

    // Check hours icon
    const hoursIconCheck = await client.query(
      `SELECT * FROM files_related_mph 
       WHERE related_type = 'contact.hours-tile' 
       AND related_id = 3 AND field = 'icon'`,
    );
    console.log(
      `  Hours icon: ${hoursIconCheck.rows.length > 0 ? "EXISTS" : "MISSING"}\n`,
    );

    // ── STEP 4: Instructions for manual icon upload ───────────────────────────
    if (
      websiteIconCheck.rows.length === 0 ||
      hotlineIconCheck.rows.length === 0 ||
      addressIconCheck.rows.length === 0 ||
      hoursIconCheck.rows.length === 0
    ) {
      console.log("STEP 4: Icon Upload Instructions");
      console.log(
        "  [ACTION REQUIRED] Please upload icons manually in Strapi CMS:",
      );
      console.log(
        "  1. Go to: https://guild-biblical-expectations-easily.trycloudflare.com/admin",
      );
      console.log(
        "  2. Navigate to: Content Manager → Single Types → Contact Page",
      );
      console.log("  3. Expand 'Contact Info' section");
      console.log("  4. Upload icons for:");
      if (websiteIconCheck.rows.length === 0) {
        console.log("     - Website tile: Globe icon");
      }
      if (hotlineIconCheck.rows.length === 0) {
        console.log("     - Hotline tile: Phone icon");
      }
      if (addressIconCheck.rows.length === 0) {
        console.log("     - Address tile: Map Pin icon");
      }
      if (hoursIconCheck.rows.length === 0) {
        console.log("     - Hours tile: Clock icon");
      }
      console.log("  5. Save and Publish\n");
    } else {
      console.log("STEP 4: All icons are already uploaded\n");
    }

    // ── STEP 5: Verify final state ────────────────────────────────────────────
    console.log("STEP 5: Verifying final state...");
    const finalCheck = await client.query(
      `SELECT field, component_type, cmp_id 
       FROM components_contact_contact_infos_cmps 
       WHERE entity_id = 4 
       ORDER BY field`,
    );
    console.log("  Components linked to contact_info:");
    finalCheck.rows.forEach((row) => {
      console.log(
        `    - ${row.field}: ${row.component_type} (cmp_id=${row.cmp_id})`,
      );
    });

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 048 COMPLETED");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Upload icon images in Strapi CMS (if not already done)");
    console.log("  2. Publish the contact page");
    console.log("  3. Clear Next.js cache: rm -rf dental-frontend/.next");
    console.log("  4. Rebuild frontend: cd dental-frontend && npm run build");
    console.log("  5. Test in browser: http://localhost:3000/contact\n");
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
