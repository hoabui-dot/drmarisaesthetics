#!/usr/bin/env node

/**
 * Migration Script 089: Remove Legacy Service Pages from Page Collection
 *
 * Background:
 *   The Page collection in Strapi CMS originally housed 4 service pages that are
 *   now superseded by dedicated, hardcoded Next.js service pages:
 *     - slug "implant"     → /dental-implants
 *     - slug "invisalign"  → /dental-braces
 *     - slug "veneer"      → /dental-veneers-cost
 *     - slug "whitening"   → /dental-bleaching
 *
 *   Each service page exists as both a draft row and a published row in the `pages`
 *   table (8 rows total). This script removes them cleanly.
 *
 * Changes:
 *   1. Delete media file references (files_related_mph) for the 8 legacy rows
 *   2. Delete the 8 legacy rows from the `pages` table
 *   3. Verify cleanup
 *
 * Run (dev — defaults to remote DB):
 *   node migration_scripts/089-remove-legacy-service-pages.js
 *
 * Run (explicit):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 \
 *   DATABASE_NAME=dental_cms_strapi DATABASE_USERNAME=postgres DATABASE_PASSWORD=postgres \
 *   node migration_scripts/089-remove-legacy-service-pages.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

// The 4 legacy service slugs to remove
const LEGACY_SLUGS = ["implant", "invisalign", "veneer", "whitening"];

// Document IDs (one document_id may have multiple rows: draft + published)
const LEGACY_DOCUMENT_IDS = [
  "hb35tutan83jujp167hzg9qp", // Dental Implants
  "tu6u4ixbk6v4bji8xgaw9n0c", // Invisalign Clear Aligners
  "gi8abtfhwzedhw0rr1x3fyh9", // Cosmetic Dental Crowns
  "c6dw19ycxpgipilt6xanhz3z", // Teeth Whitening
];

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 089: Remove Legacy Service Pages from Page Collection");
  console.log("=".repeat(70));
  console.log(`\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`);

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Preview what will be deleted ──────────────────────────────
    console.log("STEP 1: Previewing legacy pages to delete...");
    const preview = await client.query(
      `SELECT id, title, slug, document_id,
              CASE WHEN published_at IS NOT NULL THEN 'published' ELSE 'draft' END as state
       FROM pages
       WHERE slug = ANY($1)
       ORDER BY slug, id`,
      [LEGACY_SLUGS]
    );
    console.log(`  Found ${preview.rows.length} rows to delete:`);
    preview.rows.forEach((r) => {
      console.log(`    [${r.state.toUpperCase()}] ID=${r.id} slug="${r.slug}" doc_id="${r.document_id}"`);
    });

    if (preview.rows.length === 0) {
      console.log("  Nothing to delete. Migration may have already been run.\n");
      return;
    }

    const pageIds = preview.rows.map((r) => r.id);
    console.log(`\n  Page IDs to delete: [${pageIds.join(", ")}]\n`);

    // ── STEP 2: Delete media references ──────────────────────────────────
    console.log("STEP 2: Removing media file references (files_related_mph)...");
    const mediaResult = await client.query(
      `DELETE FROM files_related_mph
       WHERE related_type = 'api::page.page'
       AND related_id = ANY($1)`,
      [pageIds]
    );
    console.log(`  [OK] Deleted ${mediaResult.rowCount} media reference(s)\n`);

    // ── STEP 3: Delete the pages ──────────────────────────────────────────
    console.log("STEP 3: Deleting legacy rows from `pages` table...");
    const deleteResult = await client.query(
      `DELETE FROM pages WHERE id = ANY($1)`,
      [pageIds]
    );
    console.log(`  [OK] Deleted ${deleteResult.rowCount} page row(s)\n`);

    // ── STEP 4: Verify result ─────────────────────────────────────────────
    console.log("STEP 4: Verifying cleanup...");

    const remaining = await client.query(
      `SELECT COUNT(*) as total FROM pages WHERE slug = ANY($1)`,
      [LEGACY_SLUGS]
    );
    const remainingCount = parseInt(remaining.rows[0].total);

    if (remainingCount === 0) {
      console.log("  [OK] No legacy service pages remain in the pages table\n");
    } else {
      console.warn(`  [WARN] ${remainingCount} rows still found — check manually\n`);
    }

    const allPages = await client.query(
      `SELECT id, title, slug, CASE WHEN published_at IS NOT NULL THEN 'published' ELSE 'draft' END as state
       FROM pages ORDER BY id`
    );
    console.log(`  Remaining pages in collection (${allPages.rows.length} rows):`);
    allPages.rows.forEach((r) => {
      console.log(`    [${r.state.toUpperCase()}] ID=${r.id} slug="${r.slug}" — ${r.title}`);
    });

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 089 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Delete dental-frontend/src/app/services/[slug]/ directory");
    console.log("  2. Run: cd dental-frontend && npm run build");
    console.log("  3. Verify /dental-implants still works in browser\n");
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
