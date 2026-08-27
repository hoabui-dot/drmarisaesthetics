#!/usr/bin/env node
/**
 * Migration Script 087: Fix Contact FAQ Data
 *
 * Diagnosis:
 *  - Draft contact page (id=6)    → faq_section id=8  → question id=26: "fasd" (test data)
 *  - Published contact page (id=59) → faq_section id=10 → question id=27: "fasd" (test data)
 *  - faq_section id=3 with real questions (ids 11,12,13) is ORPHANED (not linked to any page)
 *
 * Fix:
 *  1. Remove test "fasd" question from faq_section id=8 (draft)
 *  2. Remove test "fasd" question from faq_section id=10 (published)
 *  3. Add subtitle to both faq sections
 *  4. Insert 5 real FAQ questions linked to draft faq_section (id=8)
 *  5. Insert 5 real FAQ questions linked to published faq_section (id=10)
 *  6. Clean up orphaned faq_section id=3 and its questions
 *
 * Run:
 *   node migration_scripts/087-fix-contact-faq-data.js
 */

const { Client } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../strapi-cms/.env") });

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

const FAQ_QUESTIONS = [
  {
    q: "What is the best option for missing teeth?",
    a: "Dental implants are often the best long-term solution as they replace both the root and crown, providing stability and preventing bone loss.",
  },
  {
    q: "How long do porcelain crowns last?",
    a: "With proper care, porcelain crowns can last from 10–20 years or even longer.",
  },
  {
    q: "How much do porcelain crowns cost?",
    a: "The cost depends on the material and case complexity. We offer various options to suit different budgets while maintaining high quality.",
  },
  {
    q: "How much does a dental implant cost?",
    a: "Implant costs vary based on the implant brand, bone condition, and treatment plan. A detailed quote will be provided after consultation.",
  },
  {
    q: "Is the procedure painful?",
    a: "Modern techniques and anesthesia ensure minimal discomfort during and after the procedure.",
  },
];

const FAQ_SUBTITLE =
  "Find answers to your common dental concerns and clinic procedures.";

