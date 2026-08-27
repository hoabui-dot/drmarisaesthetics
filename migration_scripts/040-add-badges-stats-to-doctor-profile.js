#!/usr/bin/env node

/**
 * Migration Script 040: Add badges and stats to homepage.doctor-profile
 *
 * Changes:
 *  1. Create components_homepage_doctor_badges table
 *  2. Create components_homepage_doctor_stats table
 *  3. Create link tables (Strapi component-in-component pattern)
 *  4. Seed default badges + stats on all existing doctor-profile rows
 *
 * Run (dev):
 *   node migration_scripts/040-add-badges-stats-to-doctor-profile.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/040-add-badges-stats-to-doctor-profile.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

// Default seeds — index matches doctor slot order
const DEFAULT_BADGES = [
  ["Lead Specialist", "Implant Expert"],
  ["Certified Invisalign", "Cosmetic Specialist"],
  ["Implant Expert", "Oral Surgeon"],
  ["Orthodontics", "Certified Invisalign"],
];

const DEFAULT_STATS = [
  ["15+ years", "5,000+ cases", "International trained"],
  ["10+ years", "3,000+ cases", "US certified"],
  ["12+ years", "4,000+ cases", "EU trained"],
  ["8+ years", "2,000+ cases", "Asia certified"],
];

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 040: Add badges + stats to homepage.doctor-profile");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Verify parent table ──────────────────────────────────────────
    console.log(
      "STEP 1: Checking components_homepage_doctor_profiles table...",
    );
    const parentCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND   table_name   = 'components_homepage_doctor_profiles'
      )
    `);
    if (!parentCheck.rows[0].exists) {
      throw new Error(
        "Table components_homepage_doctor_profiles does not exist. Run Strapi first.",
      );
    }
    console.log("  [OK] Parent table exists\n");

    // ── STEP 2: Create badge items table ─────────────────────────────────────
    console.log("STEP 2: Creating components_homepage_doctor_badges table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_doctor_badges (
        id    SERIAL PRIMARY KEY,
        label VARCHAR(255) NOT NULL
      )
    `);
    console.log("  [OK] Created (or already exists)\n");

    // ── STEP 3: Create stat items table ──────────────────────────────────────
    console.log("STEP 3: Creating components_homepage_doctor_stats table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_doctor_stats (
        id    SERIAL PRIMARY KEY,
        label VARCHAR(255) NOT NULL
      )
    `);
    console.log("  [OK] Created (or already exists)\n");

    // ── STEP 4: Create badge link table ──────────────────────────────────────
    console.log("STEP 4: Creating badge link table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_doctor_profiles_badges_cmps (
        id             SERIAL PRIMARY KEY,
        entity_id      INTEGER NOT NULL
                         REFERENCES components_homepage_doctor_profiles(id)
                         ON DELETE CASCADE,
        cmp_id         INTEGER NOT NULL
                         REFERENCES components_homepage_doctor_badges(id)
                         ON DELETE CASCADE,
        component_type VARCHAR(255) NOT NULL DEFAULT 'homepage.doctor-badge',
        field          VARCHAR(255) NOT NULL DEFAULT 'badges',
        "order"        DOUBLE PRECISION
      )
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS doctor_badges_entity_idx
        ON components_homepage_doctor_profiles_badges_cmps(entity_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS doctor_badges_cmp_idx
        ON components_homepage_doctor_profiles_badges_cmps(cmp_id)
    `);
    console.log("  [OK] Created (or already exists)\n");

    // ── STEP 5: Create stat link table ───────────────────────────────────────
    console.log("STEP 5: Creating stat link table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_doctor_profiles_stats_cmps (
        id             SERIAL PRIMARY KEY,
        entity_id      INTEGER NOT NULL
                         REFERENCES components_homepage_doctor_profiles(id)
                         ON DELETE CASCADE,
        cmp_id         INTEGER NOT NULL
                         REFERENCES components_homepage_doctor_stats(id)
                         ON DELETE CASCADE,
        component_type VARCHAR(255) NOT NULL DEFAULT 'homepage.doctor-stat',
        field          VARCHAR(255) NOT NULL DEFAULT 'stats',
        "order"        DOUBLE PRECISION
      )
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS doctor_stats_entity_idx
        ON components_homepage_doctor_profiles_stats_cmps(entity_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS doctor_stats_cmp_idx
        ON components_homepage_doctor_profiles_stats_cmps(cmp_id)
    `);
    console.log("  [OK] Created (or already exists)\n");

    // ── STEP 6: Seed defaults on existing doctor-profile rows ─────────────────
    console.log("STEP 6: Seeding defaults on existing doctor-profile rows...");
    const profiles = await client.query(`
      SELECT id FROM components_homepage_doctor_profiles ORDER BY id
    `);

    if (profiles.rows.length === 0) {
      console.log(
        "  [INFO] No existing doctor profiles found — skipping seed\n",
      );
    } else {
      for (let i = 0; i < profiles.rows.length; i++) {
        const profileId = profiles.rows[i].id;
        const slotIndex = i % DEFAULT_BADGES.length;

        // Check idempotency
        const hasBadges = await client.query(
          `
          SELECT COUNT(*) AS cnt
          FROM   components_homepage_doctor_profiles_badges_cmps
          WHERE  entity_id = $1
        `,
          [profileId],
        );

        if (parseInt(hasBadges.rows[0].cnt) > 0) {
          console.log(`  [SKIP] Profile ${profileId} already has badges`);
        } else {
          for (let j = 0; j < DEFAULT_BADGES[slotIndex].length; j++) {
            const badge = await client.query(
              `
              INSERT INTO components_homepage_doctor_badges (label)
              VALUES ($1) RETURNING id
            `,
              [DEFAULT_BADGES[slotIndex][j]],
            );

            await client.query(
              `
              INSERT INTO components_homepage_doctor_profiles_badges_cmps
                (entity_id, cmp_id, component_type, field, "order")
              VALUES ($1, $2, 'homepage.doctor-badge', 'badges', $3)
            `,
              [profileId, badge.rows[0].id, j + 1],
            );
          }
          console.log(
            `  [OK] Seeded ${DEFAULT_BADGES[slotIndex].length} badges for profile ${profileId}`,
          );
        }

        const hasStats = await client.query(
          `
          SELECT COUNT(*) AS cnt
          FROM   components_homepage_doctor_profiles_stats_cmps
          WHERE  entity_id = $1
        `,
          [profileId],
        );

        if (parseInt(hasStats.rows[0].cnt) > 0) {
          console.log(`  [SKIP] Profile ${profileId} already has stats`);
        } else {
          for (let j = 0; j < DEFAULT_STATS[slotIndex].length; j++) {
            const stat = await client.query(
              `
              INSERT INTO components_homepage_doctor_stats (label)
              VALUES ($1) RETURNING id
            `,
              [DEFAULT_STATS[slotIndex][j]],
            );

            await client.query(
              `
              INSERT INTO components_homepage_doctor_profiles_stats_cmps
                (entity_id, cmp_id, component_type, field, "order")
              VALUES ($1, $2, 'homepage.doctor-stat', 'stats', $3)
            `,
              [profileId, stat.rows[0].id, j + 1],
            );
          }
          console.log(
            `  [OK] Seeded ${DEFAULT_STATS[slotIndex].length} stats for profile ${profileId}`,
          );
        }
      }
    }

    // ── STEP 7: Verify ────────────────────────────────────────────────────────
    console.log("\nSTEP 7: Verifying...");
    const verify = await client.query(`
      SELECT
        p.id   AS profile_id,
        p.name,
        b.label AS badge,
        s.label AS stat
      FROM   components_homepage_doctor_profiles p
      LEFT JOIN components_homepage_doctor_profiles_badges_cmps bl ON bl.entity_id = p.id
      LEFT JOIN components_homepage_doctor_badges b ON b.id = bl.cmp_id
      LEFT JOIN components_homepage_doctor_profiles_stats_cmps sl ON sl.entity_id = p.id
      LEFT JOIN components_homepage_doctor_stats s ON s.id = sl.cmp_id
      ORDER  BY p.id, bl."order", sl."order"
      LIMIT  20
    `);
    verify.rows.forEach((r) =>
      console.log(
        `  profile[${r.profile_id}] ${r.name} | badge="${r.badge}" | stat="${r.stat}"`,
      ),
    );

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 040 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up new component schemas");
    console.log(
      "  2. Edit badges/stats per doctor in Strapi Admin → Homepage → Doctor Section\n",
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
