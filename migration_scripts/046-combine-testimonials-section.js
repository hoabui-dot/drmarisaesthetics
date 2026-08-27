#!/usr/bin/env node

/**
 * Migration Script 046: Combine Testimonials and Before/After Sections
 *
 * Changes:
 *  1. Remove old `homepage.testimonials` from homepages_layout_links
 *  2. Remove old `homepage.before-after` from homepages_layout_links
 *  3. Drop old tables for testimonials and before-after
 *
 * Run (dev):
 *   node migration_scripts/046-combine-testimonials-section.js
 */

const { Client } = require("pg");

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

async function run() {

  console.log("=".repeat(70));
  console.log("MIGRATION 046: Combine Testimonials and Before/After Sections");
  console.log("=".repeat(70));
  console.log(`\nDatabase: 100.68.50.41:5437/dental_cms_strapi\n`);

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Remove Old Layout Links ───────────────────────────────────
    console.log("STEP 1: Removing old layout links from homepages_layout_links...");
    await client.query(`
      DELETE FROM homepages_layout_links
      WHERE component_type IN ('homepage.testimonials', 'homepage.before-after')
    `);
    console.log("  [OK] Old layout links removed\n");

    // ── STEP 2: Drop Old Tables ──────────────────────────────────────────
    console.log("STEP 2: Dropping old tables...");
    const oldTables = [
      "components_homepage_testimonials_items_cmps",
      "components_homepage_testimonial_items",
      "components_homepage_testimonials",
      "components_homepage_before_afters_highlights_cmps",
      "components_homepage_before_afters_cases_cmps",
      "components_homepage_before_after_cases_highlights_cmps",
      "components_homepage_before_after_cases",
      "components_homepage_before_after_highlights",
      "components_homepage_before_afters"
    ];

    for (const table of oldTables) {
      await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
      console.log(`  [OK] Dropped ${table}`);
    }
    console.log("");

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 046 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up new component schema (Strapi will auto-create tables for the new Combined section).");
    console.log("  2. Manually add the new Combined Testimonial Result section in Strapi Admin panel and input required data.");
    console.log("  3. Update dental-frontend/src/types/strapi.ts to include the new component.");

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