async function migrate() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION 087: Fix Contact FAQ Data");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    await client.query("BEGIN");

    // ── STEP 1: Verify current state ──────────────────────────────────────
    console.log("STEP 1: Verifying current state...");

    const draftPage = await client.query(
      "SELECT id FROM contact_pages WHERE published_at IS NULL ORDER BY id LIMIT 1",
    );
    const publishedPage = await client.query(
      "SELECT id FROM contact_pages WHERE published_at IS NOT NULL ORDER BY id LIMIT 1",
    );

    if (draftPage.rows.length === 0 || publishedPage.rows.length === 0) {
      throw new Error(
        "Could not find draft and/or published contact page records.",
      );
    }

    const draftPageId = draftPage.rows[0].id;
    const publishedPageId = publishedPage.rows[0].id;
    console.log(`  Draft contact page id:     ${draftPageId}`);
    console.log(`  Published contact page id: ${publishedPageId}`);

    // Get linked faq section IDs
    const draftFaqLink = await client.query(
      "SELECT cmp_id FROM contact_pages_cmps WHERE entity_id = $1 AND field = 'faq'",
      [draftPageId],
    );
    const publishedFaqLink = await client.query(
      "SELECT cmp_id FROM contact_pages_cmps WHERE entity_id = $1 AND field = 'faq'",
      [publishedPageId],
    );

    if (draftFaqLink.rows.length === 0 || publishedFaqLink.rows.length === 0) {
      throw new Error(
        "FAQ link not found in contact_pages_cmps. Run migration 086 first.",
      );
    }

    const draftFaqSectionId = draftFaqLink.rows[0].cmp_id;
    const publishedFaqSectionId = publishedFaqLink.rows[0].cmp_id;
    console.log(`  Draft faq_section id:      ${draftFaqSectionId}`);
    console.log(`  Published faq_section id:  ${publishedFaqSectionId}`);
    console.log("  [OK] State verified\n");

    // ── STEP 2: Clean up test data from draft faq section ─────────────────
    console.log(
      `STEP 2: Cleaning up test data from draft faq_section (id=${draftFaqSectionId})...`,
    );
    const draftItems = await client.query(
      "SELECT cmp_id FROM components_contact_faqs_cmps WHERE entity_id = $1",
      [draftFaqSectionId],
    );
    const draftItemIds = draftItems.rows.map((r) => r.cmp_id);
    console.log(
      `  Found ${draftItemIds.length} existing items: [${draftItemIds.join(", ")}]`,
    );

    if (draftItemIds.length > 0) {
      await client.query(
        "DELETE FROM components_contact_faqs_cmps WHERE entity_id = $1",
        [draftFaqSectionId],
      );
      await client.query(
        "DELETE FROM components_contact_faq_items WHERE id = ANY($1)",
        [draftItemIds],
      );
      console.log(
        `  [OK] Removed ${draftItemIds.length} stale items from draft`,
      );
    }

    // ── STEP 3: Clean up test data from published faq section ─────────────
    console.log(
      `STEP 3: Cleaning up test data from published faq_section (id=${publishedFaqSectionId})...`,
    );
    const pubItems = await client.query(
      "SELECT cmp_id FROM components_contact_faqs_cmps WHERE entity_id = $1",
      [publishedFaqSectionId],
    );
    const pubItemIds = pubItems.rows.map((r) => r.cmp_id);
    console.log(
      `  Found ${pubItemIds.length} existing items: [${pubItemIds.join(", ")}]`,
    );

    if (pubItemIds.length > 0) {
      await client.query(
        "DELETE FROM components_contact_faqs_cmps WHERE entity_id = $1",
        [publishedFaqSectionId],
      );
      await client.query(
        "DELETE FROM components_contact_faq_items WHERE id = ANY($1)",
        [pubItemIds],
      );
      console.log(
        `  [OK] Removed ${pubItemIds.length} stale items from published`,
      );
    }

    // ── STEP 4: Update subtitle on both faq sections ──────────────────────
    console.log("STEP 4: Updating faq section subtitle...");
    await client.query(
      "UPDATE components_contact_faqs SET subtitle = $1 WHERE id = ANY($2)",
      [FAQ_SUBTITLE, [draftFaqSectionId, publishedFaqSectionId]],
    );
    console.log("  [OK] Subtitle updated\n");

    // ── STEP 5: Insert real FAQ items for DRAFT section ───────────────────
    console.log(
      `STEP 5: Inserting ${FAQ_QUESTIONS.length} real FAQ items into draft faq_section (id=${draftFaqSectionId})...`,
    );
    for (let i = 0; i < FAQ_QUESTIONS.length; i++) {
      const { q, a } = FAQ_QUESTIONS[i];
      const itemRes = await client.query(
        "INSERT INTO components_contact_faq_items (question, answer) VALUES ($1, $2) RETURNING id",
        [q, a],
      );
      const itemId = itemRes.rows[0].id;
      await client.query(
        'INSERT INTO components_contact_faqs_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, $3, $4, $5)',
        [draftFaqSectionId, itemId, "contact.faq-item", "questions", i + 1],
      );
      console.log(
        `  [${i + 1}] "${q.substring(0, 50)}..." → item id=${itemId}`,
      );
    }
    console.log("  [OK] Draft FAQ items inserted\n");

    // ── STEP 6: Insert real FAQ items for PUBLISHED section ───────────────
    console.log(
      `STEP 6: Inserting ${FAQ_QUESTIONS.length} real FAQ items into published faq_section (id=${publishedFaqSectionId})...`,
    );
    for (let i = 0; i < FAQ_QUESTIONS.length; i++) {
      const { q, a } = FAQ_QUESTIONS[i];
      const itemRes = await client.query(
        "INSERT INTO components_contact_faq_items (question, answer) VALUES ($1, $2) RETURNING id",
        [q, a],
      );
      const itemId = itemRes.rows[0].id;
      await client.query(
        'INSERT INTO components_contact_faqs_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, $3, $4, $5)',
        [publishedFaqSectionId, itemId, "contact.faq-item", "questions", i + 1],
      );
      console.log(
        `  [${i + 1}] "${q.substring(0, 50)}..." → item id=${itemId}`,
      );
    }
    console.log("  [OK] Published FAQ items inserted\n");

    // ── STEP 7: Clean up orphaned faq_section id=3 ───────────────────────
    console.log(
      "STEP 7: Cleaning up orphaned faq_section id=3 and its items...",
    );
    const orphanedItems = await client.query(
      "SELECT cmp_id FROM components_contact_faqs_cmps WHERE entity_id = 3",
    );
    const orphanedIds = orphanedItems.rows.map((r) => r.cmp_id);
    if (orphanedIds.length > 0) {
      await client.query(
        "DELETE FROM components_contact_faqs_cmps WHERE entity_id = 3",
      );
      await client.query(
        "DELETE FROM components_contact_faq_items WHERE id = ANY($1)",
        [orphanedIds],
      );
    }
    await client.query("DELETE FROM components_contact_faqs WHERE id = 3");
    console.log(
      `  [OK] Removed orphaned faq_section id=3 and ${orphanedIds.length} items\n`,
    );

    // ── STEP 8: Verify ────────────────────────────────────────────────────
    console.log("STEP 8: Verifying final state...");

    const finalDraft = await client.query(
      `SELECT f.id, f.title, f.subtitle, COUNT(c.id) as question_count
       FROM components_contact_faqs f
       LEFT JOIN components_contact_faqs_cmps c ON c.entity_id = f.id
       WHERE f.id = $1
       GROUP BY f.id`,
      [draftFaqSectionId],
    );
    const finalPub = await client.query(
      `SELECT f.id, f.title, f.subtitle, COUNT(c.id) as question_count
       FROM components_contact_faqs f
       LEFT JOIN components_contact_faqs_cmps c ON c.entity_id = f.id
       WHERE f.id = $1
       GROUP BY f.id`,
      [publishedFaqSectionId],
    );

    console.log(`  Draft faq_section:`, JSON.stringify(finalDraft.rows[0]));
    console.log(`  Published faq_section:`, JSON.stringify(finalPub.rows[0]));

    await client.query("COMMIT");

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 087 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Start Strapi CMS: cd strapi-cms && npm run develop");
    console.log(
      "  2. Verify FAQ data in Strapi admin at https://guild-biblical-expectations-easily.trycloudflare.com/admin",
    );
    console.log("  3. Start frontend: cd dental-frontend && npm run dev");
    console.log("  4. Check contact page at http://localhost:3000/contact\n");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("\n[ERROR] Transaction rolled back:", err.message);
    if (err.detail) console.error("[DETAIL]", err.detail);
    process.exit(1);
  } finally {
    await client.end();
    console.log("[OK] Connection closed");
  }
}

migrate();
