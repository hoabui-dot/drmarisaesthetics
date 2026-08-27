#!/usr/bin/env node

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
  console.log("MIGRATION 101: Add CTA to Homepage");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    const documentId = "lz78tguouxtpwkdt69hummo6";

    // ── STEP 1: Get draft and published homepage IDs ─────────────────────
    console.log("STEP 1: Finding homepage records...");
    const homepages = await client.query(
      `
      SELECT id, published_at
      FROM homepages
      WHERE document_id = $1
      ORDER BY published_at NULLS FIRST
    `,
      [documentId],
    );

    if (homepages.rows.length !== 2) {
      throw new Error(
        `Expected 2 homepage records, found ${homepages.rows.length}`,
      );
    }

    const draftId = homepages.rows[0].id;
    const publishedId = homepages.rows[1].id;

    console.log(`  Draft ID: ${draftId}`);
    console.log(`  Published ID: ${publishedId}\n`);

    // ── STEP 2: Check if CTA component exists ────────────────────────────
    console.log("STEP 2: Checking for existing CTA component...");
    const existingCta = await client.query(`
      SELECT id, heading, button_label
      FROM components_homepage_ctas
      ORDER BY id DESC
      LIMIT 1
    `);

    let ctaId;
    if (existingCta.rows.length > 0) {
      ctaId = existingCta.rows[0].id;
      console.log(
        `  Found existing CTA (ID: ${ctaId}): ${existingCta.rows[0].heading}`,
      );
    } else {
      console.log("  No CTA found, creating new one...");
      const newCta = await client.query(`
        INSERT INTO components_homepage_ctas (
          heading,
          highlight_text,
          button_label,
          button_link
        ) VALUES (
          'Schedule Your Clinical Evaluation',
          'Request an Appointment',
          'Request an Appointment',
          '/contact'
        )
        RETURNING id
      `);
      ctaId = newCta.rows[0].id;
      console.log(`  Created new CTA (ID: ${ctaId})`);
    }
    console.log();

    // ── STEP 3: Add CTA to draft homepage ────────────────────────────────
    console.log("STEP 3: Adding CTA to draft homepage...");
    const draftCheck = await client.query(
      `
      SELECT * FROM homepages_cmps
      WHERE entity_id = $1 AND component_type = 'homepage.cta'
    `,
      [draftId],
    );

    if (draftCheck.rows.length > 0) {
      console.log("  CTA already linked to draft");
    } else {
      await client.query(
        `
        INSERT INTO homepages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, 'homepage.cta', 'layout', 100)
      `,
        [draftId, ctaId],
      );
      console.log("  ✓ Added CTA to draft");
    }
    console.log();

    // ── STEP 4: Add CTA to published homepage ────────────────────────────
    console.log("STEP 4: Adding CTA to published homepage...");
    const publishedCheck = await client.query(
      `
      SELECT * FROM homepages_cmps
      WHERE entity_id = $1 AND component_type = 'homepage.cta'
    `,
      [publishedId],
    );

    if (publishedCheck.rows.length > 0) {
      console.log("  CTA already linked to published");
    } else {
      await client.query(
        `
        INSERT INTO homepages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, 'homepage.cta', 'layout', 100)
      `,
        [publishedId, ctaId],
      );
      console.log("  ✓ Added CTA to published");
    }
    console.log();

    // ── STEP 5: Verify ────────────────────────────────────────────────────
    console.log("STEP 5: Verifying homepage layout...");
    const layoutComponents = await client.query(
      `
      SELECT component_type, COUNT(*) as count
      FROM homepages_cmps
      WHERE entity_id = $1
      GROUP BY component_type
      ORDER BY component_type
    `,
      [publishedId],
    );

    console.log("  Published homepage components:");
    layoutComponents.rows.forEach((row) => {
      console.log(`    - ${row.component_type}: ${row.count}`);
    });
    console.log();

    console.log("=".repeat(70));
    console.log("MIGRATION 101 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi (if needed)");
    console.log("  2. Check homepage at http://localhost:3000");
    console.log("  3. Verify CTA section appears\n");
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
