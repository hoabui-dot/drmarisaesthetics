#!/usr/bin/env node

/**
 * Migration Script 065: Add Icon Images to Contact Form Fields
 *
 * Changes:
 *  1. Add icon_image_id column to components_contact_form_fields table
 *  2. Add foreign key constraint to files table
 *  3. Add icon field for fallback (if not exists)
 *
 * Run:
 *   node migration_scripts/065-add-icon-images-to-form-fields.js
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
  console.log("MIGRATION 065: Add Icon Images to Contact Form Fields");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}\n`,
  );

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    // ── STEP 1: Check current structure ──────────────────────────────────
    console.log("STEP 1: Checking current table structure...");

    const columnsCheck = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_contact_form_fields'
      ORDER BY ordinal_position;
    `);

    console.log(`  Current columns (${columnsCheck.rows.length}):`);
    columnsCheck.rows.forEach((row) => {
      console.log(`    - ${row.column_name} (${row.data_type})`);
    });
    console.log();

    // ── STEP 2: Add icon column if not exists ────────────────────────────
    console.log("STEP 2: Adding icon column (if not exists)...");

    const iconExists = columnsCheck.rows.some(
      (row) => row.column_name === "icon",
    );
    if (!iconExists) {
      await client.query(`
        ALTER TABLE components_contact_form_fields 
        ADD COLUMN icon VARCHAR(50);
      `);
      console.log("  [OK] Added icon column");
    } else {
      console.log("  [SKIP] icon column already exists");
    }
    console.log();

    // ── STEP 3: Add icon_image_id column ─────────────────────────────────
    console.log("STEP 3: Adding icon_image_id column...");

    const iconImageExists = columnsCheck.rows.some(
      (row) => row.column_name === "icon_image_id",
    );
    if (!iconImageExists) {
      await client.query(`
        ALTER TABLE components_contact_form_fields 
        ADD COLUMN icon_image_id INTEGER;
      `);
      console.log("  [OK] Added icon_image_id column");
    } else {
      console.log("  [SKIP] icon_image_id column already exists");
    }
    console.log();

    // ── STEP 4: Add foreign key constraint ───────────────────────────────
    console.log("STEP 4: Adding foreign key constraint...");

    const constraintCheck = await client.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'components_contact_form_fields'
      AND constraint_name = 'components_contact_form_fields_icon_image_fk';
    `);

    if (constraintCheck.rows.length === 0) {
      await client.query(`
        ALTER TABLE components_contact_form_fields
        ADD CONSTRAINT components_contact_form_fields_icon_image_fk
        FOREIGN KEY (icon_image_id) 
        REFERENCES files(id) 
        ON DELETE SET NULL;
      `);
      console.log("  [OK] Added foreign key constraint");
    } else {
      console.log("  [SKIP] Foreign key constraint already exists");
    }
    console.log();

    // ── STEP 5: Verify final structure ───────────────────────────────────
    console.log("STEP 5: Verifying final table structure...");

    const finalColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_contact_form_fields'
      ORDER BY ordinal_position;
    `);

    console.log(`  Final columns (${finalColumns.rows.length}):`);
    finalColumns.rows.forEach((row) => {
      console.log(`    - ${row.column_name} (${row.data_type})`);
    });
    console.log();

    // ── STEP 6: Check current data ────────────────────────────────────────
    console.log("STEP 6: Checking current form fields data...");

    const dataCheck = await client.query(`
      SELECT id, name, label, type, required, placeholder, icon, icon_image_id
      FROM components_contact_form_fields
      ORDER BY id;
    `);

    console.log(`  Form fields count: ${dataCheck.rows.length}`);
    dataCheck.rows.forEach((row) => {
      console.log(`    - ID ${row.id}:`);
      console.log(`      Name: ${row.name}`);
      console.log(`      Label: ${row.label}`);
      console.log(`      Type: ${row.type}`);
      console.log(`      Icon: ${row.icon || "null"}`);
      console.log(
        `      Icon Image ID: ${row.icon_image_id || "null (no image uploaded)"}`,
      );
    });
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 065 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Update Strapi schema file:");
    console.log("     strapi-cms/src/components/contact/form-field.json");
    console.log("  2. Add icon and icon_image fields");
    console.log("  3. Restart Strapi to pick up schema changes");
    console.log("  4. Update frontend ContactPageClient component");
    console.log("  5. Add icon image display to form fields");
    console.log("  6. Upload icon images in Strapi Admin\n");
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
