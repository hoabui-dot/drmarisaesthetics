#!/usr/bin/env node

/**
 * Migration Script 044: Add editable content fields to homepage.cta
 *
 * Makes all hardcoded content in CTA block editable through Strapi:
 *  1. urgency_badge_text - "Only 5 free consultation slots left this week"
 *  2. title_line1 - "Start Your Smile"
 *  3. title_line2 - "Transformation Today"
 *  4. subtitle - "Join thousands of satisfied patients..."
 *  5. badge_label - "Transformation"
 *  6. badge_value - "In Just 2 Weeks"
 *  7. trust_items - Repeatable component for trust indicators
 *
 * New table:
 *  - CREATE components_homepage_cta_trust_items (icon, label)
 *  - CREATE link table: components_homepage_ctas_trust_items_cmps
 *  - Seed default values on existing CTA rows
 *
 * Run (dev):
 *   node migration_scripts/044-add-editable-fields-to-cta.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/044-add-editable-fields-to-cta.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

const DEFAULT_URGENCY_BADGE = "Only 5 free consultation slots left this week";
const DEFAULT_TITLE_LINE1 = "Start Your Smile";
const DEFAULT_TITLE_LINE2 = "Transformation Today";
const DEFAULT_SUBTITLE =
  "Join thousands of satisfied patients. Book your free consultation and discover the smile you've always dreamed of.";
const DEFAULT_BADGE_LABEL = "Transformation";
const DEFAULT_BADGE_VALUE = "In Just 2 Weeks";

const DEFAULT_TRUST_ITEMS = [
  { icon: "sparkles", label: "Free Consultation" },
  { icon: "sparkles", label: "No Obligation" },
  { icon: "sparkles", label: "Insurance Accepted" },
];

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 044: Add editable content fields to homepage.cta");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify parent table ──────────────────────────────────────────
    console.log("STEP 1: Checking components_homepage_ctas table...");
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND   table_name   = 'components_homepage_ctas'
      )
    `);
    if (!tableCheck.rows[0].exists) {
      throw new Error(
        "Table components_homepage_ctas does not exist. Run Strapi first.",
      );
    }
    console.log("  [OK] Table exists\n");

    // ── STEP 2: Add text content columns ─────────────────────────────────────
    console.log("STEP 2: Adding text content columns...");
    const columns = [
      { name: "urgency_badge_text", type: "VARCHAR(255)" },
      { name: "title_line1", type: "VARCHAR(255)" },
      { name: "title_line2", type: "VARCHAR(255)" },
      { name: "subtitle", type: "TEXT" },
      { name: "badge_label", type: "VARCHAR(100)" },
      { name: "badge_value", type: "VARCHAR(100)" },
    ];

    for (const col of columns) {
      const exists = await client.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.columns
          WHERE table_schema = 'public'
          AND   table_name   = 'components_homepage_ctas'
          AND   column_name  = $1
        )
      `,
        [col.name],
      );
      if (exists.rows[0].exists) {
        console.log(`  [SKIP] ${col.name} already exists`);
      } else {
        await client.query(
          `ALTER TABLE components_homepage_ctas ADD COLUMN ${col.name} ${col.type}`,
        );
        console.log(`  [OK] Added ${col.name}`);
      }
    }
    console.log();

    // ── STEP 3: Create trust items table ─────────────────────────────────────
    console.log(
      "STEP 3: Creating components_homepage_cta_trust_items table...",
    );
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_cta_trust_items (
        id    SERIAL PRIMARY KEY,
        icon  VARCHAR(50),
        label VARCHAR(255) NOT NULL
      )
    `);
    console.log("  [OK] Created (or already exists)\n");

    // ── STEP 4: Create link table ────────────────────────────────────────────
    console.log("STEP 4: Creating link table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_ctas_trust_items_cmps (
        id             SERIAL PRIMARY KEY,
        entity_id      INTEGER NOT NULL
                         REFERENCES components_homepage_ctas(id)
                         ON DELETE CASCADE,
        cmp_id         INTEGER NOT NULL
                         REFERENCES components_homepage_cta_trust_items(id)
                         ON DELETE CASCADE,
        component_type VARCHAR(255) NOT NULL DEFAULT 'homepage.cta-trust-item',
        field          VARCHAR(255) NOT NULL DEFAULT 'trust_items',
        "order"        DOUBLE PRECISION
      )
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS cta_trust_items_entity_idx
        ON components_homepage_ctas_trust_items_cmps(entity_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS cta_trust_items_cmp_idx
        ON components_homepage_ctas_trust_items_cmps(cmp_id)
    `);
    console.log("  [OK] Created (or already exists)\n");

    // ── STEP 5: Seed existing CTA rows ───────────────────────────────────────
    console.log("STEP 5: Seeding existing CTA rows...");
    const ctaRows = await client.query(`
      SELECT id FROM components_homepage_ctas ORDER BY id
    `);

    for (const row of ctaRows.rows) {
      const ctaId = row.id;

      // Seed text content (idempotent)
      await client.query(
        `
        UPDATE components_homepage_ctas
        SET urgency_badge_text = $1,
            title_line1 = $2,
            title_line2 = $3,
            subtitle = $4,
            badge_label = $5,
            badge_value = $6
        WHERE id = $7 AND urgency_badge_text IS NULL
      `,
        [
          DEFAULT_URGENCY_BADGE,
          DEFAULT_TITLE_LINE1,
          DEFAULT_TITLE_LINE2,
          DEFAULT_SUBTITLE,
          DEFAULT_BADGE_LABEL,
          DEFAULT_BADGE_VALUE,
          ctaId,
        ],
      );

      // Seed trust items (idempotent)
      const already = await client.query(
        `
        SELECT COUNT(*) AS cnt
        FROM   components_homepage_ctas_trust_items_cmps
        WHERE  entity_id = $1
      `,
        [ctaId],
      );

      if (parseInt(already.rows[0].cnt) > 0) {
        console.log(`  [SKIP] CTA ${ctaId} already has trust items`);
        continue;
      }

      for (let i = 0; i < DEFAULT_TRUST_ITEMS.length; i++) {
        const ti = DEFAULT_TRUST_ITEMS[i];
        const res = await client.query(
          `
          INSERT INTO components_homepage_cta_trust_items (icon, label)
          VALUES ($1, $2) RETURNING id
        `,
          [ti.icon, ti.label],
        );

        await client.query(
          `
          INSERT INTO components_homepage_ctas_trust_items_cmps
            (entity_id, cmp_id, component_type, field, "order")
          VALUES ($1, $2, 'homepage.cta-trust-item', 'trust_items', $3)
        `,
          [ctaId, res.rows[0].id, i + 1],
        );
      }
      console.log(
        `  [OK] Seeded CTA ${ctaId}: Text content + ${DEFAULT_TRUST_ITEMS.length} trust items`,
      );
    }

    // ── STEP 6: Verify ────────────────────────────────────────────────────────
    console.log("\nSTEP 6: Verifying...");
    const verify = await client.query(`
      SELECT c.id, c.urgency_badge_text, c.title_line1, c.title_line2,
             c.badge_label, c.badge_value, ti.icon, ti.label
      FROM   components_homepage_ctas c
      LEFT JOIN components_homepage_ctas_trust_items_cmps lnk ON lnk.entity_id = c.id
      LEFT JOIN components_homepage_cta_trust_items ti ON ti.id = lnk.cmp_id
      ORDER  BY c.id, lnk."order"
    `);

    const grouped = {};
    verify.rows.forEach((r) => {
      if (!grouped[r.id]) {
        grouped[r.id] = {
          id: r.id,
          urgency: r.urgency_badge_text,
          title1: r.title_line1,
          title2: r.title_line2,
          badge: `${r.badge_label}: ${r.badge_value}`,
          trust: [],
        };
      }
      if (r.icon && r.label) {
        grouped[r.id].trust.push(`${r.icon}:${r.label}`);
      }
    });

    Object.values(grouped).forEach((cta) => {
      console.log(`  CTA[${cta.id}]:`);
      console.log(`    Urgency: "${cta.urgency}"`);
      console.log(`    Title: "${cta.title1} ${cta.title2}"`);
      console.log(`    Badge: "${cta.badge}"`);
      console.log(`    Trust: [${cta.trust.join(", ")}]`);
    });

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 044 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Update strapi-cms/src/components/homepage/cta.json");
    console.log("     Add all new fields and trust_items component");
    console.log(
      "  2. Create strapi-cms/src/components/homepage/cta-trust-item.json",
    );
    console.log("  3. Restart Strapi to pick up new schema");
    console.log("  4. Edit content in Strapi Admin → Homepage → CTA block");
    console.log("  5. Update frontend component to use dynamic fields\n");
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
