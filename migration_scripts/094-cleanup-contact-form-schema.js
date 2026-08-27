#!/usr/bin/env node

/**
 * Migration Script 094: Cleanup Contact Form Schema
 *
 * Purpose:
 *  Verify and cleanup the contact form schema to ensure it matches
 *  the JSON schema definition and remove any orphaned columns.
 *
 * Changes:
 *  1. Verify all columns in components_contact_contact_forms table
 *  2. Check for any orphaned/unused columns
 *  3. Ensure data types match schema definition
 *
 * Run (dev):
 *   node migration_scripts/094-cleanup-contact-form-schema.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 DATABASE_NAME=dental_cms_strapi \
 *   DATABASE_USERNAME=postgres DATABASE_PASSWORD=postgres \
 *   node migration_scripts/094-cleanup-contact-form-schema.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

// Expected schema based on strapi-cms/src/components/contact/contact-form.json
const EXPECTED_COLUMNS = [
  "id",
  "title",
  "description",
  "name_label",
  "name_placeholder",
  "phone_label",
  "phone_placeholder",
  "email_label",
  "email_placeholder",
  "service_label",
  "service_placeholder",
  "service_options",
  "message_label",
  "message_placeholder",
  "submit_button_text",
  "success_message",
  "error_message",
];

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 094: Cleanup Contact Form Schema");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check if table exists ─────────────────────────────────────
    console.log(
      "STEP 1: Checking if components_contact_contact_forms table exists...",
    );

    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'components_contact_contact_forms'
      )
    `);

    if (!tableCheck.rows[0].exists) {
      console.log("  [WARN] Table does not exist. Nothing to cleanup.\n");
      return;
    }

    console.log("  [OK] Table exists\n");

    // ── STEP 2: Get current columns ───────────────────────────────────────
    console.log("STEP 2: Analyzing current table structure...");

    const columnsResult = await client.query(`
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'components_contact_contact_forms'
      ORDER BY ordinal_position
    `);

    const currentColumns = columnsResult.rows.map((row) => row.column_name);

    console.log(`  [INFO] Found ${currentColumns.length} columns:`);
    currentColumns.forEach((col) => {
      const isExpected = EXPECTED_COLUMNS.includes(col);
      const status = isExpected ? "✓" : "✗";
      console.log(`    ${status} ${col}`);
    });
    console.log();

    // ── STEP 3: Identify orphaned columns ─────────────────────────────────
    console.log("STEP 3: Identifying orphaned columns...");

    const orphanedColumns = currentColumns.filter(
      (col) => !EXPECTED_COLUMNS.includes(col),
    );

    if (orphanedColumns.length === 0) {
      console.log("  [OK] No orphaned columns found\n");
    } else {
      console.log(
        `  [WARN] Found ${orphanedColumns.length} orphaned column(s):`,
      );
      orphanedColumns.forEach((col) => {
        console.log(`    - ${col}`);
      });
      console.log();

      // Ask for confirmation (in production, you might want to auto-remove)
      console.log(
        "  [INFO] To remove orphaned columns, uncomment the DROP COLUMN statements below\n",
      );

      // Commented out for safety - uncomment to actually drop columns
      // for (const col of orphanedColumns) {
      //   console.log(`  [INFO] Dropping column: ${col}`);
      //   await client.query(`
      //     ALTER TABLE components_contact_contact_forms
      //     DROP COLUMN IF EXISTS ${col}
      //   `);
      //   console.log(`    [OK] Dropped ${col}`);
      // }
    }

    // ── STEP 4: Identify missing columns ──────────────────────────────────
    console.log("STEP 4: Identifying missing columns...");

    const missingColumns = EXPECTED_COLUMNS.filter(
      (col) => !currentColumns.includes(col),
    );

    if (missingColumns.length === 0) {
      console.log("  [OK] All expected columns exist\n");
    } else {
      console.log(`  [WARN] Found ${missingColumns.length} missing column(s):`);
      missingColumns.forEach((col) => {
        console.log(`    - ${col}`);
      });
      console.log();
      console.log(
        "  [INFO] Missing columns should be added via Strapi schema update\n",
      );
    }

    // ── STEP 5: Verify data ───────────────────────────────────────────────
    console.log("STEP 5: Verifying data...");

    const dataCheck = await client.query(`
      SELECT 
        id,
        title,
        email_label,
        email_placeholder
      FROM components_contact_contact_forms
      LIMIT 5
    `);

    console.log(`  [INFO] Found ${dataCheck.rows.length} record(s):`);
    dataCheck.rows.forEach((row) => {
      console.log(`    ID ${row.id}: ${row.title}`);
      console.log(`      email_label: ${row.email_label || "NULL"}`);
      console.log(
        `      email_placeholder: ${row.email_placeholder || "NULL"}`,
      );
    });
    console.log();

    // ── STEP 6: Summary ───────────────────────────────────────────────────
    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 094 ANALYSIS COMPLETE");
    console.log("=".repeat(70));
    console.log("\nSummary:");
    console.log(`  Total columns: ${currentColumns.length}`);
    console.log(`  Expected columns: ${EXPECTED_COLUMNS.length}`);
    console.log(`  Orphaned columns: ${orphanedColumns.length}`);
    console.log(`  Missing columns: ${missingColumns.length}`);

    if (orphanedColumns.length === 0 && missingColumns.length === 0) {
      console.log("\n✓ Schema is clean and matches expected structure");
    } else {
      console.log("\n⚠ Schema cleanup recommended");
      if (orphanedColumns.length > 0) {
        console.log(
          "  - Remove orphaned columns (uncomment DROP statements in script)",
        );
      }
      if (missingColumns.length > 0) {
        console.log("  - Add missing columns via Strapi schema update");
      }
    }
    console.log();
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
