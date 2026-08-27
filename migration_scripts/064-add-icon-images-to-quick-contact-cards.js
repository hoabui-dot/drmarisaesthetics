#!/usr/bin/env node

/**
 * Migration Script 064: Add Icon Images to Quick Contact Cards
 *
 * Changes:
 *  1. Add icon_image_id column to components_contact_quick_contact_cards table
 *  2. Add foreign key constraint to files table
 *  3. Keep existing icon field (for fallback)
 *
 * Run:
 *   node migration_scripts/064-add-icon-images-to-quick-contact-cards.js
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
  console.log("MIGRATION 064: Add Icon Images to Quick Contact Cards");
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
      WHERE table_name = 'components_contact_quick_contact_cards'
      ORDER BY ordinal_position;
    `);

    console.log(`  Current columns (${columnsCheck.rows.length}):`);
    columnsCheck.rows.forEach((row) => {
      console.log(`    - ${row.column_name} (${row.data_type})`);
    });
    console.log();

    // ── STEP 2: Add icon_image_id column ─────────────────────────────────
    console.log("STEP 2: Adding icon_image_id column...");

    const iconImageExists = columnsCheck.rows.some(
      (row) => row.column_name === "icon_image_id",
    );
    if (!iconImageExists) {
      await client.query(`
        ALTER TABLE components_contact_quick_contact_cards 
        ADD COLUMN icon_image_id INTEGER;
      `);
      console.log("  [OK] Added icon_image_id column");
    } else {
      console.log("  [SKIP] icon_image_id column already exists");
    }
    console.log();

    // ── STEP 3: Add foreign key constraint ───────────────────────────────
    console.log("STEP 3: Adding foreign key constraint...");

    const constraintCheck = await client.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'components_contact_quick_contact_cards'
      AND constraint_name = 'components_contact_quick_contact_cards_icon_image_fk';
    `);

    if (constraintCheck.rows.length === 0) {
      await client.query(`
        ALTER TABLE components_contact_quick_contact_cards
        ADD CONSTRAINT components_contact_quick_contact_cards_icon_image_fk
        FOREIGN KEY (icon_image_id) 
        REFERENCES files(id) 
        ON DELETE SET NULL;
      `);
      console.log("  [OK] Added foreign key constraint");
    } else {
      console.log("  [SKIP] Foreign key constraint already exists");
    }
    console.log();

    // ── STEP 4: Verify final structure ───────────────────────────────────
    console.log("STEP 4: Verifying final table structure...");

    const finalColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_contact_quick_contact_cards'
      ORDER BY ordinal_position;
    `);

    console.log(`  Final columns (${finalColumns.rows.length}):`);
    finalColumns.rows.forEach((row) => {
      console.log(`    - ${row.column_name} (${row.data_type})`);
    });
    console.log();

    // ── STEP 5: Check current data ────────────────────────────────────────
    console.log("STEP 5: Checking current quick contact cards data...");

    const dataCheck = await client.query(`
      SELECT id, icon, title, content, subtitle, icon_image_id
      FROM components_contact_quick_contact_cards
      ORDER BY id;
    `);

    console.log(`  Quick contact cards count: ${dataCheck.rows.length}`);
    dataCheck.rows.forEach((row) => {
      console.log(`    - ID ${row.id}:`);
      console.log(`      Icon: ${row.icon}`);
      console.log(`      Title: ${row.title}`);
      console.log(`      Content: ${row.content}`);
      console.log(
        `      Icon Image ID: ${row.icon_image_id || "null (no image uploaded)"}`,
      );
    });
    console.log();

    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION 064 COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nNext steps:");
    console.log("  1. Update Strapi schema file:");
    console.log(
      "     strapi-cms/src/components/contact/quick-contact-card.json",
    );
    console.log("  2. Add icon_image field (type: media, single image)");
    console.log("  3. Update contact page schema to remove hero icon");
    console.log("  4. Restart Strapi to pick up schema changes");
    console.log("  5. Update frontend ContactPageClient component");
    console.log("  6. Remove hero icon display");
    console.log("  7. Add icon image display to quick contact cards");
    console.log("  8. Adjust page padding\n");
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
