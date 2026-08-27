#!/usr/bin/env node

/**
 * Migration Script 092: Replace Contact Page CTA with Homepage CTA
 *
 * Changes:
 *  1. Drop contact.final-cta component tables
 *  2. Update contact_pages schema to use homepage.cta component
 *  3. Create new CTA data using homepage.cta structure
 *
 * Run (dev):
 *   node migration_scripts/092-replace-contact-cta-with-homepage-cta.js
 *
 * Run (production):
 *   DATABASE_HOST=100.68.50.41 DATABASE_PORT=5437 DATABASE_NAME=dental_cms_strapi \
 *   DATABASE_USERNAME=postgres DATABASE_PASSWORD=postgres \
 *   node migration_scripts/092-replace-contact-cta-with-homepage-cta.js
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
  console.log("MIGRATION 092: Replace Contact Page CTA with Homepage CTA");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check current contact_pages structure ────────────────────
    console.log("STEP 1: Checking current contact_pages structure...");
    const checkContactPages = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'contact_pages'
      ORDER BY ordinal_position
    `);
    console.log(
      `  [INFO] Found ${checkContactPages.rows.length} columns in contact_pages`,
    );
    console.log(
      "  [INFO] Current columns:",
      checkContactPages.rows.map((r) => r.column_name).join(", "),
    );

    // ── STEP 2: Get existing contact page data ───────────────────────────
    console.log("\nSTEP 2: Getting existing contact page data...");
    const existingData = await client.query(`
      SELECT id, document_id, published_at
      FROM contact_pages
      ORDER BY id
    `);
    console.log(
      `  [INFO] Found ${existingData.rows.length} contact page records`,
    );

    if (existingData.rows.length === 0) {
      console.log(
        "  [WARNING] No contact page records found. Skipping data migration.",
      );
    }

    // ── STEP 3: Remove old final_cta link from contact_pages_cmps ────────
    console.log(
      "\nSTEP 3: Removing old final_cta links from contact_pages_cmps...",
    );
    const deleteFinalCtaLinks = await client.query(`
      DELETE FROM contact_pages_cmps
      WHERE component_type = 'contact.final-cta'
      AND field = 'final_cta'
      RETURNING id
    `);
    console.log(
      `  [OK] Deleted ${deleteFinalCtaLinks.rowCount} final_cta link records`,
    );

    // ── STEP 4: Drop old final-cta component table ───────────────────────
    console.log("\nSTEP 4: Dropping old final-cta component table...");
    await client.query(`
      DROP TABLE IF EXISTS components_contact_final_ctas CASCADE
    `);
    console.log("  [OK] Dropped components_contact_final_ctas table");

    // ── STEP 5: Create new homepage.cta component records ────────────────
    console.log("\nSTEP 5: Creating new homepage.cta component records...");

    // Check if components_homepage_ctas table exists
    const ctaTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'components_homepage_ctas'
      )
    `);

    if (!ctaTableCheck.rows[0].exists) {
      console.log("  [INFO] Creating components_homepage_ctas table...");
      await client.query(`
        CREATE TABLE components_homepage_ctas (
          id SERIAL PRIMARY KEY,
          heading TEXT NOT NULL DEFAULT 'Niềng răng bằng khay trong suốt có phù hợp với tình trạng răng của bạn?',
          highlight_text VARCHAR(255),
          button_label VARCHAR(255) NOT NULL DEFAULT 'Đăng ký ngay',
          button_link VARCHAR(255) NOT NULL DEFAULT '/contact'
        )
      `);
      console.log("  [OK] Created components_homepage_ctas table");
    }

    // Insert new CTA data for contact page
    const insertCta = await client.query(`
      INSERT INTO components_homepage_ctas (
        heading,
        highlight_text,
        button_label,
        button_link
      ) VALUES (
        'Ready to Transform Your Smile?',
        'Transform',
        'Book Consultation',
        '/contact'
      )
      RETURNING id
    `);
    const newCtaId = insertCta.rows[0].id;
    console.log(
      `  [OK] Created new homepage.cta component with ID: ${newCtaId}`,
    );

    // ── STEP 6: Link new CTA to contact pages ────────────────────────────
    console.log("\nSTEP 6: Linking new CTA to contact pages...");

    for (const page of existingData.rows) {
      await client.query(
        `
        INSERT INTO contact_pages_cmps (
          entity_id,
          cmp_id,
          component_type,
          field,
          "order"
        ) VALUES (
          $1,
          $2,
          'homepage.cta',
          'final_cta',
          1
        )
      `,
        [page.id, newCtaId],
      );
      console.log(`  [OK] Linked CTA to contact page ID: ${page.id}`);
    }

    // ── STEP 7: Verify results ────────────────────────────────────────────
    console.log("\nSTEP 7: Verifying results...");

    const verifyLinks = await client.query(`
      SELECT 
        cp.id as page_id,
        cp.document_id,
        cpc.component_type,
        cpc.field,
        cpc.cmp_id,
        hc.heading,
        hc.button_label
      FROM contact_pages cp
      LEFT JOIN contact_pages_cmps cpc ON cp.id = cpc.entity_id AND cpc.field = 'final_cta'
      LEFT JOIN components_homepage_ctas hc ON cpc.cmp_id = hc.id
      ORDER BY cp.id
    `);

    console.log(`  [INFO] Verification results:`);
    for (const row of verifyLinks.rows) {
      console.log(`    Page ID ${row.page_id}:`);
      console.log(`      - Component: ${row.component_type || "NONE"}`);
      console.log(`      - CTA ID: ${row.cmp_id || "NONE"}`);
      console.log(`      - Heading: ${row.heading || "NONE"}`);
      console.log(`      - Button: ${row.button_label || "NONE"}`);
    }

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 092 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log(
      "  1. Update strapi-cms/src/api/contact-page/content-types/contact-page/schema.json",
    );
    console.log(
      "     Change final_cta component from 'contact.final-cta' to 'homepage.cta'",
    );
    console.log("  2. Delete strapi-cms/src/components/contact/final-cta.json");
    console.log("  3. Restart Strapi: cd strapi-cms && npm run develop");
    console.log(
      "  4. Update frontend ContactPageClient.tsx to use CTABlock component",
    );
    console.log("  5. Update dental-frontend/src/types/strapi.ts types\n");
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
