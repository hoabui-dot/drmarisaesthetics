#!/usr/bin/env node

/**
 * Migration Script 088: Fix Papers Section — Clean Duplicates & Use Proper Newspaper Logos
 *
 * Changes:
 *  1. Remove duplicate paper items 26-30 and their media relations
 *  2. Set proper newspaper logo images for paper items 1-5 using files already in Strapi:
 *     - Item 1 (Báo Phụ Nữ / NLD)          → file 58 (bao-nguoi-lao-dong.jpg)
 *     - Item 2 (Báo Gia Đình & Tiêu Dùng)  → file 56 (bao-gia-dinh.jpg)
 *     - Item 3 (Báo Doanh Nhân & Đời Sống) → file 55 (bao-doanh-nhan-va-doi-song.jpg)
 *     - Item 4 (Báo Doanh Nhân Sài Gòn)    → file 57 (bao-doanh-nhan-sai-gon.jpg)
 *     - Item 5 (Báo Doanh Nhân & Đời Sống) → file 55 (bao-doanh-nhan-va-doi-song.jpg)
 *
 * Run:
 *   node migration_scripts/088-fix-papers-slider-images.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

// Paper item ID → proper newspaper logo file ID mapping
const PAPER_LOGO_MAP = [
  { paperId: 1, fileId: 58, name: "Báo Phụ Nữ (NLD)" },
  { paperId: 2, fileId: 56, name: "Báo Gia Đình & Tiêu Dùng" },
  { paperId: 3, fileId: 55, name: "Báo Doanh Nhân & Đời Sống" },
  { paperId: 4, fileId: 57, name: "Báo Doanh Nhân Sài Gòn" },
  { paperId: 5, fileId: 55, name: "Báo Doanh Nhân & Đời Sống" },
];

const DUPLICATE_IDS = [26, 27, 28, 29, 30];

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 088: Fix Papers Section Images");
  console.log("=".repeat(70));
  console.log(`\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`);

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    await client.query("BEGIN");

    // ── STEP 1: Remove duplicate paper items 26-30 ──────────────────────────
    console.log("STEP 1: Removing duplicate paper items (IDs 26-30)...");

    const delRelations = await client.query(
      `DELETE FROM files_related_mph
       WHERE related_type = 'homepage.paper-item'
         AND related_id = ANY($1)`,
      [DUPLICATE_IDS]
    );
    console.log(`  [OK] Deleted ${delRelations.rowCount} stale media relations for duplicates`);

    // Also remove from homepage_cmps links if any reference duplicates
    const delCmps = await client.query(
      `DELETE FROM components_homepage_papers_sections_cmps
       WHERE cmp_id = ANY($1)`,
      [DUPLICATE_IDS]
    );
    console.log(`  [OK] Deleted ${delCmps.rowCount} papers_sections_cmps links for duplicates`);

    const delItems = await client.query(
      `DELETE FROM components_homepage_paper_items WHERE id = ANY($1)`,
      [DUPLICATE_IDS]
    );
    console.log(`  [OK] Deleted ${delItems.rowCount} duplicate paper item rows\n`);

    // ── STEP 2: Fix media relations for items 1-5 ───────────────────────────
    console.log("STEP 2: Setting proper newspaper logo images for items 1-5...");

    for (const { paperId, fileId, name } of PAPER_LOGO_MAP) {
      // Delete any existing relation for this paper item
      await client.query(
        `DELETE FROM files_related_mph
         WHERE related_type = 'homepage.paper-item'
           AND related_id = $1
           AND field = 'image'`,
        [paperId]
      );

      // Insert correct relation
      await client.query(
        `INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
         VALUES ($1, $2, 'homepage.paper-item', 'image', 1)`,
        [fileId, paperId]
      );

      console.log(`  [OK] Paper ${paperId} (${name}) → file ${fileId}`);
    }
    console.log();

    // ── STEP 3: Verify homepage links use items 1-5 ─────────────────────────
    console.log("STEP 3: Verifying homepage paper links...");
    const linkedItems = await client.query(
      `SELECT c.cmp_id, p.name
       FROM components_homepage_papers_sections_cmps c
       JOIN components_homepage_paper_items p ON p.id = c.cmp_id
       ORDER BY c."order"`
    );
    if (linkedItems.rowCount === 0) {
      console.log("  [WARN] No paper items linked to papers section — checking alt table name...");
      const altCheck = await client.query(
        `SELECT tablename FROM pg_tables
         WHERE tablename ILIKE '%papers_section%papers%'`
      );
      console.log("  Alt tables:", altCheck.rows.map((r) => r.tablename).join(", ") || "none found");
    } else {
      linkedItems.rows.forEach((r) =>
        console.log(`  - Paper cmp_id=${r.cmp_id}: ${r.name}`)
      );
    }
    console.log();

    // ── STEP 4: Verify final state ──────────────────────────────────────────
    console.log("STEP 4: Final verification...");
    const finalPapers = await client.query(
      `SELECT p.id, p.name, f.url AS image_url
       FROM components_homepage_paper_items p
       LEFT JOIN files_related_mph rel
         ON rel.related_id = p.id
        AND rel.related_type = 'homepage.paper-item'
        AND rel.field = 'image'
       LEFT JOIN files f ON f.id = rel.file_id
       ORDER BY p.id`
    );
    console.log("  Remaining paper items:");
    finalPapers.rows.forEach((r) =>
      console.log(`  [${r.id}] ${r.name} → ${r.image_url || "NO IMAGE"}`)
    );

    await client.query("COMMIT");

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 088 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi CMS (if running) to clear any caches.");
    console.log("  2. Start dental-frontend and verify the Papers slider renders newspaper logos.");
    console.log("  3. Ensure clicking each logo opens the correct article URL.\n");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("\n[ERROR]", err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log("[OK] Connection closed");
  }
}

run();
