#!/usr/bin/env node

/**
 * Migration Script 127: Remove Doctor Title Field
 *
 * Changes:
 *  1. Remove 'title' column from 'components_homepage_doctor_profiles' table
 *
 * Run:
 *   node migration_scripts/127-remove-doctor-title.js
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
  console.log("MIGRATION 127: Remove Doctor Title Field");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    const tableName = 'components_homepage_doctor_profiles';

    // ── STEP 1: Check current structure ──────────────────────────────────
    console.log(`STEP 1: Checking structure of ${tableName}...`);

    const columnsCheck = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = '${tableName}'
      ORDER BY ordinal_position;
    `);

    console.log(`  Current columns (${columnsCheck.rows.length}):`);
    columnsCheck.rows.forEach((row) => {
      console.log(`    - ${row.column_name} (${row.data_type})`);
    });
    console.log();

    // ── STEP 2: Remove title column ─────────────────────────────
    console.log("STEP 2: Removing 'title' column...");

    const titleExists = columnsCheck.rows.some(
      (row) => row.column_name === "title",
    );

    if (titleExists) {
      await client.query(`
        ALTER TABLE ${tableName} 
        DROP COLUMN IF EXISTS title CASCADE;
      `);
      console.log("  [OK] Removed 'title' column");
    } else {
      console.log("  [SKIP] 'title' column does not exist");
    }
    console.log();

    // ── STEP 3: Verify final structure ───────────────────────────────────
    console.log("STEP 3: Verifying final table structure...");

    const finalColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = '${tableName}'
      ORDER BY ordinal_position;
    `);

    console.log(`  Final columns (${finalColumns.rows.length}):`);
    finalColumns.rows.forEach((row) => {
      console.log(`    - ${row.column_name} (${row.data_type})`);
    });
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 127 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up schema changes");
    console.log("  2. Verify the Doctor Section on the homepage\n");

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
