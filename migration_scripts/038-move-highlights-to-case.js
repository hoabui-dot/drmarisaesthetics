#!/usr/bin/env node

/**
 * Migration Script 038: Move highlights from before-after section → before-after case
 *
 * Reverts 037 (section-level highlights) and adds highlights as a repeatable
 * component inside each individual before-after-case instead.
 *
 * Changes:
 *  1. DROP link table: components_homepage_before_afters_highlights_cmps
 *  2. DROP highlight items table: components_homepage_before_after_highlights
 *     (re-created fresh — same schema, different owner)
 *  3. CREATE new link table: components_homepage_before_after_cases_highlights_cmps
 *  4. Seed default highlights on all existing before-after-case rows
 *
 * Run (dev):
 *   node migration_scripts/038-move-highlights-to-case.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/038-move-highlights-to-case.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

const DEFAULT_HIGHLIGHTS = ["Straighter teeth", "Whiter smile", "Natural look"];

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 038: Move highlights from section → case");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Drop old section-level link table ─────────────────────────────
    console.log("STEP 1: Dropping old section-level link table...");
    await client.query(`
      DROP TABLE IF EXISTS components_homepage_before_afters_highlights_cmps CASCADE
    `);
    console.log(
      "  [OK] Dropped components_homepage_before_afters_highlights_cmps\n",
    );

    // ── STEP 2: Drop + recreate highlight items table (clean slate) ───────────
    console.log("STEP 2: Recreating highlight items table...");
    await client.query(`
      DROP TABLE IF EXISTS components_homepage_before_after_highlights CASCADE
    `);
    await client.query(`
      CREATE TABLE components_homepage_before_after_highlights (
        id   SERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL
      )
    `);
    console.log(
      "  [OK] Recreated components_homepage_before_after_highlights\n",
    );

    // ── STEP 3: Create case-level link table ──────────────────────────────────
    console.log("STEP 3: Creating case-level link table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_before_after_cases_highlights_cmps (
        id              SERIAL PRIMARY KEY,
        entity_id       INTEGER NOT NULL
                          REFERENCES components_homepage_before_after_cases(id)
                          ON DELETE CASCADE,
        cmp_id          INTEGER NOT NULL
                          REFERENCES components_homepage_before_after_highlights(id)
                          ON DELETE CASCADE,
        component_type  VARCHAR(255) NOT NULL
                          DEFAULT 'homepage.before-after-highlight',
        field           VARCHAR(255) NOT NULL DEFAULT 'highlights',
        "order"         DOUBLE PRECISION
      )
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS ba_case_highlights_entity_idx
        ON components_homepage_before_after_cases_highlights_cmps(entity_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS ba_case_highlights_cmp_idx
        ON components_homepage_before_after_cases_highlights_cmps(cmp_id)
    `);
    console.log(
      "  [OK] Created components_homepage_before_after_cases_highlights_cmps\n",
    );

    // ── STEP 4: Seed default highlights on every existing case row ────────────
    console.log("STEP 4: Seeding default highlights on existing case rows...");

    const caseRows = await client.query(`
      SELECT id FROM components_homepage_before_after_cases ORDER BY id
    `);

    if (caseRows.rows.length === 0) {
      console.log("  [INFO] No existing case rows found — skipping seed\n");
    } else {
      for (const row of caseRows.rows) {
        // Idempotency check
        const already = await client.query(
          `
          SELECT COUNT(*) AS cnt
          FROM   components_homepage_before_after_cases_highlights_cmps
          WHERE  entity_id = $1
        `,
          [row.id],
        );

        if (parseInt(already.rows[0].cnt) > 0) {
          console.log(`  [SKIP] Case ${row.id} already has highlights`);
          continue;
        }

        for (let i = 0; i < DEFAULT_HIGHLIGHTS.length; i++) {
          const hl = await client.query(
            `
            INSERT INTO components_homepage_before_after_highlights (text)
            VALUES ($1) RETURNING id
          `,
            [DEFAULT_HIGHLIGHTS[i]],
          );

          await client.query(
            `
            INSERT INTO components_homepage_before_after_cases_highlights_cmps
              (entity_id, cmp_id, component_type, field, "order")
            VALUES ($1, $2, 'homepage.before-after-highlight', 'highlights', $3)
          `,
            [row.id, hl.rows[0].id, i + 1],
          );
        }

        console.log(
          `  [OK] Seeded ${DEFAULT_HIGHLIGHTS.length} highlights for case ${row.id}`,
        );
      }
    }

    // ── STEP 5: Verify ────────────────────────────────────────────────────────
    console.log("\nSTEP 5: Verifying...");
    const verify = await client.query(`
      SELECT
        c.id   AS case_id,
        hl.text,
        lnk."order"
      FROM   components_homepage_before_after_cases c
      JOIN   components_homepage_before_after_cases_highlights_cmps lnk
               ON lnk.entity_id = c.id
      JOIN   components_homepage_before_after_highlights hl
               ON hl.id = lnk.cmp_id
      ORDER  BY c.id, lnk."order"
    `);

    verify.rows.forEach((r) =>
      console.log(`  case[${r.case_id}] #${r.order}: "${r.text}"`),
    );

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 038 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up updated component schemas");
    console.log(
      "  2. Edit highlights per case in Strapi Admin → Homepage → Before/After\n",
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
