#!/usr/bin/env node

/**
 * Migration Script 120: Add Hero Feature & Location Fields to Contact Page
 *
 * Changes:
 *  1. Add location_badge (VARCHAR) and location_detail (TEXT) columns to components_contact_heroes
 *  2. Create components_contact_hero_features table (icon, label, body)
 *  3. Create components_contact_heroes_features_cmps link table
 *  4. Seed location_badge & location_detail into the existing published hero row(s)
 *  5. Seed two feature rows and link them to the published hero
 *
 * Run (dev):
 *   node migration_scripts/120-add-hero-features-location-to-contact-page.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/120-add-hero-features-location-to-contact-page.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

// PAGE_DATA values to seed — keep in sync with ContactPageClient.tsx PAGE_DATA
const SEED = {
  locationBadge: "PhÃº Nhuáº­n Ward, Ho Chi Minh City",
  locationDetail:
    "Our clinic is located in PhÃº Nhuáº­n Ward, right in the heart of Ho Chi Minh City, serving both local and international patients. We also offer multiple payment options for your convenience.",
  features: [
    {
      icon: "message",
      label: "Free Consultation",
      body: "We're happy to assist with all your dental questions and booking inquiries.",
    },
    {
      icon: "phone",
      label: "Expert Guidance",
      body: "When you contact us, our dental assistants will provide free consultation and guidance to help you understand your condition and choose the most suitable treatment.",
    },
  ],
};

async function columnExists(client, table, column) {
  const res = await client.query(
    `SELECT EXISTS (
       SELECT FROM information_schema.columns
       WHERE table_name = $1 AND column_name = $2
     ) AS exists`,
    [table, column],
  );
  return res.rows[0].exists;
}

async function tableExists(client, tableName) {
  const res = await client.query(
    `SELECT EXISTS (
       SELECT FROM information_schema.tables
       WHERE table_name = $1
     ) AS exists`,
    [tableName],
  );
  return res.rows[0].exists;
}

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 120: Add Hero Features & Location to Contact Page");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Add location columns to components_contact_heroes ──────────
    console.log("STEP 1: Adding location_badge & location_detail columns...");

    if (!(await tableExists(client, "components_contact_heroes"))) {
      console.error("  [ERROR] components_contact_heroes table not found!");
      process.exit(1);
    }

    if (!(await columnExists(client, "components_contact_heroes", "location_badge"))) {
      await client.query(`
        ALTER TABLE components_contact_heroes
        ADD COLUMN location_badge VARCHAR(255)
      `);
      console.log("  [OK] Added location_badge column");
    } else {
      console.log("  [SKIP] location_badge column already exists");
    }

    if (!(await columnExists(client, "components_contact_heroes", "location_detail"))) {
      await client.query(`
        ALTER TABLE components_contact_heroes
        ADD COLUMN location_detail TEXT
      `);
      console.log("  [OK] Added location_detail column");
    } else {
      console.log("  [SKIP] location_detail column already exists");
    }
    console.log("");

    // ── STEP 2: Create components_contact_hero_features table ──────────────
    console.log("STEP 2: Creating components_contact_hero_features table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_hero_features (
        id         SERIAL PRIMARY KEY,
        icon       VARCHAR(50)  NOT NULL DEFAULT 'message',
        label      VARCHAR(255) NOT NULL DEFAULT '',
        body       TEXT         NOT NULL DEFAULT ''
      )
    `);
    console.log("  [OK] components_contact_hero_features ready\n");

    // ── STEP 3: Create link table ──────────────────────────────────────────
    console.log("STEP 3: Creating components_contact_heroes_features_cmps link table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_heroes_features_cmps (
        id             SERIAL PRIMARY KEY,
        entity_id      INTEGER NOT NULL
                         REFERENCES components_contact_heroes(id)
                         ON DELETE CASCADE,
        cmp_id         INTEGER NOT NULL
                         REFERENCES components_contact_hero_features(id)
                         ON DELETE CASCADE,
        component_type VARCHAR(255) NOT NULL DEFAULT 'contact.hero-feature',
        field          VARCHAR(255) NOT NULL DEFAULT 'features',
        "order"        DOUBLE PRECISION
      )
    `);
    console.log("  [OK] Link table ready\n");

    // ── STEP 4: Seed location data into existing hero rows ─────────────────
    console.log("STEP 4: Seeding location data into existing hero row(s)...");

    const heroes = await client.query(
      `SELECT id, title FROM components_contact_heroes ORDER BY id`,
    );

    if (heroes.rowCount === 0) {
      console.log("  [WARN] No hero rows found — skipping seed\n");
    } else {
      for (const hero of heroes.rows) {
        await client.query(
          `UPDATE components_contact_heroes
           SET location_badge  = $1,
               location_detail = $2
           WHERE id = $3`,
          [SEED.locationBadge, SEED.locationDetail, hero.id],
        );
        console.log(`  [OK] Updated hero id=${hero.id} ("${hero.title || 'no title'}")`);
      }
      console.log("");

      // ── STEP 5: Seed features linked to the first hero ───────────────────
      console.log("STEP 5: Seeding hero feature rows...");

      // Link to the first (primary) hero row
      const primaryHeroId = heroes.rows[0].id;

      // Check if features already seeded
      const existingLinks = await client.query(
        `SELECT COUNT(*) AS count FROM components_contact_heroes_features_cmps WHERE entity_id = $1`,
        [primaryHeroId],
      );

      if (parseInt(existingLinks.rows[0].count) > 0) {
        console.log(`  [SKIP] Features already linked to hero id=${primaryHeroId}`);
      } else {
        for (let i = 0; i < SEED.features.length; i++) {
          const feat = SEED.features[i];

          // Insert feature row
          const featResult = await client.query(
            `INSERT INTO components_contact_hero_features (icon, label, body)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [feat.icon, feat.label, feat.body],
          );
          const featId = featResult.rows[0].id;

          // Link to hero
          await client.query(
            `INSERT INTO components_contact_heroes_features_cmps
               (entity_id, cmp_id, component_type, field, "order")
             VALUES ($1, $2, 'contact.hero-feature', 'features', $3)`,
            [primaryHeroId, featId, i + 1],
          );

          console.log(`  [OK] Seeded feature "${feat.label}" (id=${featId}) → hero id=${primaryHeroId}`);
        }
      }
      console.log("");
    }

    // ── STEP 6: Verify ────────────────────────────────────────────────────
    console.log("STEP 6: Verification...");

    const verifyHeroes = await client.query(
      `SELECT id, title, location_badge, location_detail FROM components_contact_heroes`,
    );
    verifyHeroes.rows.forEach((r) => {
      console.log(`  Hero id=${r.id}: badge="${r.location_badge || 'EMPTY'}", detail="${r.location_detail ? r.location_detail.substring(0, 40) + '...' : 'EMPTY'}"`);
    });

    const verifyFeatures = await client.query(
      `SELECT f.id, f.icon, f.label, l.entity_id
       FROM components_contact_hero_features f
       LEFT JOIN components_contact_heroes_features_cmps l ON l.cmp_id = f.id
       ORDER BY l.entity_id, l."order"`,
    );
    verifyFeatures.rows.forEach((r) => {
      console.log(`  Feature id=${r.id}: icon=${r.icon}, label="${r.label}", linked to hero_id=${r.entity_id}`);
    });
    console.log("");

    console.log("=".repeat(70));
    console.log("MIGRATION 120 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi: cd strapi-cms && npm run develop");
    console.log("  2. Verify Contact Page in Strapi Admin:");
    console.log("     → Hero block should now show location_badge, location_detail, features fields");
    console.log("  3. Save & Publish the Contact Page in Strapi\n");
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
