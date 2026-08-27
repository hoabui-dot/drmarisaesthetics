#!/usr/bin/env node

/**
 * Migration Script 051: Convert Philosophy Title to titleLines
 * 
 * This script:
 * 1. Reads the existing 'title' from the philosophy components.
 * 2. Splits the title into multiple lines (splitting by ": ").
 * 3. Inserts new records into 'components_homepage_title_lines'.
 * 4. Links these lines to the respective philosophy components in 'components_about_philosophies_cmps'.
 * 5. Renames the 'title' column to 'old_title' for archival.
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
  console.log("MIGRATION 051: Convert Philosophy Title to titleLines");
  console.log("=".repeat(70));
  console.log(`\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`);

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify prerequisites ──────────────────────────────────────
    console.log("STEP 1: Checking for 'title' column in 'components_about_philosophies'...");
    const tableInfo = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_about_philosophies' 
      AND column_name = 'title'
    `);

    if (tableInfo.rows.length === 0) {
      console.log("  [SKIP] 'title' column not found. Migration may have already run.\n");
      return;
    }
    console.log("  [OK] Found 'title' column.\n");

    // ── STEP 2: Fetch and migrate data ───────────────────────────────────
    console.log("STEP 2: Migrating titles to titleLines...");
    const philosophies = await client.query(`SELECT id, title FROM components_about_philosophies`);
    
    for (const record of philosophies.rows) {
      const { id, title } = record;
      if (!title) continue;

      console.log(`  Processing Philosophy ID ${id}: "${title}"`);

      // Split title by ": " if possible
      const lines = title.split(": ").map(l => l.trim()).filter(l => l.length > 0);

      for (let i = 0; i < lines.length; i++) {
        const lineText = lines[i];
        
        // 1. Insert line into components_homepage_title_lines
        const lineInsert = await client.query(
          `INSERT INTO components_homepage_title_lines (text) VALUES ($1) RETURNING id`,
          [lineText]
        );
        const lineId = lineInsert.rows[0].id;

        // 2. Link to philosophy in components_about_philosophies_cmps
        await client.query(
          `INSERT INTO components_about_philosophies_cmps 
           (entity_id, cmp_id, component_type, field, "order") 
           VALUES ($1, $2, $3, $4, $5)`,
          [id, lineId, 'homepage.title-line', 'titleLines', i + 1]
        );
        
        console.log(`    - Added line ${i + 1}: "${lineText}" (ID: ${lineId})`);
      }
    }
    console.log("  [OK] Data migration completed.\n");

    // ── STEP 3: Archival ──────────────────────────────────────────────
    console.log("STEP 3: Renaming 'title' column to 'old_title'...");
    await client.query(`
      ALTER TABLE components_about_philosophies 
      RENAME COLUMN title TO old_title
    `);
    console.log("  [OK] Column renamed.\n");

    console.log("=".repeat(70));
    console.log("MIGRATION 051 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up schema changes.");
    console.log("  2. Verify Philosophy titles in the CMS and on the frontend.\n");

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
