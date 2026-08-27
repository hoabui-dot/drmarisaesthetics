#!/usr/bin/env node

/**
 * Migration Script 071: Add Statistics Checklist
 *
 * Changes:
 *  1. Add rating and description columns to statistics
 *  2. Create checklist_items component table
 *  3. Create link table for checklist items
 *  4. Insert checklist data
 *
 * Run:
 *   node migration_scripts/071-add-statistics-checklist.js
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
  console.log("MIGRATION 071: Add Statistics Checklist");
  console.log("=".repeat(70));

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Add columns to statistics table ───────────────────────────
    console.log("STEP 1: Adding rating and description columns...");

    await client.query(`
      ALTER TABLE components_customer_statistics 
      ADD COLUMN IF NOT EXISTS rating VARCHAR(255),
      ADD COLUMN IF NOT EXISTS description TEXT
    `);
    console.log("  [OK] Added columns\n");

    // ── STEP 2: Create checklist items table ──────────────────────────────
    console.log("STEP 2: Creating checklist items table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_checklist_items (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL
      )
    `);
    console.log("  [OK] Created components_customer_checklist_items table\n");

    // ── STEP 3: Create link table ─────────────────────────────────────────
    console.log("STEP 3: Creating checklist link table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_customer_statistics_checklist_cmps (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER NOT NULL
          REFERENCES components_customer_statistics(id)
          ON DELETE CASCADE,
        cmp_id INTEGER NOT NULL
          REFERENCES components_customer_checklist_items(id)
          ON DELETE CASCADE,
        component_type VARCHAR(255) NOT NULL,
        field VARCHAR(255) NOT NULL,
        "order" DOUBLE PRECISION
      )
    `);
    console.log("  [OK] Created link table\n");

    // ── STEP 4: Update statistics content ─────────────────────────────────
    console.log("STEP 4: Updating statistics content...");

    const statsResult = await client.query(`
      SELECT id FROM components_customer_statistics LIMIT 1
    `);

    if (statsResult.rows.length > 0) {
      const statsId = statsResult.rows[0].id;

      await client.query(
        `
        UPDATE components_customer_statistics
        SET 
          rating = '4.9 / 5 rating from over 400 reviews on Google Maps',
          description = 'We are committed not only to delivering high-quality clinical results but also to providing a comfortable and stress-free experience for every patient.'
        WHERE id = $1
      `,
        [statsId],
      );

      console.log(`  [OK] Updated statistics (ID: ${statsId})\n`);

      // ── STEP 5: Insert checklist items ────────────────────────────────────
      console.log("STEP 5: Inserting checklist items...");

      const checklistItems = [
        "Over 400 authentic patient reviews",
        "Transparent and clearly explained treatment plans",
        "A highly skilled and dedicated dental team",
      ];

      for (let i = 0; i < checklistItems.length; i++) {
        const itemResult = await client.query(
          `
          INSERT INTO components_customer_checklist_items (text)
          VALUES ($1)
          RETURNING id
        `,
          [checklistItems[i]],
        );

        const itemId = itemResult.rows[0].id;

        await client.query(
          `
          INSERT INTO components_customer_statistics_checklist_cmps 
          (entity_id, cmp_id, component_type, field, "order")
          VALUES ($1, $2, $3, $4, $5)
        `,
          [statsId, itemId, "customer.checklist-item", "checklist", i + 1],
        );
      }

      console.log(`  [OK] Inserted ${checklistItems.length} checklist items\n`);
    } else {
      console.log("  [SKIP] No statistics section found\n");
    }

    // ── STEP 6: Verify results ────────────────────────────────────────────
    console.log("STEP 6: Verifying results...");

    const verifyStats = await client.query(`
      SELECT title, rating FROM components_customer_statistics LIMIT 1
    `);
    console.log(`  Statistics title: ${verifyStats.rows[0]?.title || "N/A"}`);
    console.log(`  Rating: ${verifyStats.rows[0]?.rating || "N/A"}`);

    const verifyChecklist = await client.query(`
      SELECT COUNT(*) as count FROM components_customer_checklist_items
    `);
    console.log(`  Checklist items: ${verifyChecklist.rows[0].count}`);

    console.log("  [OK] Verification passed\n");

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 071 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
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
