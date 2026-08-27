#!/usr/bin/env node

/**
 * Migration Script 060: Cleanup Contact Page Schema
 *
 * Changes:
 *  1. Drop 'title' column from contact_pages table
 *  2. Drop 'description' column from contact_pages table
 *
 * Run (dev):
 *   node migration_scripts/060-cleanup-contact-page-schema.js
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
  console.log("MIGRATION 060: Cleanup Contact Page Schema");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    console.log("STEP 1: Dropping title column...");
    await client.query(`
      ALTER TABLE contact_pages 
      DROP COLUMN IF EXISTS title;
    `);
    console.log("  [OK] Dropped title\n");

    console.log("STEP 2: Dropping description column...");
    await client.query(`
      ALTER TABLE contact_pages 
      DROP COLUMN IF EXISTS description;
    `);
    console.log("  [OK] Dropped description\n");

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 060 COMPLETED SUCCESSFULLY");
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
