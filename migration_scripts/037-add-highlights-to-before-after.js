#!/usr/bin/env node

/**
 * Migration Script 037: Add highlights to homepage.before-after component
 *
 * Changes:
 *  1. Create components_homepage_before_after_highlights table
 *  2. Create components_homepage_before_afters_highlights_cmps link table
 *  3. Seed default highlights on all existing before-after component rows
 *
 * Run (dev):
 *   node migration_scripts/037-add-highlights-to-before-after.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/037-add-highlights-to-before-after.js
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
  console.log("MIGRATION 037: Add highlights to homepage.before-after");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify parent table exists ───────────────────────────────────
    console.log("STEP 1: Checking components_homepage_before_afters table...");
    const parentCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND   table_name   = 'components_homepage_before_afters'
      )
    `);
    if (!parentCheck.rows[0].exists) {
      throw new Error(
        "Table components_homepage_before_afters does not exist. " +
          "Run Strapi first to create the schema.",
      );
    }
    console.log("  [OK] Parent table exists\n");

    // ── STEP 2: Create highlight items table ─────────────────────────────────
    console.log(
      "STEP 2: Creating components_homepage_before_after_highlights table...",
    );
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_before_after_highlights (
        id   SERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL
      )
    `);
    console.log("  [OK] Table created (or already exists)\n");

    // ── STEP 3: Create link table (Strapi component-in-component pattern) ────
    console.log("STEP 3: Creating link table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_before_afters_highlights_cmps (
        id              SERIAL PRIMARY KEY,
        entity_id       INTEGER NOT NULL
                          REFERENCES components_homepage_before_afters(id)
                          ON DELETE CASCADE,
        cmp_id          INTEGER NOT NULL
                          REFERENCES components_homepage_before_after_highlights(id)
                          ON DELETE CASCADE,
        component_type  VARCHAR(255) NOT NULL DEFAULT 'homepage.before-after-highlight',
        field           VARCHAR(255) NOT NULL DEFAULT 'highlights',
        "order"         DOUBLE PRECISION
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS ba_highlights_cmps_entity_idx
        ON components_homepage_before_afters_highlights_cmps(entity_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS ba_highlights_cmps_cmp_idx
        ON components_homepage_before_afters_highlights_cmps(cmp_id)
    `);
    console.log("  [OK] Link table + indexes created (or already exist)\n");

    // ── STEP 4: Seed default highlights on existing rows ─────────────────────
    console.log(
      "STEP 4: Seeding default highlights on existing before-after rows...",
    );

    const existingRows = await client.query(`
      SELECT id FROM components_homepage_before_afters ORDER BY id
    `);

    if (existingRows.rows.length === 0) {
      console.log(
        "  [INFO] No existing before-after rows found — skipping seed\n",
      );
    } else {
      for (const row of existingRows.rows) {
        // Check if this row already has highlights
        const alreadySeeded = await client.query(
          `
          SELECT COUNT(*) AS cnt
          FROM   components_homepage_before_afters_highlights_cmps
          WHERE  entity_id = $1
        `,
          [row.id],
        );

        if (parseInt(alreadySeeded.rows[0].cnt) > 0) {
          console.log(`  [SKIP] Row ${row.id} already has highlights`);
          continue;
        }

        // Insert highlight items and link them
        for (let i = 0; i < DEFAULT_HIGHLIGHTS.length; i++) {
          const hlResult = await client.query(
            `
            INSERT INTO components_homepage_before_after_highlights (text)
            VALUES ($1)
            RETURNING id
          `,
            [DEFAULT_HIGHLIGHTS[i]],
          );

          await client.query(
            `
            INSERT INTO components_homepage_before_afters_highlights_cmps
              (entity_id, cmp_id, component_type, field, "order")
            VALUES ($1, $2, 'homepage.before-after-highlight', 'highlights', $3)
          `,
            [row.id, hlResult.rows[0].id, i + 1],
          );
        }

        console.log(
          `  [OK] Seeded ${DEFAULT_HIGHLIGHTS.length} highlights for row ${row.id}`,
        );
      }
    }

    // ── STEP 5: Verify ───────────────────────────────────────────────────────
    console.log("\nSTEP 5: Verifying...");
    const verify = await client.query(`
      SELECT
        ba.id   AS before_after_id,
        hl.text AS highlight,
        lnk."order"
      FROM   components_homepage_before_afters ba
      JOIN   components_homepage_before_afters_highlights_cmps lnk
               ON lnk.entity_id = ba.id
      JOIN   components_homepage_before_after_highlights hl
               ON hl.id = lnk.cmp_id
      ORDER  BY ba.id, lnk."order"
    `);

    verify.rows.forEach((r) => {
      console.log(
        `  before_after[${r.before_after_id}] #${r.order}: "${r.highlight}"`,
      );
    });

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 037 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up new component schema");
    console.log("  2. Update strapi-cms/types/generated/components.d.ts");
    console.log("  3. Update dental-frontend/src/types/strapi.ts");
    console.log("  4. Update dental-frontend/src/lib/api/queries.ts");
    console.log("  5. Update BeforeAfterSection.tsx to use CMS highlights");
    console.log(
      "  6. Edit highlights in Strapi Admin → Homepage → Before/After block\n",
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
