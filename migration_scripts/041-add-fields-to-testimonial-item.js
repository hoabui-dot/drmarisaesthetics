#!/usr/bin/env node

/**
 * Migration Script 041: Add nationality, treatment, result_link to testimonial-item
 *
 * Changes:
 *  1. ADD COLUMN nationality VARCHAR(255) — e.g. "🇺🇸 USA"
 *  2. ADD COLUMN treatment  VARCHAR(255) — e.g. "Invisalign patient"
 *  3. ADD COLUMN result_link VARCHAR(255) — e.g. "/before-after#case-1"
 *  4. Seed sample values on existing rows
 *
 * Run (dev):
 *   node migration_scripts/041-add-fields-to-testimonial-item.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/041-add-fields-to-testimonial-item.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

// Sample seed data cycling by row index
const SEED_NATIONALITIES = [
  "🇺🇸 USA",
  "🇬🇧 UK",
  "🇦🇺 Australia",
  "🇨🇦 Canada",
  "🇩🇪 Germany",
  "🇫🇷 France",
  "🇸🇬 Singapore",
  "🇯🇵 Japan",
];
const SEED_TREATMENTS = [
  "Invisalign patient",
  "Dental Implant patient",
  "Teeth Whitening patient",
  "Veneers patient",
  "Full Smile Makeover patient",
  "Braces patient",
];

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log(
    "MIGRATION 041: Add nationality, treatment, result_link to testimonial-item",
  );
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify table ─────────────────────────────────────────────────
    console.log(
      "STEP 1: Checking components_homepage_testimonial_items table...",
    );
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND   table_name   = 'components_homepage_testimonial_items'
      )
    `);
    if (!tableCheck.rows[0].exists) {
      throw new Error(
        "Table components_homepage_testimonial_items does not exist. Run Strapi first.",
      );
    }
    console.log("  [OK] Table exists\n");

    // ── STEP 2: Add columns (idempotent) ─────────────────────────────────────
    const columns = [
      { name: "nationality", type: "VARCHAR(255)" },
      { name: "treatment", type: "VARCHAR(255)" },
      { name: "result_link", type: "VARCHAR(255)" },
    ];

    console.log("STEP 2: Adding columns...");
    for (const col of columns) {
      const exists = await client.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.columns
          WHERE table_schema = 'public'
          AND   table_name   = 'components_homepage_testimonial_items'
          AND   column_name  = $1
        )
      `,
        [col.name],
      );

      if (exists.rows[0].exists) {
        console.log(`  [SKIP] ${col.name} already exists`);
      } else {
        await client.query(`
          ALTER TABLE components_homepage_testimonial_items
          ADD COLUMN ${col.name} ${col.type}
        `);
        console.log(`  [OK] Added ${col.name} (${col.type})`);
      }
    }
    console.log();

    // ── STEP 3: Seed sample values on existing rows ──────────────────────────
    console.log("STEP 3: Seeding sample values on existing rows...");
    const rows = await client.query(`
      SELECT id FROM components_homepage_testimonial_items
      WHERE nationality IS NULL
      ORDER BY id
    `);

    for (let i = 0; i < rows.rows.length; i++) {
      const id = rows.rows[i].id;
      const nationality = SEED_NATIONALITIES[i % SEED_NATIONALITIES.length];
      const treatment = SEED_TREATMENTS[i % SEED_TREATMENTS.length];
      const resultLink = "/#before-after";

      await client.query(
        `
        UPDATE components_homepage_testimonial_items
        SET nationality = $1, treatment = $2, result_link = $3
        WHERE id = $4
      `,
        [nationality, treatment, resultLink, id],
      );

      console.log(`  [OK] Row ${id}: ${nationality} | ${treatment}`);
    }
    console.log();

    // ── STEP 4: Verify ───────────────────────────────────────────────────────
    console.log("STEP 4: Verifying...");
    const verify = await client.query(`
      SELECT id, name, nationality, treatment, result_link
      FROM   components_homepage_testimonial_items
      ORDER  BY id
      LIMIT  6
    `);
    verify.rows.forEach((r) =>
      console.log(`  [${r.id}] ${r.name} | ${r.nationality} | ${r.treatment}`),
    );

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 041 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up schema changes");
    console.log(
      "  2. Edit nationality/treatment/result_link per testimonial in Strapi Admin\n",
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
