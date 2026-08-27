#!/usr/bin/env node

/**
 * Migration Script 051: Rename status to booking_status
 *
 * Problem:
 *  - The "status" field name conflicts with Strapi's internal "status" field
 *  - Strapi uses "status" for draft/publish state
 *  - This causes the booking status to show as "Published" instead of "new"
 *
 * Solution:
 *  - Rename "status" column to "booking_status"
 *  - Update CHECK constraint
 *  - Update indexes
 *  - Preserve all existing data
 *
 * Changes:
 *  1. Rename status column to booking_status
 *  2. Drop old CHECK constraint
 *  3. Create new CHECK constraint for booking_status
 *  4. Drop old index
 *  5. Create new index for booking_status
 *
 * Run (dev):
 *   node migration_scripts/051-rename-status-to-booking-status.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/051-rename-status-to-booking-status.js
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
  console.log("MIGRATION 051: Rename status to booking_status");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check if column already renamed ──────────────────────────
    console.log("STEP 1: Checking current table structure...");
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'booking_submissions' 
      AND column_name IN ('status', 'booking_status')
    `);

    const hasStatus = checkColumn.rows.some((r) => r.column_name === "status");
    const hasBookingStatus = checkColumn.rows.some(
      (r) => r.column_name === "booking_status",
    );

    console.log(`  - Has 'status' column: ${hasStatus}`);
    console.log(`  - Has 'booking_status' column: ${hasBookingStatus}`);

    if (hasBookingStatus && !hasStatus) {
      console.log("  [SKIP] Column already renamed to booking_status\n");
      console.log("\n" + "=".repeat(70));
      console.log("MIGRATION 051 ALREADY APPLIED");
      console.log("=".repeat(70));
      return;
    }

    if (!hasStatus) {
      console.log("  [ERROR] Neither status nor booking_status column found!");
      throw new Error("Table structure is unexpected");
    }

    console.log("  [OK] Ready to rename column\n");

    // ── STEP 2: Get current data for verification ────────────────────────
    console.log("STEP 2: Backing up current data...");
    const currentData = await client.query(`
      SELECT id, document_id, full_name, status, created_at 
      FROM booking_submissions 
      ORDER BY created_at DESC
    `);
    console.log(`  [OK] Found ${currentData.rows.length} records`);
    if (currentData.rows.length > 0) {
      console.log("  Current data:");
      currentData.rows.forEach((row) => {
        console.log(
          `    - ID ${row.id}: ${row.full_name} - status: "${row.status}"`,
        );
      });
    }
    console.log();

    // ── STEP 3: Drop old CHECK constraint ────────────────────────────────
    console.log("STEP 3: Dropping old CHECK constraint...");
    await client.query(`
      ALTER TABLE booking_submissions 
      DROP CONSTRAINT IF EXISTS booking_submissions_status_check
    `);
    console.log("  [OK] Old CHECK constraint dropped\n");

    // ── STEP 4: Drop old index ───────────────────────────────────────────
    console.log("STEP 4: Dropping old index...");
    await client.query(`
      DROP INDEX IF EXISTS idx_booking_submissions_status
    `);
    console.log("  [OK] Old index dropped\n");

    // ── STEP 5: Rename column ────────────────────────────────────────────
    console.log("STEP 5: Renaming column from status to booking_status...");
    await client.query(`
      ALTER TABLE booking_submissions 
      RENAME COLUMN status TO booking_status
    `);
    console.log("  [OK] Column renamed\n");

    // ── STEP 6: Create new CHECK constraint ──────────────────────────────
    console.log("STEP 6: Creating new CHECK constraint...");
    await client.query(`
      ALTER TABLE booking_submissions 
      ADD CONSTRAINT booking_submissions_booking_status_check 
      CHECK (booking_status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled'))
    `);
    console.log("  [OK] New CHECK constraint created\n");

    // ── STEP 7: Create new index ─────────────────────────────────────────
    console.log("STEP 7: Creating new index...");
    await client.query(`
      CREATE INDEX idx_booking_submissions_booking_status 
      ON booking_submissions(booking_status)
    `);
    console.log("  [OK] New index created\n");

    // ── STEP 8: Verify data integrity ────────────────────────────────────
    console.log("STEP 8: Verifying data integrity...");
    const verifyData = await client.query(`
      SELECT id, document_id, full_name, booking_status, created_at 
      FROM booking_submissions 
      ORDER BY created_at DESC
    `);

    if (verifyData.rows.length !== currentData.rows.length) {
      throw new Error(
        `Data count mismatch! Before: ${currentData.rows.length}, After: ${verifyData.rows.length}`,
      );
    }

    console.log(`  [OK] All ${verifyData.rows.length} records preserved`);
    if (verifyData.rows.length > 0) {
      console.log("  Verified data:");
      verifyData.rows.forEach((row) => {
        console.log(
          `    - ID ${row.id}: ${row.full_name} - booking_status: "${row.booking_status}"`,
        );
      });
    }
    console.log();

    // ── STEP 9: Verify table structure ───────────────────────────────────
    console.log("STEP 9: Verifying table structure...");
    const tableInfo = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length,
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'booking_submissions' 
      AND column_name = 'booking_status'
    `);

    if (tableInfo.rows.length === 0) {
      throw new Error("booking_status column not found after rename!");
    }

    console.log("  [OK] Column structure:");
    console.log(`    - Name: ${tableInfo.rows[0].column_name}`);
    console.log(`    - Type: ${tableInfo.rows[0].data_type}`);
    console.log(
      `    - Max Length: ${tableInfo.rows[0].character_maximum_length}`,
    );
    console.log(`    - Nullable: ${tableInfo.rows[0].is_nullable}`);
    console.log();

    // ── STEP 10: Verify constraints ──────────────────────────────────────
    console.log("STEP 10: Verifying constraints...");
    const constraints = await client.query(`
      SELECT constraint_name, constraint_type 
      FROM information_schema.table_constraints 
      WHERE table_name = 'booking_submissions' 
      AND constraint_name LIKE '%booking_status%'
    `);

    console.log(`  [OK] Found ${constraints.rows.length} constraint(s):`);
    constraints.rows.forEach((row) => {
      console.log(`    - ${row.constraint_name} (${row.constraint_type})`);
    });
    console.log();

    // ── STEP 11: Verify indexes ──────────────────────────────────────────
    console.log("STEP 11: Verifying indexes...");
    const indexes = await client.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'booking_submissions' 
      AND indexname LIKE '%booking_status%'
    `);

    console.log(`  [OK] Found ${indexes.rows.length} index(es):`);
    indexes.rows.forEach((row) => {
      console.log(`    - ${row.indexname}`);
    });
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 051 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Update schema.json: status → booking_status");
    console.log("  2. Update controller: status → booking_status");
    console.log("  3. Update middleware: status → booking_status");
    console.log("  4. Update frontend types: status → booking_status");
    console.log("  5. Update frontend API route: status → booking_status");
    console.log("  6. Rebuild Strapi: npm run build");
    console.log("  7. Restart Strapi: npm run develop");
    console.log("  8. Test in admin panel\n");
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
