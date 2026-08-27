#!/usr/bin/env node

/**
 * Migration Script 098: Sync Draft Contact Page with Published Data
 *
 * Problem:
 *   - Draft record (ID 6) points to non-existent hero component (ID 6)
 *   - Published record (ID 66) has all correct data
 *   - Need to sync draft with published so CMS shows data
 *
 * Solution:
 *   - Copy published component links to draft
 *   - Ensure both draft and published point to same components
 *
 * Run:
 *   node migration_scripts/098-sync-draft-with-published-contact-page.js
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
  console.log("MIGRATION 098: Sync Draft Contact Page with Published Data");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    const documentId = "w6l20x2kkku0xljbzd074nz7";

    // ── STEP 1: Get draft and published records ──────────────────────────
    console.log("STEP 1: Finding draft and published records...");
    const records = await client.query(
      `
      SELECT id, document_id, published_at
      FROM contact_pages
      WHERE document_id = $1
      ORDER BY published_at NULLS FIRST
    `,
      [documentId],
    );

    if (records.rows.length !== 2) {
      throw new Error(`Expected 2 records, found ${records.rows.length}`);
    }

    const draftId = records.rows[0].id;
    const publishedId = records.rows[1].id;

    console.log(`  Draft ID: ${draftId}`);
    console.log(`  Published ID: ${publishedId}\n`);

    // ── STEP 2: Get published component links ────────────────────────────
    console.log("STEP 2: Getting published component links...");
    const publishedLinks = await client.query(
      `
      SELECT field, component_type, cmp_id, "order"
      FROM contact_pages_cmps
      WHERE entity_id = $1
      ORDER BY field
    `,
      [publishedId],
    );

    console.log(`  Found ${publishedLinks.rows.length} published links:`);
    publishedLinks.rows.forEach((link) => {
      console.log(
        `    - ${link.field}: ${link.component_type} (cmp_id: ${link.cmp_id})`,
      );
    });
    console.log();

    // ── STEP 3: Delete old draft links ───────────────────────────────────
    console.log("STEP 3: Deleting old draft links...");
    const deleteResult = await client.query(
      `
      DELETE FROM contact_pages_cmps
      WHERE entity_id = $1
      RETURNING field
    `,
      [draftId],
    );

    console.log(`  Deleted ${deleteResult.rows.length} old links\n`);

    // ── STEP 4: Copy published links to draft ────────────────────────────
    console.log("STEP 4: Copying published links to draft...");
    for (const link of publishedLinks.rows) {
      await client.query(
        `
        INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          draftId,
          link.cmp_id,
          link.component_type,
          link.field,
          link.order || 1,
        ],
      );
      console.log(`  ✓ Copied: ${link.field} → cmp_id ${link.cmp_id}`);
    }
    console.log();

    // ── STEP 5: Verify draft links ───────────────────────────────────────
    console.log("STEP 5: Verifying draft links...");
    const draftLinks = await client.query(
      `
      SELECT field, component_type, cmp_id
      FROM contact_pages_cmps
      WHERE entity_id = $1
      ORDER BY field
    `,
      [draftId],
    );

    console.log(`  Draft record now has ${draftLinks.rows.length} links:`);
    draftLinks.rows.forEach((link) => {
      console.log(
        `    - ${link.field}: ${link.component_type} (cmp_id: ${link.cmp_id})`,
      );
    });
    console.log();

    // ── STEP 6: Verify hero has contact_form ─────────────────────────────
    console.log("STEP 6: Verifying hero has contact_form...");
    const heroId = draftLinks.rows.find((l) => l.field === "hero")?.cmp_id;

    if (!heroId) {
      throw new Error("Hero component not found in draft links");
    }

    const heroForm = await client.query(
      `
      SELECT field, cmp_id
      FROM components_contact_heroes_cmps
      WHERE entity_id = $1 AND field = 'contact_form'
    `,
      [heroId],
    );

    if (heroForm.rows.length === 0) {
      console.log(`  ⚠️  WARNING: Hero ${heroId} has no contact_form linked`);
    } else {
      console.log(
        `  ✓ Hero ${heroId} has contact_form (cmp_id: ${heroForm.rows[0].cmp_id})`,
      );
    }
    console.log();

    console.log("=".repeat(70));
    console.log("MIGRATION 098 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Refresh Strapi admin panel");
    console.log("  2. Check Contact Page in Content Manager");
    console.log("  3. Verify all sections are visible");
    console.log("  4. Make any edits if needed");
    console.log("  5. Publish the changes\n");
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
