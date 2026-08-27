#!/usr/bin/env node

/**
 * Migration Script 016: Convert Service Card Images to Media
 *
 * Changes:
 *  1. Drop image_url column from components_services_overview_service_items
 *  2. Truncate services_overview so the bootstrap sequence creates it with real uploads
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
  console.log("MIGRATION 016: Convert Service Card image_url to Strapi Media");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    console.log("STEP 1: Dropping image_url column...");
    await client.query(`
      ALTER TABLE components_services_overview_service_items 
      DROP COLUMN IF EXISTS image_url
    `);
    console.log("  [OK] Column dropped.\n");

    console.log("STEP 2: Wiping existing services_overview (Draft + Published)...");
    await client.query(`
      DELETE FROM services_overview
    `);
    console.log("  [OK] Deleted existing services_overview documents to allow explicit bootstrap recreation.\n");

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 016 COMPLETED SUCCESSFULLY");
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
