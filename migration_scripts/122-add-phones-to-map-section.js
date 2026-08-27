#!/usr/bin/env node

/**
 * Migration Script 122: Add phone & phone_secondary to Map Section
 *
 * Changes:
 *  1. Add phone (VARCHAR) and phone_secondary (VARCHAR) columns to components_contact_map_sections
 *  2. Seed phone data into all existing map-section rows (published + draft)
 *
 * Per .ai/STRAPI_V5_MIGRATION_SKILL.md:
 *  - Both published and draft component rows must be updated (they share cmp_id here,
 *    since map-section is not user-edited frequently, but we update all rows to be safe)
 *
 * Run:
 *   node migration_scripts/122-add-phones-to-map-section.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

const PHONE_PRIMARY   = "0396 877 518";
const PHONE_SECONDARY = "0902 759 406";

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

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 122: Add phone & phone_secondary to Map Section");
  console.log("=".repeat(70));
  console.log(`\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`);

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Add columns ────────────────────────────────────────────────
    console.log("STEP 1: Adding phone & phone_secondary columns to components_contact_map_sections...");

    if (!(await columnExists(client, "components_contact_map_sections", "phone"))) {
      await client.query(`
        ALTER TABLE components_contact_map_sections
        ADD COLUMN phone VARCHAR(50) DEFAULT '${PHONE_PRIMARY}'
      `);
      console.log("  [OK] Added phone column");
    } else {
      console.log("  [SKIP] phone column already exists");
    }

    if (!(await columnExists(client, "components_contact_map_sections", "phone_secondary"))) {
      await client.query(`
        ALTER TABLE components_contact_map_sections
        ADD COLUMN phone_secondary VARCHAR(50) DEFAULT '${PHONE_SECONDARY}'
      `);
      console.log("  [OK] Added phone_secondary column");
    } else {
      console.log("  [SKIP] phone_secondary column already exists");
    }
    console.log("");

    // ── STEP 2: Seed phone data into all rows ──────────────────────────────
    console.log("STEP 2: Seeding phone data into all map-section rows...");
    const updateRes = await client.query(`
      UPDATE components_contact_map_sections
      SET phone          = $1,
          phone_secondary = $2
      RETURNING id, location_name
    `, [PHONE_PRIMARY, PHONE_SECONDARY]);

    if (updateRes.rowCount === 0) {
      console.log("  [WARN] No map-section rows found");
    } else {
      updateRes.rows.forEach(r =>
        console.log(`  [OK] Updated map-section id=${r.id} ("${r.location_name || 'no name'}")`),
      );
    }
    console.log("");

    // ── STEP 3: Verify contact_pages link (draft + published) ──────────────
    console.log("STEP 3: Verifying contact_pages_cmps links for map-section...");
    const links = await client.query(`
      SELECT
        cpc.entity_id,
        cpc.cmp_id,
        cpc.component_type,
        cp.published_at,
        ms.phone,
        ms.phone_secondary
      FROM contact_pages_cmps cpc
      JOIN contact_pages cp ON cp.id = cpc.entity_id
      JOIN components_contact_map_sections ms ON ms.id = cpc.cmp_id
      WHERE cpc.component_type = 'contact.map-section'
      ORDER BY cp.published_at DESC NULLS LAST
    `);

    if (links.rowCount === 0) {
      console.log("  [WARN] No contact.map-section rows found in contact_pages_cmps");
    } else {
      links.rows.forEach(r => {
        const status = r.published_at ? 'PUBLISHED' : 'DRAFT';
        console.log(`  [${status}] entity_id=${r.entity_id}, cmp_id=${r.cmp_id}`);
        console.log(`           phone=${r.phone}, phone_secondary=${r.phone_secondary}`);
      });
    }
    console.log("");

    // ── STEP 4: Ensure draft contact_pages row exists (V5 pattern) ─────────
    console.log("STEP 4: Checking draft/published contact_pages rows...");
    const allContactPages = await client.query(`
      SELECT id,
             document_id,
             CASE WHEN published_at IS NULL THEN 'DRAFT' ELSE 'PUBLISHED' END AS status
      FROM contact_pages
      ORDER BY published_at DESC NULLS LAST
    `);
    allContactPages.rows.forEach(r =>
      console.log(`  [${r.status}] id=${r.id}, document_id=${r.document_id}`),
    );
    console.log("");

    // ── STEP 5: Link map-section to draft row if missing ───────────────────
    console.log("STEP 5: Ensuring draft row has map-section linked...");
    const pubRow = await client.query(
      `SELECT id, document_id FROM contact_pages WHERE published_at IS NOT NULL ORDER BY id DESC LIMIT 1`,
    );
    if (pubRow.rowCount === 0) {
      console.log("  [WARN] No published contact_pages found — skipping draft sync");
    } else {
      const pub = pubRow.rows[0];
      const draftRow = await client.query(
        `SELECT id FROM contact_pages WHERE document_id = $1 AND published_at IS NULL LIMIT 1`,
        [pub.document_id],
      );

      if (draftRow.rowCount === 0) {
        console.log(`  [WARN] No draft row found for document_id=${pub.document_id}`);
        console.log("  → Run migration 121 first to create the draft row");
      } else {
        const draftId = draftRow.rows[0].id;
        // Check if draft already has map-section
        const draftMapLink = await client.query(
          `SELECT id FROM contact_pages_cmps WHERE entity_id = $1 AND component_type = 'contact.map-section'`,
          [draftId],
        );

        if (draftMapLink.rowCount > 0) {
          console.log(`  [OK] Draft id=${draftId} already has map-section linked`);
          // Update the cmp directly since both draft+published share same cmp_id for map-section
          const mapCmpId = draftMapLink.rows[0].id;
          console.log(`       Phones already seeded via STEP 2`);
        } else {
          // Get pub map-section cmp_id
          const pubMapLink = await client.query(
            `SELECT cmp_id, field, "order" FROM contact_pages_cmps WHERE entity_id = $1 AND component_type = 'contact.map-section' LIMIT 1`,
            [pub.id],
          );
          if (pubMapLink.rowCount > 0) {
            const { cmp_id, field, order } = pubMapLink.rows[0];
            await client.query(
              `INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, 'contact.map-section', $3, $4)`,
              [draftId, cmp_id, field, order],
            );
            console.log(`  [OK] Linked map-section cmp_id=${cmp_id} → draft id=${draftId}`);
          } else {
            console.log(`  [WARN] Published row has no map-section cmp either`);
          }
        }
      }
    }
    console.log("");

    // ── STEP 6: Final verification ─────────────────────────────────────────
    console.log("STEP 6: Final verification...");
    const verify = await client.query(`
      SELECT id, phone, phone_secondary, location_name
      FROM components_contact_map_sections
      ORDER BY id
    `);
    verify.rows.forEach(r =>
      console.log(`  map-section id=${r.id}: phone="${r.phone}", secondary="${r.phone_secondary}", location="${r.location_name}"`)
    );
    console.log("");

    console.log("=".repeat(70));
    console.log("MIGRATION 122 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi (if not running): cd strapi-cms && npm run develop");
    console.log("  2. Open Strapi Admin → Contact Page → Map Section");
    console.log("     → phone and phone_secondary fields should now appear");
    console.log("  3. Save & Publish the Contact Page\n");

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
