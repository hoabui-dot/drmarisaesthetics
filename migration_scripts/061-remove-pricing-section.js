#!/usr/bin/env node

/**
 * Migration Script 061: Remove Pricing Section
 *
 * Changes:
 *  1. Drop components_homepage_pricings and related link tables
 *  2. Drop components_homepage_pricing_plans
 *  3. Remove homepage.pricing references from homepages_cmps
 *
 * Run (dev):
 *   node migration_scripts/061-remove-pricing-section.js
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
  console.log("MIGRATION 061: Remove Pricing Section");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    console.log("STEP 1: Removing homepage.pricing from homepages_cmps...");
    // Only attempt if table exists to be safe
    try {
      const res = await client.query(`
        DELETE FROM homepages_cmps
        WHERE component_type = 'homepage.pricing';
      `);
      console.log(`  [OK] Deleted ${res.rowCount} references from homepages_cmps`);
    } catch (e) {
      console.log("  [INFO] Table homepages_cmps not found or other error: " + e.message);
    }

    console.log("\nSTEP 2: Dropping pricing component tables...");
    
    const tablesToDrop = [
      'components_homepage_pricings_plans_cmps',
      'components_homepage_pricings_plans_links',
      'components_homepage_pricings_components',
      'components_homepage_pricings',
      'components_homepage_pricing_plans'
    ];

    for (const table of tablesToDrop) {
      try {
        await client.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
        console.log(`  [OK] Dropped ${table} (if existed)`);
      } catch (e) {
        console.log(`  [ERROR] Could not drop ${table}: ${e.message}`);
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 061 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
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
