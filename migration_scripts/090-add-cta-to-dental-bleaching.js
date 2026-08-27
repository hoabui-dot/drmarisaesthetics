#!/usr/bin/env node

/**
 * Migration Script 090: Add CTA Section to Dental Bleaching Page
 *
 * Changes:
 *  1. Create dental-bleaching CTA component table
 *  2. Create dental-bleaching single type table (if not exists)
 *  3. Add CTA data matching homepage CTA structure
 *  4. Link CTA component to dental-bleaching page
 *
 * Run (dev):
 *   node migration_scripts/090-add-cta-to-dental-bleaching.js
 *
 * Run (production):
 *   DATABASE_HOST=<h> DATABASE_PORT=<p> DATABASE_NAME=<db> \
 *   DATABASE_USERNAME=<u> DATABASE_PASSWORD=<pw> \
 *   node migration_scripts/090-add-cta-to-dental-bleaching.js
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
  console.log("MIGRATION 090: Add CTA Section to Dental Bleaching Page");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Create CTA component table ────────────────────────────────────
    console.log("STEP 1: Creating dental-bleaching CTA component table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_dental_bleaching_ctas (
        id SERIAL PRIMARY KEY,
        heading TEXT NOT NULL DEFAULT 'Ready to Start Your Dental Bleaching Journey?',
        highlight_text VARCHAR(255),
        button_label VARCHAR(255) NOT NULL DEFAULT 'Book a Consultation',
        button_link VARCHAR(255) NOT NULL DEFAULT '/contact'
      )
    `);

    console.log("  [OK] CTA component table created\n");

    // ── STEP 2: Create dental-bleaching single type table (if not exists) ─────
    console.log("STEP 2: Creating dental-bleaching single type table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS dental_bleachings (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(255) UNIQUE,
        title VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        published_at TIMESTAMP,
        created_by_id INTEGER,
        updated_by_id INTEGER,
        locale VARCHAR(255)
      )
    `);

    console.log("  [OK] Dental bleaching table created\n");

    // ── STEP 3: Create component link table ───────────────────────────────────
    console.log("STEP 3: Creating component link table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS dental_bleachings_cmps (
        id SERIAL PRIMARY KEY,
        entity_id INTEGER NOT NULL
          REFERENCES dental_bleachings(id)
          ON DELETE CASCADE,
        cmp_id INTEGER NOT NULL
          REFERENCES components_dental_bleaching_ctas(id)
          ON DELETE CASCADE,
        component_type VARCHAR(255) NOT NULL,
        field VARCHAR(255) NOT NULL,
        "order" DOUBLE PRECISION
      )
    `);

    console.log("  [OK] Component link table created\n");

    // ── STEP 4: Insert CTA data ───────────────────────────────────────────────
    console.log("STEP 4: Inserting CTA data...");

    const ctaResult = await client.query(`
      INSERT INTO components_dental_bleaching_ctas (
        heading,
        highlight_text,
        button_label,
        button_link
      ) VALUES (
        'Ready to Start Your Dental Bleaching Journey?',
        NULL,
        'Book a Consultation',
        '/contact'
      )
      RETURNING id
    `);

    const ctaId = ctaResult.rows[0].id;
    console.log(`  [OK] CTA component created with ID: ${ctaId}\n`);

    // ── STEP 5: Create or update dental-bleaching page ────────────────────────
    console.log("STEP 5: Creating/updating dental-bleaching page...");

    // Check if page exists
    const existingPage = await client.query(`
      SELECT id, document_id FROM dental_bleachings LIMIT 1
    `);

    let pageId;
    let documentId;

    if (existingPage.rows.length > 0) {
      pageId = existingPage.rows[0].id;
      documentId = existingPage.rows[0].document_id;
      console.log(`  [OK] Using existing page with ID: ${pageId}\n`);
    } else {
      // Create new page
      const crypto = require("crypto");
      documentId = crypto.randomBytes(12).toString("hex");

      const pageResult = await client.query(
        `
        INSERT INTO dental_bleachings (
          document_id,
          title,
          description,
          created_at,
          updated_at,
          published_at,
          locale
        ) VALUES (
          $1,
          'Dental Bleaching',
          'Professional teeth whitening services',
          NOW(),
          NOW(),
          NOW(),
          'en'
        )
        RETURNING id
      `,
        [documentId],
      );

      pageId = pageResult.rows[0].id;
      console.log(`  [OK] Created new page with ID: ${pageId}\n`);
    }

    // ── STEP 6: Link CTA to page ──────────────────────────────────────────────
    console.log("STEP 6: Linking CTA to dental-bleaching page...");

    // Check if link already exists
    const existingLink = await client.query(
      `
      SELECT id FROM dental_bleachings_cmps
      WHERE entity_id = $1 AND field = 'cta'
    `,
      [pageId],
    );

    if (existingLink.rows.length > 0) {
      // Update existing link
      await client.query(
        `
        UPDATE dental_bleachings_cmps
        SET cmp_id = $1,
            component_type = 'dental-bleaching.cta'
        WHERE entity_id = $2 AND field = 'cta'
      `,
        [ctaId, pageId],
      );
      console.log("  [OK] Updated existing CTA link\n");
    } else {
      // Create new link
      await client.query(
        `
        INSERT INTO dental_bleachings_cmps (
          entity_id,
          cmp_id,
          component_type,
          field,
          "order"
        ) VALUES (
          $1,
          $2,
          'dental-bleaching.cta',
          'cta',
          1
        )
      `,
        [pageId, ctaId],
      );
      console.log("  [OK] Created new CTA link\n");
    }

    // ── STEP 7: Verify results ────────────────────────────────────────────────
    console.log("STEP 7: Verifying results...");

    const verification = await client.query(
      `
      SELECT 
        db.id as page_id,
        db.title,
        cta.id as cta_id,
        cta.heading,
        cta.button_label
      FROM dental_bleachings db
      LEFT JOIN dental_bleachings_cmps link ON link.entity_id = db.id
      LEFT JOIN components_dental_bleaching_ctas cta ON cta.id = link.cmp_id
      WHERE db.id = $1
    `,
      [pageId],
    );

    if (verification.rows.length > 0) {
      const row = verification.rows[0];
      console.log("  Verification results:");
      console.log(`    Page ID: ${row.page_id}`);
      console.log(`    Page Title: ${row.title}`);
      console.log(`    CTA ID: ${row.cta_id}`);
      console.log(`    CTA Heading: ${row.heading}`);
      console.log(`    CTA Button: ${row.button_label}`);
      console.log("  [OK] Verification passed\n");
    } else {
      throw new Error("Verification failed: No data found");
    }

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 090 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Restart Strapi to pick up schema changes");
    console.log(
      "  2. Update dental-bleaching.json schema to include CTA field",
    );
    console.log("  3. Update frontend to fetch CTA from API");
    console.log("  4. Add background_image and user_avatars support\n");
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
