#!/usr/bin/env node

/**
 * Migration Script 055: Add titleLines to Published Certification
 *
 * Issue: Published homepage (id 161) uses certification component id 15
 * which has no titleLines linked, causing "Our Certifications" fallback
 *
 * Changes:
 *  1. Link titleLines to certification component id 15
 *
 * Run:
 *   node migration_scripts/055-add-titlelines-to-published-certification.js
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
  console.log("MIGRATION 055: Add titleLines to Published Certification");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify the issue ─────────────────────────────────────────
    console.log("STEP 1: Checking current state...");

    const publishedHomepage = await client.query(`
      SELECT id, document_id, published_at 
      FROM homepages 
      WHERE published_at IS NOT NULL
      ORDER BY id DESC
      LIMIT 1
    `);

    if (publishedHomepage.rows.length === 0) {
      throw new Error("No published homepage found!");
    }

    const homepageId = publishedHomepage.rows[0].id;
    console.log(`  Published homepage ID: ${homepageId}`);

    const certLink = await client.query(
      `
      SELECT cmp_id 
      FROM homepages_cmps 
      WHERE entity_id = $1 
      AND component_type = 'homepage.certification'
    `,
      [homepageId],
    );

    if (certLink.rows.length === 0) {
      throw new Error(
        "No certification component found in published homepage!",
      );
    }

    const certId = certLink.rows[0].cmp_id;
    console.log(`  Certification component ID: ${certId}`);

    const existingLines = await client.query(
      `
      SELECT link.cmp_id, tl.text
      FROM components_homepage_certifications_cmps link
      JOIN components_homepage_title_lines tl ON link.cmp_id = tl.id
      WHERE link.entity_id = $1
      AND link.component_type = 'homepage.title-line'
      ORDER BY link."order"
    `,
      [certId],
    );

    console.log(`  Existing titleLines: ${existingLines.rows.length}`);
    if (existingLines.rows.length > 0) {
      console.log("  [INFO] titleLines already exist:");
      existingLines.rows.forEach((row) => {
        console.log(`    - "${row.text}"`);
      });
      console.log("\n  No migration needed!");
      return;
    }

    // ── STEP 2: Get titleLines to copy ───────────────────────────────────
    console.log("\nSTEP 2: Getting titleLines to copy...");

    const sourceLines = await client.query(`
      SELECT tl.id, tl.text
      FROM components_homepage_title_lines tl
      WHERE tl.text IN ('International Standards', '& Certifications')
      ORDER BY 
        CASE 
          WHEN tl.text = 'International Standards' THEN 1
          WHEN tl.text = '& Certifications' THEN 2
        END
    `);

    if (sourceLines.rows.length !== 2) {
      throw new Error(
        `Expected 2 titleLines, found ${sourceLines.rows.length}`,
      );
    }

    console.log("  Found titleLines:");
    sourceLines.rows.forEach((row, idx) => {
      console.log(`    ${idx + 1}. ID ${row.id}: "${row.text}"`);
    });

    // ── STEP 3: Link titleLines to certification ─────────────────────────
    console.log("\nSTEP 3: Linking titleLines to certification...");

    for (let i = 0; i < sourceLines.rows.length; i++) {
      const line = sourceLines.rows[i];
      await client.query(
        `
        INSERT INTO components_homepage_certifications_cmps
        (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, 'homepage.title-line', 'titleLines', $3)
      `,
        [certId, line.id, i + 1],
      );
      console.log(`  [OK] Linked line ${i + 1}: "${line.text}"`);
    }

    // ── STEP 4: Verify results ───────────────────────────────────────────
    console.log("\nSTEP 4: Verifying results...");

    const verifyLines = await client.query(
      `
      SELECT link."order", tl.text
      FROM components_homepage_certifications_cmps link
      JOIN components_homepage_title_lines tl ON link.cmp_id = tl.id
      WHERE link.entity_id = $1
      AND link.component_type = 'homepage.title-line'
      ORDER BY link."order"
    `,
      [certId],
    );

    console.log(`  Final titleLines (${verifyLines.rows.length}):`);
    verifyLines.rows.forEach((row) => {
      console.log(`    - Order ${row.order}: "${row.text}"`);
    });

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 055 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Clear Next.js cache: rm -rf dental-frontend/.next");
    console.log("  2. Rebuild frontend: cd dental-frontend && npm run build");
    console.log("  3. Test homepage - titleLines should display correctly\n");
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
