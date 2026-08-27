#!/usr/bin/env node

/**
 * Migration Script 054: Fix Certification titleLines
 *
 * Issue: Wrong titleLines are linked to certification section
 * - Current: "International Standards & Certifications" + "& Certifications"
 * - Expected: "International Standards" + "& Certifications"
 *
 * Changes:
 *  1. Delete wrong titleLines from components_homepage_certifications_cmps
 *  2. Update titleLines to match Strapi CMS data
 *  3. Drop unused components_homepage_certifications_title_lines_cmps table
 *
 * Run:
 *   node migration_scripts/054-fix-certification-titlelines.js
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
  console.log("MIGRATION 054: Fix Certification titleLines");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check current state ──────────────────────────────────────
    console.log("STEP 1: Checking current titleLines...");
    const currentLines = await client.query(`
      SELECT link.id, link.entity_id, link.cmp_id, link."order", tl.text
      FROM components_homepage_certifications_cmps link
      JOIN components_homepage_title_lines tl ON link.cmp_id = tl.id
      WHERE link.component_type = 'homepage.title-line'
      AND link.field = 'titleLines'
      ORDER BY link.entity_id, link."order"
    `);

    console.log(`  Found ${currentLines.rows.length} titleLines:`);
    currentLines.rows.forEach((row) => {
      console.log(
        `    - ID ${row.cmp_id}: "${row.text}" (link_id: ${row.id}, order: ${row.order})`,
      );
    });

    // ── STEP 2: Delete wrong titleLines ──────────────────────────────────
    console.log("\nSTEP 2: Deleting wrong titleLines from link table...");
    const deleteResult = await client.query(`
      DELETE FROM components_homepage_certifications_cmps
      WHERE component_type = 'homepage.title-line'
      AND field = 'titleLines'
      RETURNING id, cmp_id
    `);
    console.log(`  [OK] Deleted ${deleteResult.rows.length} links`);

    // ── STEP 3: Update/Create correct titleLines ─────────────────────────
    console.log("\nSTEP 3: Creating correct titleLines...");

    // Check if correct titleLines exist
    const line1Check = await client.query(`
      SELECT id FROM components_homepage_title_lines
      WHERE text = 'International Standards'
    `);

    const line2Check = await client.query(`
      SELECT id FROM components_homepage_title_lines
      WHERE text = '& Certifications'
    `);

    let line1Id, line2Id;

    if (line1Check.rows.length > 0) {
      line1Id = line1Check.rows[0].id;
      console.log(`  Found existing line 1: ID ${line1Id}`);
    } else {
      const result = await client.query(`
        INSERT INTO components_homepage_title_lines (text)
        VALUES ('International Standards')
        RETURNING id
      `);
      line1Id = result.rows[0].id;
      console.log(`  Created line 1: ID ${line1Id}`);
    }

    if (line2Check.rows.length > 0) {
      line2Id = line2Check.rows[0].id;
      console.log(`  Found existing line 2: ID ${line2Id}`);
    } else {
      const result = await client.query(`
        INSERT INTO components_homepage_title_lines (text)
        VALUES ('& Certifications')
        RETURNING id
      `);
      line2Id = result.rows[0].id;
      console.log(`  Created line 2: ID ${line2Id}`);
    }

    // ── STEP 4: Link correct titleLines ──────────────────────────────────
    console.log("\nSTEP 4: Linking correct titleLines to certification...");

    // Get certification entity_id (should be 1 for published)
    const certResult = await client.query(`
      SELECT id FROM components_homepage_certifications
      ORDER BY id
      LIMIT 1
    `);

    if (certResult.rows.length === 0) {
      throw new Error("No certification component found!");
    }

    const entityId = certResult.rows[0].id;
    console.log(`  Using certification entity_id: ${entityId}`);

    // Link line 1
    await client.query(
      `
      INSERT INTO components_homepage_certifications_cmps
      (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, 'homepage.title-line', 'titleLines', 1)
    `,
      [entityId, line1Id],
    );
    console.log(`  [OK] Linked line 1`);

    // Link line 2
    await client.query(
      `
      INSERT INTO components_homepage_certifications_cmps
      (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, 'homepage.title-line', 'titleLines', 2)
    `,
      [entityId, line2Id],
    );
    console.log(`  [OK] Linked line 2`);

    // ── STEP 5: Drop unused table ────────────────────────────────────────
    console.log("\nSTEP 5: Dropping unused link table...");
    await client.query(`
      DROP TABLE IF EXISTS components_homepage_certifications_title_lines_cmps CASCADE
    `);
    console.log(
      "  [OK] Dropped components_homepage_certifications_title_lines_cmps",
    );

    // ── STEP 6: Clean up duplicate/unused titleLines ─────────────────────
    console.log("\nSTEP 6: Cleaning up unused titleLines...");
    const cleanupResult = await client.query(`
      DELETE FROM components_homepage_title_lines
      WHERE id NOT IN (
        SELECT DISTINCT cmp_id 
        FROM components_homepage_certifications_cmps 
        WHERE component_type = 'homepage.title-line'
        UNION
        SELECT DISTINCT cmp_id 
        FROM components_homepage_video_heroes_cmps 
        WHERE component_type = 'homepage.title-line'
      )
      RETURNING id, text
    `);
    console.log(
      `  [OK] Deleted ${cleanupResult.rows.length} unused titleLines:`,
    );
    cleanupResult.rows.forEach((row) => {
      console.log(`    - ID ${row.id}: "${row.text}"`);
    });

    // ── STEP 7: Verify results ───────────────────────────────────────────
    console.log("\nSTEP 7: Verifying results...");
    const verifyLines = await client.query(`
      SELECT link.entity_id, link.cmp_id, link."order", tl.text
      FROM components_homepage_certifications_cmps link
      JOIN components_homepage_title_lines tl ON link.cmp_id = tl.id
      WHERE link.component_type = 'homepage.title-line'
      AND link.field = 'titleLines'
      ORDER BY link.entity_id, link."order"
    `);

    console.log(`  Final titleLines (${verifyLines.rows.length}):`);
    verifyLines.rows.forEach((row) => {
      console.log(`    - Order ${row.order}: "${row.text}"`);
    });

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 054 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi (if running)");
    console.log("  2. Test in Strapi CMS - titleLines should show correctly");
    console.log("  3. Test frontend - should display 2 lines correctly\n");
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
