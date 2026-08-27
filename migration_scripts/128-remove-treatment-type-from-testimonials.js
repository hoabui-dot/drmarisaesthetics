#!/usr/bin/env node

/**
 * Migration Script 128: Remove Treatment Type Field from Testimonials
 *
 * Changes:
 *  1. Remove 'treatment_type' column from 'components_homepage_combined_testimonial_result_items'
 *  2. Remove 'treatment_type' column from 'components_customer_combined_testimonial_result_items'
 *
 * Run:
 *   node migration_scripts/128-remove-treatment-type-from-testimonials.js
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
  console.log("MIGRATION 128: Remove Treatment Type Field from Testimonials");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    const tables = [
      'components_homepage_combined_testimonial_result_items',
      'components_customer_combined_testimonial_result_items'
    ];

    for (const tableName of tables) {
      console.log(`Processing table: ${tableName}...`);

      // ── STEP 1: Check current structure ──────────────────────────────────
      const columnsCheck = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '${tableName}'
        AND column_name = 'treatment_type';
      `);

      if (columnsCheck.rows.length > 0) {
        console.log(`  Removing 'treatment_type' column from ${tableName}...`);
        await client.query(`
          ALTER TABLE ${tableName} 
          DROP COLUMN IF EXISTS treatment_type CASCADE;
        `);
        console.log(`  [OK] Removed column from ${tableName}`);
      } else {
        console.log(`  [SKIP] 'treatment_type' column does not exist in ${tableName}`);
      }
      console.log();
    }

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 128 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Update Strapi component JSON schemas");
    console.log("  2. Restart Strapi to pick up schema changes\n");

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
