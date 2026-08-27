#!/usr/bin/env node

/**
 * Migration 123: Update Core Values Section with Dental Content & Icons
 *
 * Changes:
 *  1. Update core_values badge, title, description with dental-themed content
 *  2. Replace feature_items with 3 dental-focused core values with dental icons
 *
 * Run:
 *   node migration_scripts/123-update-core-values-content.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

const NEW_CORE_VALUES = [
  {
    icon: "Smile",
    title: "Patient-Centered Care",
    description:
      "Every treatment plan is built around your comfort, needs, and goals. We listen first, then deliver dentistry that fits your life — not the other way around.",
  },
  {
    icon: "ShieldCheck",
    title: "Safety & Sterilization Standards",
    description:
      "We follow international sterilization protocols with hospital-grade equipment. Your health is never a compromise — it's our highest clinical obligation.",
  },
  {
    icon: "Award",
    title: "Clinical Excellence",
    description:
      "Our team holds international certifications and pursues continuous education. Every procedure is performed to the highest standard of precision and craftsmanship.",
  },
];

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 123: Update Core Values with Dental Content");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check existing core_values record ─────────────────────────
    console.log("STEP 1: Checking existing core_values...");
    const cvResult = await client.query(
      "SELECT id, badge, title FROM components_about_core_values LIMIT 1"
    );

    if (cvResult.rows.length === 0) {
      console.log("  [WARN] No core_values record found. Inserting new one...");
      await client.query(`
        INSERT INTO components_about_core_values (badge, title, description)
        VALUES (
          'Our Core Values',
          'The Principles Behind Every Smile We Create',
          'Everything we do is guided by a set of values that put patients first, uphold the highest clinical standards, and build lasting trust in every interaction.'
        )
      `);
      const inserted = await client.query(
        "SELECT id FROM components_about_core_values ORDER BY id DESC LIMIT 1"
      );
      console.log(`  [OK] Inserted core_values id=${inserted.rows[0].id}`);
    } else {
      const cv = cvResult.rows[0];
      console.log(`  [OK] Found core_values id=${cv.id}: "${cv.title}"`);

      // Update badge, title, description
      await client.query(
        `UPDATE components_about_core_values
         SET badge = $1, title = $2, description = $3
         WHERE id = $4`,
        [
          "Our Core Values",
          "The Principles Behind Every Smile We Create",
          "Everything we do is guided by a set of values that put patients first, uphold the highest clinical standards, and build lasting trust in every interaction.",
          cv.id,
        ]
      );
      console.log("  [OK] Updated core_values badge/title/description\n");
    }

    // ── STEP 2: Get the core_values record id ─────────────────────────────
    console.log("STEP 2: Getting core_values link table entries...");
    const cvFinal = await client.query(
      "SELECT id FROM components_about_core_values ORDER BY id DESC LIMIT 1"
    );
    const coreValuesId = cvFinal.rows[0].id;

    // Check for link table (core_values -> feature_items)
    const linkTableResult = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name LIKE 'components_about_core_values%cmps'
    `);

    let linkTable = null;
    if (linkTableResult.rows.length > 0) {
      linkTable = linkTableResult.rows[0].table_name;
      console.log(`  [OK] Found link table: ${linkTable}`);

      // Get existing linked feature items
      const existingLinks = await client.query(
        `SELECT cmp_id FROM ${linkTable} WHERE entity_id = $1 AND field = 'values'`,
        [coreValuesId]
      );
      console.log(`  [INFO] Existing linked items: ${existingLinks.rows.length}`);

      // Delete existing feature items linked to this core_values
      for (const link of existingLinks.rows) {
        await client.query(
          "DELETE FROM components_about_feature_items WHERE id = $1",
          [link.cmp_id]
        );
      }
      // Delete the link entries
      await client.query(
        `DELETE FROM ${linkTable} WHERE entity_id = $1 AND field = 'values'`,
        [coreValuesId]
      );
      console.log("  [OK] Cleared existing value items\n");
    } else {
      console.log("  [WARN] No link table found, will check alternate structure\n");
    }

    // ── STEP 3: Insert new feature items ─────────────────────────────────
    console.log("STEP 3: Inserting new dental-themed core value items...");
    for (let i = 0; i < NEW_CORE_VALUES.length; i++) {
      const val = NEW_CORE_VALUES[i];

      // Insert the feature item
      const itemResult = await client.query(
        `INSERT INTO components_about_feature_items (icon, title, description)
         VALUES ($1, $2, $3) RETURNING id`,
        [val.icon, val.title, val.description]
      );
      const itemId = itemResult.rows[0].id;
      console.log(`  [OK] Inserted feature_item id=${itemId}: "${val.title}" (icon: ${val.icon})`);

      // Link to core_values via link table
      if (linkTable) {
        await client.query(
          `INSERT INTO ${linkTable} (entity_id, cmp_id, component_type, field, "order")
           VALUES ($1, $2, $3, $4, $5)`,
          [coreValuesId, itemId, "about.feature-item", "values", i + 1]
        );
        console.log(`  [OK] Linked feature_item ${itemId} to core_values ${coreValuesId}`);
      }
    }

    // ── STEP 4: Verify ────────────────────────────────────────────────────
    console.log("\nSTEP 4: Verifying...");
    const verify = await client.query(
      "SELECT id, badge, title FROM components_about_core_values ORDER BY id DESC LIMIT 1"
    );
    console.log("  core_values:", JSON.stringify(verify.rows[0]));

    if (linkTable) {
      const links = await client.query(
        `SELECT fi.id, fi.icon, fi.title FROM ${linkTable} lk
         JOIN components_about_feature_items fi ON fi.id = lk.cmp_id
         WHERE lk.entity_id = $1 AND lk.field = 'values'
         ORDER BY lk."order"`,
        [coreValuesId]
      );
      console.log("  linked values:", JSON.stringify(links.rows));
    }

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 123 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to refresh admin panel");
    console.log("  2. Verify content in Strapi admin under About Page > Core Values");
    console.log("  3. Frontend already updated with dental iconMap\n");
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
