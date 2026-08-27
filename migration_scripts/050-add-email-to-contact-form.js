#!/usr/bin/env node

/**
 * Migration Script 050: Add Email Fields to Contact Form Component
 *
 * Changes:
 *  1. Add email_label column to components_contact_contact_forms
 *  2. Add email_placeholder column to components_contact_contact_forms
 *  3. Update existing record with default values
 *
 * Run (dev):
 *   node migration_scripts/050-add-email-to-contact-form.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/050-add-email-to-contact-form.js
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
  console.log("MIGRATION 050: Add Email Fields to Contact Form Component");
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
        WHERE table_name = 'components_contact_contact_forms'
      )
    `);

    if (!tableCheck.rows[0].exists) {
      console.log("  [WARN] Table does not exist. Skipping migration.\n");
      return;
    }

    console.log("  [OK] Table exists\n");

    // ── STEP 2: Add email_label column ────────────────────────────────────
    console.log("STEP 2: Adding email_label column...");

    await client.query(`
      ALTER TABLE components_contact_contact_forms 
      ADD COLUMN IF NOT EXISTS email_label VARCHAR(255) DEFAULT 'Email Address'
    `);

    console.log("  [OK] Column added\n");

    // ── STEP 3: Add email_placeholder column ──────────────────────────────
    console.log("STEP 3: Adding email_placeholder column...");

    await client.query(`
      ALTER TABLE components_contact_contact_forms 
      ADD COLUMN IF NOT EXISTS email_placeholder VARCHAR(255) DEFAULT 'your.email@example.com'
    `);

    console.log("  [OK] Column added\n");

    // ── STEP 4: Update existing records ───────────────────────────────────
    console.log("STEP 4: Updating existing records with default values...");

    const updateResult = await client.query(`
      UPDATE components_contact_contact_forms
      SET 
        email_label = COALESCE(email_label, 'Email Address'),
        email_placeholder = COALESCE(email_placeholder, 'your.email@example.com')
      WHERE email_label IS NULL OR email_placeholder IS NULL
    `);

    console.log(`  [OK] Updated ${updateResult.rowCount} record(s)\n`);

    // ── STEP 5: Verify results ────────────────────────────────────────────
    console.log("STEP 5: Verifying results...");

    const verifyResult = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(email_label) as with_email_label,
        COUNT(email_placeholder) as with_email_placeholder
      FROM components_contact_contact_forms
    `);

    const stats = verifyResult.rows[0];
    console.log(`  [OK] Total records: ${stats.total}`);
    console.log(`  [OK] Records with email_label: ${stats.with_email_label}`);
    console.log(
      `  [OK] Records with email_placeholder: ${stats.with_email_placeholder}\n`,
    );

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 050 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up schema changes");
    console.log("  2. Verify email fields in Strapi admin panel");
    console.log("  3. Test contact form with email field\n");
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
