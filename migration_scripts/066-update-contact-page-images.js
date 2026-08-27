#!/usr/bin/env node

/**
 * Migration Script 066: Update Contact Page with Background Images
 *
 * Changes:
 *  1. Add background_image to hero section (components_contact_heroes)
 *  2. Add background_image to contact form section (components_contact_forms)
 *  3. Add background_image to CTA section (components_contact_ctas)
 *
 * Run:
 *   node migration_scripts/066-update-contact-page-images.js
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
  console.log("MIGRATION 066: Update Contact Page with Background Images");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Add background_image to hero section ────────────────────
    console.log("STEP 1: Adding background_image to hero section...");

    const heroColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_contact_heroes';
    `);

    const hasHeroBgImage = heroColumns.rows.some(
      (row) => row.column_name === "background_image_id",
    );

    if (!hasHeroBgImage) {
      await client.query(`
        ALTER TABLE components_contact_heroes 
        ADD COLUMN background_image_id INTEGER;
      `);
      console.log("  [OK] Added background_image_id to hero section");

      await client.query(`
        ALTER TABLE components_contact_heroes
        ADD CONSTRAINT components_contact_heroes_background_image_fk
        FOREIGN KEY (background_image_id) 
        REFERENCES files(id) 
        ON DELETE SET NULL;
      `);
      console.log("  [OK] Added foreign key constraint");
    } else {
      console.log("  [SKIP] background_image_id already exists in hero");
    }
    console.log();

    // ── STEP 2: Add background_image to contact form ────────────────────
    console.log("STEP 2: Adding background_image to contact form...");

    const formColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_contact_forms';
    `);

    const hasFormBgImage = formColumns.rows.some(
      (row) => row.column_name === "background_image_id",
    );

    if (!hasFormBgImage) {
      await client.query(`
        ALTER TABLE components_contact_forms 
        ADD COLUMN background_image_id INTEGER;
      `);
      console.log("  [OK] Added background_image_id to contact form");

      await client.query(`
        ALTER TABLE components_contact_forms
        ADD CONSTRAINT components_contact_forms_background_image_fk
        FOREIGN KEY (background_image_id) 
        REFERENCES files(id) 
        ON DELETE SET NULL;
      `);
      console.log("  [OK] Added foreign key constraint");
    } else {
      console.log("  [SKIP] background_image_id already exists in form");
    }
    console.log();

    // ── STEP 3: Add background_image to CTA section ─────────────────────
    console.log("STEP 3: Adding background_image to CTA section...");

    const ctaColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_contact_ctas';
    `);

    const hasCtaBgImage = ctaColumns.rows.some(
      (row) => row.column_name === "background_image_id",
    );

    if (!hasCtaBgImage) {
      await client.query(`
        ALTER TABLE components_contact_ctas 
        ADD COLUMN background_image_id INTEGER;
      `);
      console.log("  [OK] Added background_image_id to CTA section");

      await client.query(`
        ALTER TABLE components_contact_ctas
        ADD CONSTRAINT components_contact_ctas_background_image_fk
        FOREIGN KEY (background_image_id) 
        REFERENCES files(id) 
        ON DELETE SET NULL;
      `);
      console.log("  [OK] Added foreign key constraint");
    } else {
      console.log("  [SKIP] background_image_id already exists in CTA");
    }
    console.log();

    // ── STEP 4: Verify final schema ─────────────────────────────────────
    console.log("STEP 4: Verifying final schema...");

    const finalHeroColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_contact_heroes'
      ORDER BY ordinal_position;
    `);

    console.log(`\n  Hero table columns (${finalHeroColumns.rows.length}):`);
    finalHeroColumns.rows.forEach((row) => {
      console.log(`    - ${row.column_name} (${row.data_type})`);
    });

    const finalFormColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_contact_forms'
      ORDER BY ordinal_position;
    `);

    console.log(`\n  Form table columns (${finalFormColumns.rows.length}):`);
    finalFormColumns.rows.forEach((row) => {
      console.log(`    - ${row.column_name} (${row.data_type})`);
    });

    const finalCtaColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_contact_ctas'
      ORDER BY ordinal_position;
    `);

    console.log(`\n  CTA table columns (${finalCtaColumns.rows.length}):`);
    finalCtaColumns.rows.forEach((row) => {
      console.log(`    - ${row.column_name} (${row.data_type})`);
    });
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 066 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Strapi schemas already updated:");
    console.log("     ✓ strapi-cms/src/components/contact/hero.json");
    console.log("     ✓ strapi-cms/src/components/contact/form.json");
    console.log("     ✓ strapi-cms/src/components/contact/cta.json");
    console.log("  2. Restart Strapi to pick up schema changes");
    console.log("  3. Upload background images in Strapi Admin:");
    console.log("     - Hero: Full-width hero background (optional)");
    console.log("     - Form: Dental clinic/consultation image");
    console.log("     - CTA: Clinic interior or happy patient");
    console.log("\nUI Changes (already implemented):");
    console.log("  ✓ Hero: Gradient background with Vietnamese text");
    console.log("  ✓ Contact Cards: Actionable (click-to-call/email/Zalo)");
    console.log("  ✓ Form: Modern UI with trust signals sidebar");
    console.log(
      "  ✓ Form: Removed 'Cần tư vấn ngay?' (phone already in cards)",
    );
    console.log("  ✓ Map: Enhanced with clinic context and actions");
    console.log("  ✓ CTA: Conversion-focused, stats hidden in UI");
    console.log("  ✓ CTA: Less text, background image support");
    console.log("  ✓ Sticky call button for mobile\n");
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
