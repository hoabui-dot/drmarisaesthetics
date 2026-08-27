#!/usr/bin/env node
const { Client } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../strapi-cms/.env") });

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
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

    // Add Columns to table if they don't exist yet
    console.log("STEP 1: Adding location_lat and location_lng columns to components_contact_address_tiles (if not exists)...");
    await client.query(`
      ALTER TABLE components_contact_address_tiles
      ADD COLUMN IF NOT EXISTS location_lat numeric(10,6),
      ADD COLUMN IF NOT EXISTS location_lng numeric(10,6);
    `);

    // Update existing records
    console.log("STEP 2: Updating existing Address tiles with lat/lng...");
    // 233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, Ho Chi Minh City coordinates
    const lat = 10.7745;
    const lng = 106.6775;
    
    await client.query(`
      UPDATE components_contact_address_tiles 
      SET location_lat = $1, location_lng = $2 
      WHERE location_lat IS NULL OR location_lng IS NULL;
    `, [lat, lng]);

    await client.query("COMMIT");
    console.log("\n[SUCCESS] Migration 085 Completed! Lat & Lng injected.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[ERROR]", err);
  } finally {
    await client.end();
  }
}

run();
