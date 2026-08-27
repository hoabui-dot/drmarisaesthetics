#!/usr/bin/env node

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

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL");
    
    // Drop all old component tables for services overview so Strapi cleanly rebuilds them
    await client.query(`DROP TABLE IF EXISTS components_services_overview_cta CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS components_services_overview_feature_items CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS components_services_overview_features CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS components_services_overview_features_cmps CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS components_services_overview_hero CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS components_services_overview_service_cards CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS components_services_overview_service_cards_cmps CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS components_services_overview_service_items CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS services_overview_cmps CASCADE;`);
    
    // Truncate the main singleton table
    await client.query(`TRUNCATE TABLE services_overview CASCADE;`);
    
    console.log("Migration (Cleanup) completed successfully");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
