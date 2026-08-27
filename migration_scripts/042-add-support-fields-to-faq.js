#!/usr/bin/env node

/**
 * Migration Script 042: Add support card fields to homepage.faq
 *
 * Changes to components_homepage_faqs:
 *  1. ADD COLUMN cta_label VARCHAR(255)
 *  2. ADD COLUMN cta_link  VARCHAR(255)
 *  (doctor_image is a media relation — handled by Strapi's files_related_mph)
 *
 * New table:
 *  3. CREATE components_homepage_faq_contact_items (icon, label, sub_label)
 *  4. CREATE link table: components_homepage_faqs_contact_items_cmps
 *  5. Seed default contact items on existing FAQ rows
 *  6. Seed default CTA values on existing FAQ rows
 *
 * Run (dev):
 *   node migration_scripts/042-add-support-fields-to-faq.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/042-add-support-fields-to-faq.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

const DEFAULT_CONTACT_ITEMS = [
  { icon: "📞", label: "Call us", sub_label: "Mon–Sat 8am–8pm" },
  { icon: "💬", label: "Live chat", sub_label: "Avg. reply in 2 min" },
  { icon: "📧", label: "Email us", sub_label: "Reply within 24h" },
];

const DEFAULT_CTA_LABEL = "Book Free Consultation";
const DEFAULT_CTA_LINK = "/contact";

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 042: Add support card fields to homepage.faq");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify parent table ──────────────────────────────────────────
    console.log("STEP 1: Checking components_homepage_faqs table...");
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND   table_name   = 'components_homepage_faqs'
      )
    `);
    if (!tableCheck.rows[0].exists) {
      throw new Error(
        "Table components_homepage_faqs does not exist. Run Strapi first.",
      );
    }
    console.log("  [OK] Table exists\n");

    // ── STEP 2: Add cta_label + cta_link columns ─────────────────────────────
    console.log("STEP 2: Adding cta_label and cta_link columns...");
    for (const col of ["cta_label", "cta_link"]) {
      const exists = await client.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.columns
          WHERE table_schema = 'public'
          AND   table_name   = 'components_homepage_faqs'
          AND   column_name  = $1
        )
      `,
        [col],
      );
      if (exists.rows[0].exists) {
        console.log(`  [SKIP] ${col} already exists`);
      } else {
        await client.query(
          `ALTER TABLE components_homepage_faqs ADD COLUMN ${col} VARCHAR(255)`,
        );
        console.log(`  [OK] Added ${col}`);
      }
    }
    console.log();

    // ── STEP 3: Create contact items table ───────────────────────────────────
    console.log(
      "STEP 3: Creating components_homepage_faq_contact_items table...",
    );
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_faq_contact_items (
        id        SERIAL PRIMARY KEY,
        icon      VARCHAR(32),
        label     VARCHAR(255) NOT NULL,
        sub_label VARCHAR(255)
      )
    `);
    console.log("  [OK] Created (or already exists)\n");

    // ── STEP 4: Create link table ─────────────────────────────────────────────
    console.log("STEP 4: Creating link table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_faqs_contact_items_cmps (
        id             SERIAL PRIMARY KEY,
        entity_id      INTEGER NOT NULL
                         REFERENCES components_homepage_faqs(id)
                         ON DELETE CASCADE,
        cmp_id         INTEGER NOT NULL
                         REFERENCES components_homepage_faq_contact_items(id)
                         ON DELETE CASCADE,
        component_type VARCHAR(255) NOT NULL DEFAULT 'homepage.faq-contact-item',
        field          VARCHAR(255) NOT NULL DEFAULT 'contact_items',
        "order"        DOUBLE PRECISION
      )
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS faq_contact_items_entity_idx
        ON components_homepage_faqs_contact_items_cmps(entity_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS faq_contact_items_cmp_idx
        ON components_homepage_faqs_contact_items_cmps(cmp_id)
    `);
    console.log("  [OK] Created (or already exists)\n");

    // ── STEP 5: Seed existing FAQ rows ────────────────────────────────────────
    console.log("STEP 5: Seeding existing FAQ rows...");
    const faqRows = await client.query(`
      SELECT id FROM components_homepage_faqs ORDER BY id
    `);

    for (const row of faqRows.rows) {
      const faqId = row.id;

      // Seed CTA (idempotent)
      await client.query(
        `
        UPDATE components_homepage_faqs
        SET cta_label = $1, cta_link = $2
        WHERE id = $3 AND cta_label IS NULL
      `,
        [DEFAULT_CTA_LABEL, DEFAULT_CTA_LINK, faqId],
      );

      // Seed contact items (idempotent)
      const already = await client.query(
        `
        SELECT COUNT(*) AS cnt
        FROM   components_homepage_faqs_contact_items_cmps
        WHERE  entity_id = $1
      `,
        [faqId],
      );

      if (parseInt(already.rows[0].cnt) > 0) {
        console.log(`  [SKIP] FAQ ${faqId} already has contact items`);
        continue;
      }

      for (let i = 0; i < DEFAULT_CONTACT_ITEMS.length; i++) {
        const ci = DEFAULT_CONTACT_ITEMS[i];
        const res = await client.query(
          `
          INSERT INTO components_homepage_faq_contact_items (icon, label, sub_label)
          VALUES ($1, $2, $3) RETURNING id
        `,
          [ci.icon, ci.label, ci.sub_label],
        );

        await client.query(
          `
          INSERT INTO components_homepage_faqs_contact_items_cmps
            (entity_id, cmp_id, component_type, field, "order")
          VALUES ($1, $2, 'homepage.faq-contact-item', 'contact_items', $3)
        `,
          [faqId, res.rows[0].id, i + 1],
        );
      }
      console.log(
        `  [OK] Seeded FAQ ${faqId}: CTA + ${DEFAULT_CONTACT_ITEMS.length} contact items`,
      );
    }

    // ── STEP 6: Verify ────────────────────────────────────────────────────────
    console.log("\nSTEP 6: Verifying...");
    const verify = await client.query(`
      SELECT f.id, f.cta_label, f.cta_link, ci.icon, ci.label, ci.sub_label
      FROM   components_homepage_faqs f
      JOIN   components_homepage_faqs_contact_items_cmps lnk ON lnk.entity_id = f.id
      JOIN   components_homepage_faq_contact_items ci ON ci.id = lnk.cmp_id
      ORDER  BY f.id, lnk."order"
    `);
    verify.rows.forEach((r) =>
      console.log(
        `  faq[${r.id}] cta="${r.cta_label}" | ${r.icon} ${r.label} — ${r.sub_label}`,
      ),
    );

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 042 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up new schema");
    console.log(
      "  2. Upload doctor image in Strapi Admin → Homepage → FAQ block",
    );
    console.log("  3. Edit CTA label/link and contact items as needed\n");
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
