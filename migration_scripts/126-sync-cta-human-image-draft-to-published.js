#!/usr/bin/env node

/**
 * Migration 126: Sync about-page CTA human_image from draft to published
 *
 * Root cause (per .ai/strapi_v5_draft_publish_bug.md):
 *   Strapi v5 Draft & Publish stores TWO rows per document. When you upload
 *   a media file and Save (not Publish), the files_related_mph link is only
 *   created for the DRAFT component row. The PUBLISHED component row has no
 *   media relation — so the public API returns null for the image.
 *
 * Fix: Copy the human_image media relation from the DRAFT CTA component
 *      to the PUBLISHED CTA component.
 *
 * Run: node migration_scripts/126-sync-cta-human-image-draft-to-published.js
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

async function run() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 126: Sync CTA human_image draft → published");
  console.log("=".repeat(70));

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // STEP 1: Check all CTA component rows and their media relations
    console.log("STEP 1: Checking components_about_ctas...");
    const ctaRows = await client.query(
      "SELECT id FROM components_about_ctas ORDER BY id"
    );
    console.log(`  [INFO] Found ${ctaRows.rows.length} CTA component rows:`, ctaRows.rows.map(r => r.id));

    // STEP 2: Check existing media relations for human_image
    console.log("\nSTEP 2: Checking files_related_mph for human_image...");
    const mediaRelations = await client.query(`
      SELECT frm.id, frm.file_id, frm.related_id, frm.related_type, frm.field
      FROM files_related_mph frm
      WHERE frm.related_type = 'about.cta'
      AND frm.field = 'human_image'
      ORDER BY frm.related_id
    `);
    console.log(`  [INFO] Found ${mediaRelations.rows.length} human_image media relations:`);
    mediaRelations.rows.forEach(r => {
      console.log(`    → id=${r.id}, file_id=${r.file_id}, related_id=${r.related_id}`);
    });

    if (mediaRelations.rows.length === 0) {
      console.log("  [WARN] No human_image relation found. Please upload the image in Strapi admin first, then re-run this script.");
      return;
    }

    // STEP 3: Find which CTA IDs are linked vs not
    const linkedIds = new Set(mediaRelations.rows.map(r => r.related_id));
    const unlinkedCTAs = ctaRows.rows.filter(r => !linkedIds.has(r.id));
    console.log(`\nSTEP 3: CTA rows WITHOUT human_image relation: ${unlinkedCTAs.map(r => r.id).join(', ') || 'none'}`);

    if (unlinkedCTAs.length === 0) {
      console.log("  [OK] All CTA rows already have human_image relation — nothing to sync.");
    } else {
      // Use the first found relation as the source (the draft's file_id)
      const sourceRelation = mediaRelations.rows[0];
      const fileId = sourceRelation.file_id;
      console.log(`  [INFO] Syncing file_id=${fileId} to unlinked CTA rows...`);

      for (const cta of unlinkedCTAs) {
        // Check if relation already exists to avoid duplicate
        const exists = await client.query(`
          SELECT id FROM files_related_mph
          WHERE related_type = 'about.cta'
          AND field = 'human_image'
          AND related_id = $1
        `, [cta.id]);

        if (exists.rows.length > 0) {
          console.log(`  [SKIP] CTA id=${cta.id} already has human_image relation`);
          continue;
        }

        await client.query(`
          INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
          VALUES ($1, $2, 'about.cta', 'human_image', 0)
        `, [fileId, cta.id]);
        console.log(`  [OK] Linked file_id=${fileId} to CTA id=${cta.id} (published row)`);
      }
    }

    // STEP 4: Also check background_image and sync if needed
    console.log("\nSTEP 4: Checking background_image sync...");
    const bgRelations = await client.query(`
      SELECT frm.file_id, frm.related_id
      FROM files_related_mph frm
      WHERE frm.related_type = 'about.cta'
      AND frm.field = 'background_image'
    `);
    const bgLinkedIds = new Set(bgRelations.rows.map(r => r.related_id));
    const bgUnlinked = ctaRows.rows.filter(r => !bgLinkedIds.has(r.id));

    if (bgRelations.rows.length > 0 && bgUnlinked.length > 0) {
      const bgSource = bgRelations.rows[0];
      for (const cta of bgUnlinked) {
        await client.query(`
          INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
          VALUES ($1, $2, 'about.cta', 'background_image', 0)
          ON CONFLICT DO NOTHING
        `, [bgSource.file_id, cta.id]);
        console.log(`  [OK] Synced background_image to CTA id=${cta.id}`);
      }
    } else {
      console.log("  [OK] background_image already in sync or not set");
    }

    // STEP 5: Verify
    console.log("\nSTEP 5: Verification...");
    const verify = await client.query(`
      SELECT frm.related_id, frm.field, f.name, f.url
      FROM files_related_mph frm
      JOIN files f ON f.id = frm.file_id
      WHERE frm.related_type = 'about.cta'
      ORDER BY frm.related_id, frm.field
    `);
    console.log("  Media relations for about.cta:");
    verify.rows.forEach(r => {
      console.log(`    CTA id=${r.related_id}, field=${r.field}: ${r.name} (${r.url})`);
    });

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 126 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Clear Next.js cache: rm -rf dental-frontend/.next");
    console.log("  2. Restart dev server: cd dental-frontend && npm run dev");
    console.log("  3. Refresh the About Us page — human image should now appear\n");
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
