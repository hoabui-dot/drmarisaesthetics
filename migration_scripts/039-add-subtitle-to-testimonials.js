#!/usr/bin/env node

/**
 * Migration Script 039: Add subtitle to homepage.testimonials component
 *
 * Changes:
 *  1. ALTER TABLE components_homepage_testimonials — add subtitle column
 *  2. UPDATE existing rows with the previous hardcoded default text
 *
 * Run (dev):
 *   node migration_scripts/039-add-subtitle-to-testimonials.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/039-add-subtitle-to-testimonials.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

const DEFAULT_SUBTITLE =
  "Read unedited testimonials from our international community regarding their clinical care and recovery.";

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 039: Add subtitle to homepage.testimonials");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify table exists ──────────────────────────────────────────
    console.log("STEP 1: Checking components_homepage_testimonials table...");
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND   table_name   = 'components_homepage_testimonials'
      )
    `);
    if (!tableCheck.rows[0].exists) {
      throw new Error(
        "Table components_homepage_testimonials does not exist. Run Strapi first.",
      );
    }
    console.log("  [OK] Table exists\n");

    // ── STEP 2: Add subtitle column (idempotent) ─────────────────────────────
    console.log("STEP 2: Adding subtitle column...");
    const colCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND   table_name   = 'components_homepage_testimonials'
        AND   column_name  = 'subtitle'
      )
    `);

    if (colCheck.rows[0].exists) {
      console.log("  [SKIP] subtitle column already exists\n");
    } else {
      await client.query(`
        ALTER TABLE components_homepage_testimonials
        ADD COLUMN subtitle TEXT
      `);
      console.log("  [OK] Added subtitle column (TEXT, nullable)\n");
    }

    // ── STEP 3: Seed default subtitle on existing rows ───────────────────────
    console.log("STEP 3: Seeding default subtitle on existing rows...");
    const updated = await client.query(
      `
      UPDATE components_homepage_testimonials
      SET    subtitle = $1
      WHERE  subtitle IS NULL
      RETURNING id
    `,
      [DEFAULT_SUBTITLE],
    );
    console.log(`  [OK] Updated ${updated.rowCount} row(s)\n`);

    // ── STEP 4: Verify ───────────────────────────────────────────────────────
    console.log("STEP 4: Verifying...");
    const rows = await client.query(`
      SELECT id, title, subtitle
      FROM   components_homepage_testimonials
      ORDER  BY id
    `);
    rows.rows.forEach((r) =>
      console.log(
        `  Row ${r.id}: title="${r.title}" | subtitle="${r.subtitle?.slice(0, 60)}..."`,
      ),
    );

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 039 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up schema change");
    console.log(
      "  2. Edit subtitle in Strapi Admin → Homepage → Testimonials block\n",
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
