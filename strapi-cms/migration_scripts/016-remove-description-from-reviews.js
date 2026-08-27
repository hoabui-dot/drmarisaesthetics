const { Client } = require('pg');

/**
 * Migration Script 016: Remove description from reviews
 *
 * Removes the legacy `description` field from the `components_customer_reviews` table.
 * 
 * Execution:
 *   node migration_scripts/016-remove-description-from-reviews.js
 * 
 * Or with custom credentials:
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/016-remove-description-from-reviews.js
 */

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

async function runMigration() {
  console.log("MIGRATION 016: Remove description from reviews");
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`
  );

  const client = new Client(DB_CONFIG);

  try {
    // ── STEP 1: Connect ───────────────────────────────────────────────────
    console.log("STEP 1: Connecting to database...");
    await client.connect();
    console.log("  [OK] Connected\n");

    // ── STEP 2: Perform migration ─────────────────────────────────────────
    console.log("STEP 2: Performing migration...");
    
    await client.query(`
      ALTER TABLE components_customer_reviews 
      DROP COLUMN IF EXISTS description;
    `);

    console.log("  [OK] Migration completed\n");

  } catch (error) {
    console.error("\n[ERROR] Migration failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("MIGRATION 016 COMPLETED SUCCESSFULLY");
  }
}

runMigration();
