#!/usr/bin/env node

/**
 * Migration Script 116: Complete Removal of user_avatars from CTA components
 *
 * Changes:
 * - Remove user_avatars entries from files_related_mph for all CTA components
 * - Clean up any potential legacy junction tables
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

  console.log("=".repeat(80));
  console.log("MIGRATION 116: COMPLETE REMOVAL OF CTA USER AVATARS");
  console.log("=".repeat(80));

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Remove media relations ────────────────────────────────────
    console.log("STEP 1: Removing user_avatars from files_related_mph...");
    const deleteResult = await client.query(`
      DELETE FROM files_related_mph
      WHERE (related_type = 'homepage.cta' OR related_type = 'about.cta' OR related_type = 'services-overview.cta')
      AND field = 'user_avatars'
    `);
    console.log(`  [OK] Deleted ${deleteResult.rowCount} relations\n`);

    // ── STEP 2: Clean up junction tables ──────────────────────────────────
    console.log("STEP 2: Cleaning up junction tables if they exist...");
    const tablesToClean = [
      'components_homepage_ctas_user_avatars_links',
      'components_about_ctas_user_avatars_links',
      'components_services_overview_ctas_user_avatars_links'
    ];

    for (const table of tablesToClean) {
      await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
      console.log(`  [OK] Attempted to drop ${table}`);
    }
    console.log("  [OK] Junction tables cleanup finished\n");

    // ── STEP 3: Verify ────────────────────────────────────────────────────
    console.log("STEP 3: Verifying final state...");
    const verifyResult = await client.query(`
      SELECT COUNT(*) FROM files_related_mph
      WHERE (related_type = 'homepage.cta' OR related_type = 'about.cta' OR related_type = 'services-overview.cta')
      AND field = 'user_avatars'
    `);
    console.log(`  Remaining relations: ${verifyResult.rows[0].count}`);
    
    if (parseInt(verifyResult.rows[0].count) === 0) {
      console.log("\n✅ MIGRATION 116 COMPLETED SUCCESSFULLY");
    } else {
      console.warn("\n⚠️ MIGRATION 116 FINISHED WITH REMAINING DATA");
    }

  } catch (err) {
    console.error("\n[ERROR]", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
