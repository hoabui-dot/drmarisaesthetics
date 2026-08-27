#!/usr/bin/env node

const { Client } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../strapi-cms/.env") });

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
    await client.query("BEGIN");
    console.log("Connected to PostgreSQL");

    // Drop old columns
    await client.query(`
      ALTER TABLE components_contact_elite_stack_cards
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS icon_string
    `);
    console.log("Dropped title and icon_string columns.");

    // Add new columns (boolean needs DEFAULT)
    await client.query(`
      ALTER TABLE components_contact_elite_stack_cards
      ADD COLUMN IF NOT EXISTS show_cta BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS cta_link VARCHAR(255)
    `);
    console.log("Added show_cta and cta_link columns.");

    // Make CTA Active on specific prepopulated element if exists
    // The previous seeded data had "Verify Availability" in the last row. Let's make that active.
    await client.query(`
      UPDATE components_contact_elite_stack_cards 
      SET show_cta = true, cta_link = '/booking'
      WHERE cta_label IS NOT NULL AND cta_label != ''
    `);
    console.log("Updated prepopulated row CTA states.");

    await client.query("COMMIT");
    console.log("Migration completed successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
