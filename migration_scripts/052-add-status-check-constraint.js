#!/usr/bin/env node

/**
 * Migration Script 052: Add Status Check Constraint
 *
 * Changes:
 *  1. Add CHECK constraint to ensure status is one of the valid enum values
 *  2. Verify existing data complies with the constraint
 *
 * Run (dev):
 *   node migration_scripts/052-add-status-check-constraint.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/052-add-status-check-constraint.js
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
  console.log("MIGRATION 052: Add Status Check Constraint");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check existing status values ─────────────────────────────
    console.log("STEP 1: Checking existing status values...");
    const checkResult = await client.query(`
      SELECT DISTINCT status
      FROM booking_submissions
      ORDER BY status
    `);
    console.log("  Existing status values:");
    checkResult.rows.forEach((row) => {
      console.log(`    - ${row.status === null ? "NULL" : row.status}`);
    });
    console.log();

    // ── STEP 2: Check for invalid status values ──────────────────────────
    console.log("STEP 2: Checking for invalid status values...");
    const validStatuses = [
      "new",
      "contacted",
      "scheduled",
      "completed",
      "cancelled",
    ];
    const invalidResult = await client.query(`
      SELECT id, full_name, status
      FROM booking_submissions
      WHERE status IS NOT NULL
      AND status NOT IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')
      LIMIT 10
    `);

    if (invalidResult.rowCount > 0) {
      console.log(
        `  [WARNING] Found ${invalidResult.rowCount} rows with invalid status:`,
      );
      invalidResult.rows.forEach((row) => {
        console.log(
          `    ID ${row.id}: ${row.full_name} - status: "${row.status}"`,
        );
      });
      console.log("\n  Please fix these values before adding the constraint.");
      console.log("  You can update them with:");
      console.log(
        "    UPDATE booking_submissions SET status = 'new' WHERE status NOT IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled');\n",
      );
      process.exit(1);
    } else {
      console.log("  [OK] All status values are valid\n");
    }

    // ── STEP 3: Drop existing constraint if exists ───────────────────────
    console.log("STEP 3: Dropping existing constraint if exists...");
    await client.query(`
      ALTER TABLE booking_submissions
      DROP CONSTRAINT IF EXISTS booking_submissions_status_check
    `);
    console.log("  [OK] Existing constraint dropped (if any)\n");

    // ── STEP 4: Add CHECK constraint ──────────────────────────────────────
    console.log("STEP 4: Adding CHECK constraint...");
    await client.query(`
      ALTER TABLE booking_submissions
      ADD CONSTRAINT booking_submissions_status_check
      CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled'))
    `);
    console.log("  [OK] CHECK constraint added\n");

    // ── STEP 5: Verify constraint ─────────────────────────────────────────
    console.log("STEP 5: Verifying constraint...");
    const constraintCheck = await client.query(`
      SELECT conname, pg_get_constraintdef(oid) as definition
      FROM pg_constraint
      WHERE conrelid = 'booking_submissions'::regclass
      AND contype = 'c'
    `);

    if (constraintCheck.rowCount > 0) {
      console.log("  Constraint details:");
      constraintCheck.rows.forEach((row) => {
        console.log(`    ${row.conname}: ${row.definition}`);
      });
    } else {
      console.log("  [WARNING] No CHECK constraints found");
    }
    console.log();

    // ── STEP 6: Test constraint ───────────────────────────────────────────
    console.log("STEP 6: Testing constraint...");
    try {
      await client.query(`
        INSERT INTO booking_submissions (full_name, phone_number, email, service, status)
        VALUES ('Test Invalid', '1234567890', 'test@test.com', 'Test', 'invalid_status')
      `);
      console.log("  [ERROR] Constraint did not prevent invalid status!");
    } catch (err) {
      if (err.message.includes("booking_submissions_status_check")) {
        console.log(
          "  [OK] Constraint correctly prevents invalid status values\n",
        );
      } else {
        throw err;
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 052 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nValid status values:");
    console.log("  - new");
    console.log("  - contacted");
    console.log("  - scheduled");
    console.log("  - completed");
    console.log("  - cancelled");
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi (if needed)");
    console.log("  2. Test updating booking submission status in admin panel");
    console.log("  3. Verify only valid enum values are accepted\n");
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
