#!/usr/bin/env node

/**
 * Migration Script 049: Create Booking Submissions Collection Type
 *
 * Changes:
 *  1. Create booking_submissions table
 *  2. Create indexes for performance
 *  3. Insert test record to verify structure
 *  4. Verify table creation
 *
 * Run (dev):
 *   node migration_scripts/049-create-booking-submissions.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/049-create-booking-submissions.js
 */

const { Client } = require("pg");
const { randomUUID } = require("crypto");

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
  console.log("MIGRATION 049: Create Booking Submissions Collection Type");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Create booking_submissions table ──────────────────────────
    console.log("STEP 1: Creating booking_submissions table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS booking_submissions (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(255),
        full_name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        service VARCHAR(255) NOT NULL,
        other_service VARCHAR(255),
        message TEXT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP,
        created_by_id INTEGER,
        updated_by_id INTEGER,
        locale VARCHAR(255)
      )
    `);

    console.log("  [OK] Table created\n");

    // ── STEP 2: Create indexes ────────────────────────────────────────────
    console.log("STEP 2: Creating indexes for performance...");

    // Index on document_id for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_booking_submissions_document_id 
      ON booking_submissions(document_id)
    `);
    console.log("  [OK] Index on document_id created");

    // Index on email for faster searches
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_booking_submissions_email 
      ON booking_submissions(email)
    `);
    console.log("  [OK] Index on email created");

    // Index on status for filtering
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_booking_submissions_status 
      ON booking_submissions(status)
    `);
    console.log("  [OK] Index on status created");

    // Index on created_at for sorting
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_booking_submissions_created_at 
      ON booking_submissions(created_at DESC)
    `);
    console.log("  [OK] Index on created_at created\n");

    // ── STEP 3: Verify table structure ────────────────────────────────────
    console.log("STEP 3: Verifying table structure...");

    const tableInfo = await client.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'booking_submissions'
      ORDER BY ordinal_position
    `);

    console.log(`  [OK] Table has ${tableInfo.rows.length} columns:`);
    tableInfo.rows.forEach((col) => {
      const nullable = col.is_nullable === "YES" ? "NULL" : "NOT NULL";
      const length = col.character_maximum_length
        ? `(${col.character_maximum_length})`
        : "";
      console.log(
        `    - ${col.column_name}: ${col.data_type}${length} ${nullable}`,
      );
    });
    console.log();

    // ── STEP 4: Verify indexes ────────────────────────────────────────────
    console.log("STEP 4: Verifying indexes...");

    const indexes = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'booking_submissions'
      ORDER BY indexname
    `);

    console.log(`  [OK] Table has ${indexes.rows.length} indexes:`);
    indexes.rows.forEach((idx) => {
      console.log(`    - ${idx.indexname}`);
    });
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 049 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Create Strapi API files (controllers, routes, services)");
    console.log("  2. Restart Strapi: cd strapi-cms && npm run develop");
    console.log("  3. Verify collection type in Strapi admin panel");
    console.log("  4. Test API endpoint: POST /api/booking-submissions\n");
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
