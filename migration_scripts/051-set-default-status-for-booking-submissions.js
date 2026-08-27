#!/usr/bin/env node

/**
 * Migration Script 051: Set Default Status for Booking Submissions
 *
 * Changes:
 *  1. Set default value 'new' for status column in booking_submissions table
 *  2. Update existing NULL status values to 'new'
 *
 * Run (dev):
 *   node migration_scripts/051-set-default-status-for-booking-submissions.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/051-set-default-status-for-booking-submissions.js
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
  console.log("MIGRATION 051: Set Default Status for Booking Submissions");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check current status values ──────────────────────────────
    console.log("STEP 1: Checking current status values...");
    const checkResult = await client.query(`
      SELECT status, COUNT(*) as count
      FROM booking_submissions
      GROUP BY status
      ORDER BY count DESC
    `);
    console.log("  Current status distribution:");
    checkResult.rows.forEach((row) => {
      console.log(
        `    ${row.status === null ? "NULL" : row.status}: ${row.count}`,
      );
    });
    console.log();

    // ── STEP 2: Update NULL status values to 'new' ───────────────────────
    console.log("STEP 2: Updating NULL status values to 'new'...");
    const updateResult = await client.query(`
      UPDATE booking_submissions
      SET status = 'new'
      WHERE status IS NULL
    `);
    console.log(`  [OK] Updated ${updateResult.rowCount} rows\n`);

    // ── STEP 3: Set default value for status column ──────────────────────
    console.log("STEP 3: Setting default value for status column...");
    await client.query(`
      ALTER TABLE booking_submissions
      ALTER COLUMN status SET DEFAULT 'new'
    `);
    console.log("  [OK] Default value set to 'new'\n");

    // ── STEP 4: Verify changes ────────────────────────────────────────────
    console.log("STEP 4: Verifying changes...");

    // Check default value
    const defaultCheck = await client.query(`
      SELECT column_default
      FROM information_schema.columns
      WHERE table_name = 'booking_submissions'
      AND column_name = 'status'
    `);
    console.log(
      `  Default value: ${defaultCheck.rows[0]?.column_default || "none"}`,
    );

    // Check status distribution after update
    const finalCheck = await client.query(`
      SELECT status, COUNT(*) as count
      FROM booking_submissions
      GROUP BY status
      ORDER BY count DESC
    `);
    console.log("  Final status distribution:");
    finalCheck.rows.forEach((row) => {
      console.log(
        `    ${row.status === null ? "NULL" : row.status}: ${row.count}`,
      );
    });
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 051 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up changes");
    console.log("  2. Test creating new booking submissions");
    console.log("  3. Verify status defaults to 'new' in Strapi admin panel\n");
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
