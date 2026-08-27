#!/usr/bin/env node

/**
 * Migration Script 045: Add logo field to Footer
 *
 * Adds logo field (media upload) to Footer table.
 * The schema.json already has the logo field defined, this script adds it to the database.
 *
 * Run (dev):
 *   node migration_scripts/045-add-logo-to-footer.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/045-add-logo-to-footer.js
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
  console.log("MIGRATION 045: Add logo field to Footer");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify footers table ─────────────────────────────────────────
    console.log("STEP 1: Checking footers table...");
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND   table_name   = 'footers'
      )
    `);
    if (!tableCheck.rows[0].exists) {
      throw new Error("Table footers does not exist. Run Strapi first.");
    }
    console.log("  [OK] Table exists\n");

    // ── STEP 2: Add logo field if not exists ─────────────────────────────────
    console.log("STEP 2: Adding logo field...");
    const logoCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND   table_name   = 'footers'
        AND   column_name  = 'logo'
      )
    `);

    if (logoCheck.rows[0].exists) {
      console.log("  [SKIP] logo field already exists\n");
    } else {
      await client.query(`
        ALTER TABLE footers ADD COLUMN logo INTEGER REFERENCES files(id) ON DELETE SET NULL
      `);
      console.log("  [OK] Added logo field (references files table)\n");
    }

    // ── STEP 3: Check current footer data ────────────────────────────────────
    console.log("STEP 3: Checking current footer data...");
    const footerData = await client.query(`
      SELECT id, description, logo
      FROM footers
      ORDER BY id
      LIMIT 1
    `);

    if (footerData.rows.length === 0) {
      console.log("  [INFO] No footer data found yet\n");
    } else {
      const footer = footerData.rows[0];
      console.log(`  [OK] Footer ID: ${footer.id}`);
      console.log(
        `  [OK] Description: ${footer.description?.substring(0, 50)}...`,
      );
      console.log(
        `  [OK] Logo: ${footer.logo || "Not set (upload in Strapi Admin)"}\n`,
      );
    }

    // ── STEP 4: Verify link tables ───────────────────────────────────────────
    console.log("STEP 4: Verifying footer link tables...");

    const linkTables = [
      "footers_cmps",
      "components_footer_contact_infos",
      "components_footer_links",
      "components_footer_social_links",
    ];

    for (const table of linkTables) {
      const exists = await client.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND   table_name   = $1
        )
      `,
        [table],
      );

      if (exists.rows[0].exists) {
        const count = await client.query(
          `SELECT COUNT(*) as cnt FROM ${table}`,
        );
        console.log(`  [OK] ${table}: ${count.rows[0].cnt} rows`);
      } else {
        console.log(`  [INFO] ${table}: Not created yet`);
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 045 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to ensure schema is applied");
    console.log("  2. Upload logo image in Strapi Admin → Footer → Logo");
    console.log("  3. Frontend will automatically use the uploaded logo");
    console.log(
      "  4. Typography improvements are already applied in Footer component\n",
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
