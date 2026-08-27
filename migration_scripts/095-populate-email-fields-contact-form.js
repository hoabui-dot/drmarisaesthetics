#!/usr/bin/env node

/**
 * Migration Script 095: Populate Email Fields in Contact Form
 *
 * Purpose:
 *  Populate the email_label and email_placeholder fields that are currently NULL
 *
 * Changes:
 *  1. Update email_label to "Email Address"
 *  2. Update email_placeholder to "your.email@example.com"
 *
 * Run (dev):
 *   node migration_scripts/095-populate-email-fields-contact-form.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 DATABASE_NAME=dental_cms_strapi \
 *   DATABASE_USERNAME=postgres DATABASE_PASSWORD=postgres \
 *   node migration_scripts/095-populate-email-fields-contact-form.js
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
  console.log("MIGRATION 095: Populate Email Fields in Contact Form");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check current values ──────────────────────────────────────
    console.log("STEP 1: Checking current email field values...");

    const currentData = await client.query(`
      SELECT id, email_label, email_placeholder
      FROM components_contact_contact_forms
    `);

    console.log(`  [INFO] Found ${currentData.rows.length} record(s):`);
    currentData.rows.forEach((row) => {
      console.log(`    ID ${row.id}:`);
      console.log(`      email_label: ${row.email_label || "NULL"}`);
      console.log(
        `      email_placeholder: ${row.email_placeholder || "NULL"}`,
      );
    });
    console.log();

    // ── STEP 2: Update email fields ───────────────────────────────────────
    console.log("STEP 2: Updating email fields...");

    const updateResult = await client.query(`
      UPDATE components_contact_contact_forms
      SET 
        email_label = 'Email Address',
        email_placeholder = 'your.email@example.com'
      WHERE email_label IS NULL OR email_placeholder IS NULL
      RETURNING id, email_label, email_placeholder
    `);

    console.log(`  [OK] Updated ${updateResult.rows.length} record(s):`);
    updateResult.rows.forEach((row) => {
      console.log(`    ID ${row.id}:`);
      console.log(`      email_label: ${row.email_label}`);
      console.log(`      email_placeholder: ${row.email_placeholder}`);
    });
    console.log();

    // ── STEP 3: Verify results ────────────────────────────────────────────
    console.log("STEP 3: Verifying results...");

    const verifyData = await client.query(`
      SELECT id, email_label, email_placeholder
      FROM components_contact_contact_forms
    `);

    console.log(`  [INFO] Final state:`);
    verifyData.rows.forEach((row) => {
      const labelOk = row.email_label !== null;
      const placeholderOk = row.email_placeholder !== null;
      const status = labelOk && placeholderOk ? "✓" : "✗";
      console.log(
        `    ${status} ID ${row.id}: label="${row.email_label}", placeholder="${row.email_placeholder}"`,
      );
    });
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 095 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log(
      "  1. Update frontend to use data.emailLabel and data.emailPlaceholder",
    );
    console.log(
      "  2. Remove hardcoded email field values from ContactPageClient.tsx\n",
    );
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
