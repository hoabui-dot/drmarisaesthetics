#!/usr/bin/env node

/**
 * Migration Script 121: Sync Hero Features & Location Data to Draft State
 *
 * Problem (per .ai/STRAPI_V5_MIGRATION_SKILL.md):
 *   Migration 120 seeded location_badge, location_detail, and feature rows into
 *   the DB, but Strapi Admin UI requires a DRAFT row sharing the same document_id.
 *   The published hero component rows have the new data, but the draft rows (if
 *   they exist separately) do not, so the Strapi Admin shows old/empty content.
 *
 * What this script does:
 *  1. Finds the contact_pages published row and its linked hero cmp_id
 *  2. Finds or creates the draft contact_pages row
 *  3. Clones the hero component row (with new location fields) for the DRAFT
 *  4. Clones feature rows and their links for the DRAFT hero clone
 *  5. Clones other cmps (map-section, faq) for the draft if not yet linked
 *
 * Run:
 *   node migration_scripts/121-sync-hero-draft-for-strapi-admin.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

const SEED_FEATURES = [
  { icon: "message", label: "Free Consultation", body: "We're happy to assist with all your dental questions and booking inquiries." },
  { icon: "phone",   label: "Expert Guidance",   body: "When you contact us, our dental assistants will provide free consultation and guidance to help you understand your condition and choose the most suitable treatment." },
];

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 121: Sync Hero Draft State for Strapi Admin");
  console.log("=".repeat(70));
  console.log(`\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`);

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Find the published contact_pages row ───────────────────────
    console.log("STEP 1: Finding published contact_pages row...");
    const pubResult = await client.query(`
      SELECT id, document_id, published_at, locale
      FROM contact_pages
      WHERE published_at IS NOT NULL
      ORDER BY id DESC
      LIMIT 1
    `);

    if (pubResult.rowCount === 0) {
      console.error("  [ERROR] No published contact_pages row found.");
      process.exit(1);
    }

    const pub = pubResult.rows[0];
    console.log(`  [OK] Published row: id=${pub.id}, document_id=${pub.document_id}\n`);

    // ── STEP 2: Check/create draft contact_pages row ───────────────────────
    console.log("STEP 2: Checking for draft contact_pages row...");
    const draftCheck = await client.query(`
      SELECT id FROM contact_pages
      WHERE document_id = $1 AND published_at IS NULL
      LIMIT 1
    `, [pub.document_id]);

    let draftId;
    if (draftCheck.rowCount > 0) {
      draftId = draftCheck.rows[0].id;
      console.log(`  [OK] Draft row already exists: id=${draftId}`);
    } else {
      // Drop unique constraint on document_id if it exists
      await client.query(`
        DO $$ BEGIN
          ALTER TABLE contact_pages DROP CONSTRAINT IF EXISTS contact_pages_document_id_key;
        EXCEPTION WHEN others THEN NULL;
        END $$;
      `).catch(() => {});

      const draftInsert = await client.query(`
        INSERT INTO contact_pages (document_id, created_at, updated_at, published_at, created_by_id, updated_by_id, locale)
        SELECT document_id, created_at, NOW(), NULL, created_by_id, updated_by_id, locale
        FROM contact_pages WHERE id = $1
        RETURNING id
      `, [pub.id]);
      draftId = draftInsert.rows[0].id;
      console.log(`  [OK] Created draft row: id=${draftId}`);
    }
    console.log("");

    // ── STEP 3: Find hero cmp linked to published contact_pages ───────────
    console.log("STEP 3: Finding hero cmp linked to published row...");
    const pubHeroLink = await client.query(`
      SELECT cmp_id, field, "order"
      FROM contact_pages_cmps
      WHERE entity_id = $1 AND component_type = 'contact.hero'
      LIMIT 1
    `, [pub.id]);

    if (pubHeroLink.rowCount === 0) {
      console.error("  [ERROR] No contact.hero cmp found linked to published row.");
      process.exit(1);
    }

    const pubHeroCmpId = pubHeroLink.rows[0].cmp_id;
    const heroOrder = pubHeroLink.rows[0].order;
    console.log(`  [OK] Published hero cmp_id=${pubHeroCmpId}\n`);

    // ── STEP 4: Check if draft already has hero linked ─────────────────────
    console.log("STEP 4: Checking if draft hero cmp already linked...");
    const draftHeroCheck = await client.query(`
      SELECT cmp_id FROM contact_pages_cmps
      WHERE entity_id = $1 AND component_type = 'contact.hero'
      LIMIT 1
    `, [draftId]);

    let draftHeroCmpId;
    if (draftHeroCheck.rowCount > 0) {
      draftHeroCmpId = draftHeroCheck.rows[0].cmp_id;
      console.log(`  [OK] Draft hero cmp already exists: cmp_id=${draftHeroCmpId}`);
      console.log("       Updating location fields on existing draft hero...");

      // Get pub hero data to copy location fields
      const pubHero = await client.query(
        `SELECT * FROM components_contact_heroes WHERE id = $1`, [pubHeroCmpId]
      );
      const pubHeroData = pubHero.rows[0];

      await client.query(`
        UPDATE components_contact_heroes
        SET location_badge  = $1,
            location_detail = $2
        WHERE id = $3
      `, [pubHeroData.location_badge, pubHeroData.location_detail, draftHeroCmpId]);
      console.log(`  [OK] Updated location fields on draft hero id=${draftHeroCmpId}`);
    } else {
      // Clone published hero for draft — MUST be a fresh row (not shared id)
      const pubHeroRow = await client.query(
        `SELECT * FROM components_contact_heroes WHERE id = $1`, [pubHeroCmpId]
      );
      const h = pubHeroRow.rows[0];

      const newHeroRes = await client.query(`
        INSERT INTO components_contact_heroes
          (title, subtitle, location_badge, location_detail)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [h.title, h.subtitle, h.location_badge, h.location_detail]);
      draftHeroCmpId = newHeroRes.rows[0].id;

      // Link draft hero to draft page
      await client.query(`
        INSERT INTO contact_pages_cmps
          (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, 'contact.hero', 'layout', $3)
      `, [draftId, draftHeroCmpId, heroOrder]);
      console.log(`  [OK] Cloned hero → new cmp_id=${draftHeroCmpId}, linked to draft id=${draftId}`);
    }
    console.log("");

    // ── STEP 5: Clone feature rows for draft hero ──────────────────────────
    console.log("STEP 5: Seeding feature rows for draft hero...");
    const existingDraftFeatures = await client.query(`
      SELECT COUNT(*) AS count FROM components_contact_heroes_features_cmps
      WHERE entity_id = $1
    `, [draftHeroCmpId]);

    if (parseInt(existingDraftFeatures.rows[0].count) > 0) {
      console.log(`  [SKIP] Features already linked to draft hero cmp_id=${draftHeroCmpId}`);
    } else {
      for (let i = 0; i < SEED_FEATURES.length; i++) {
        const feat = SEED_FEATURES[i];
        const featRes = await client.query(`
          INSERT INTO components_contact_hero_features (icon, label, body)
          VALUES ($1, $2, $3)
          RETURNING id
        `, [feat.icon, feat.label, feat.body]);
        const newFeatId = featRes.rows[0].id;

        await client.query(`
          INSERT INTO components_contact_heroes_features_cmps
            (entity_id, cmp_id, component_type, field, "order")
          VALUES ($1, $2, 'contact.hero-feature', 'features', $3)
        `, [draftHeroCmpId, newFeatId, i + 1]);

        console.log(`  [OK] Seeded feature "${feat.label}" (id=${newFeatId}) → draft hero cmp_id=${draftHeroCmpId}`);
      }
    }
    console.log("");

    // ── STEP 6: Clone remaining published cmps to draft ────────────────────
    console.log("STEP 6: Cloning remaining published cmps to draft (map-section, faq)...");
    const pubCmps = await client.query(`
      SELECT * FROM contact_pages_cmps
      WHERE entity_id = $1 AND component_type != 'contact.hero'
      ORDER BY "order"
    `, [pub.id]);

    for (const cmp of pubCmps.rows) {
      const already = await client.query(`
        SELECT id FROM contact_pages_cmps
        WHERE entity_id = $1 AND component_type = $2
        LIMIT 1
      `, [draftId, cmp.component_type]);

      if (already.rowCount > 0) {
        console.log(`  [SKIP] ${cmp.component_type} already linked to draft`);
        continue;
      }

      // Point draft to same cmp_id for non-hero components (safe for non-editable sections like map/faq)
      await client.query(`
        INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
        VALUES ($1, $2, $3, $4, $5)
      `, [draftId, cmp.cmp_id, cmp.component_type, cmp.field, cmp.order]);
      console.log(`  [OK] Linked ${cmp.component_type} cmp_id=${cmp.cmp_id} → draft id=${draftId}`);
    }
    console.log("");

    // ── STEP 7: Verify ────────────────────────────────────────────────────
    console.log("STEP 7: Final verification...");

    const allRows = await client.query(`
      SELECT id, document_id,
             CASE WHEN published_at IS NULL THEN 'DRAFT' ELSE 'PUBLISHED' END AS status
      FROM contact_pages
      WHERE document_id = $1
      ORDER BY id
    `, [pub.document_id]);

    console.log("  contact_pages rows:");
    allRows.rows.forEach(r =>
      console.log(`    id=${r.id} [${r.status}] document_id=${r.document_id}`)
    );

    const draftCmps = await client.query(`
      SELECT component_type, cmp_id, "order"
      FROM contact_pages_cmps
      WHERE entity_id = $1
      ORDER BY "order"
    `, [draftId]);

    console.log(`\n  contact_pages_cmps for draft id=${draftId}:`);
    draftCmps.rows.forEach(r =>
      console.log(`    [${r.order}] ${r.component_type} → cmp_id=${r.cmp_id}`)
    );

    const draftFeatureLinks = await client.query(`
      SELECT f.icon, f.label, l.entity_id
      FROM components_contact_hero_features f
      JOIN components_contact_heroes_features_cmps l ON l.cmp_id = f.id
      WHERE l.entity_id = $1
      ORDER BY l."order"
    `, [draftHeroCmpId]);

    console.log(`\n  Features linked to draft hero cmp_id=${draftHeroCmpId}:`);
    draftFeatureLinks.rows.forEach(r =>
      console.log(`    [${r.icon}] "${r.label}"`)
    );
    console.log("");

    console.log("=".repeat(70));
    console.log("MIGRATION 121 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi: cd strapi-cms && npm run develop");
    console.log("  2. Open Strapi Admin → Contact Page");
    console.log("     → Hero block should now show location_badge, location_detail, features");
    console.log("  3. Verify data looks correct, then click Save & Publish\n");

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
