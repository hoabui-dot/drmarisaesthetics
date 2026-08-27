#!/usr/bin/env node

/**
 * Migration Script: Add Avatar Image to Homepage Stat Item Component
 *
 * This script adds an avatar image field to the homepage.stat-item component
 * to display patient avatars with ratings in the TrustSection.
 *
 * The migration:
 * 1. Adds avatar_id column to components_homepage_stat_items table
 * 2. Creates link table for media relation (components_homepage_stat_items_avatar_lnk)
 * 3. Verifies the changes
 *
 * Run: node migration_scripts/035-add-avatar-to-stat-item.js
 *
 * For production:
 * DATABASE_HOST=<prod-host> DATABASE_PORT=<prod-port> DATABASE_NAME=<prod-db> \
 * DATABASE_USERNAME=<prod-user> DATABASE_PASSWORD=<prod-pass> \
 * node migration_scripts/035-add-avatar-to-stat-item.js
 */

const { Client } = require("pg");

// Database configuration from environment variables
const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

async function addAvatarToStatItem() {
  const client = new Client(DB_CONFIG);

  console.log("=".repeat(70));
  console.log("MIGRATION: Add Avatar Image to Homepage Stat Item Component");
  console.log("=".repeat(70));
  console.log(
    `\nDatabase: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`,
  );
  console.log(`User: ${DB_CONFIG.user}\n`);

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL database\n");

    // =========================================================================
    // STEP 1: Check if components_homepage_stat_items table exists
    // =========================================================================
    console.log(
      "STEP 1: Checking if components_homepage_stat_items table exists...\n",
    );

    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'components_homepage_stat_items'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.error(
        "  [ERROR] components_homepage_stat_items table does not exist!",
      );
      console.error(
        "  [INFO] This table should be created by Strapi automatically.",
      );
      process.exit(1);
    }

    console.log("  [OK] components_homepage_stat_items table exists");

    // =========================================================================
    // STEP 2: Check if avatar column already exists
    // =========================================================================
    console.log("\nSTEP 2: Checking if avatar column already exists...\n");

    const columnCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'components_homepage_stat_items'
        AND column_name = 'avatar_id'
      );
    `);

    if (columnCheck.rows[0].exists) {
      console.log(
        "  [INFO] avatar_id column already exists, skipping creation",
      );
    } else {
      // Add avatar_id column
      await client.query(`
        ALTER TABLE components_homepage_stat_items
        ADD COLUMN avatar_id INTEGER;
      `);
      console.log(
        "  [OK] Added avatar_id column to components_homepage_stat_items",
      );
    }

    // =========================================================================
    // STEP 3: Create media link table for avatar relation
    // =========================================================================
    console.log("\nSTEP 3: Creating media link table for avatar relation...\n");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_stat_items_avatar_lnk (
        id SERIAL PRIMARY KEY,
        stat_item_id INTEGER REFERENCES components_homepage_stat_items(id) ON DELETE CASCADE,
        file_id INTEGER,
        stat_item_ord DOUBLE PRECISION
      );
    `);
    console.log(
      "  [OK] Created components_homepage_stat_items_avatar_lnk table",
    );

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS components_homepage_stat_items_avatar_lnk_fk 
      ON components_homepage_stat_items_avatar_lnk(stat_item_id);
    `);
    console.log("  [OK] Created index on stat_item_id");

    await client.query(`
      CREATE INDEX IF NOT EXISTS components_homepage_stat_items_avatar_lnk_inv_fk 
      ON components_homepage_stat_items_avatar_lnk(file_id);
    `);
    console.log("  [OK] Created index on file_id");

    await client.query(`
      CREATE INDEX IF NOT EXISTS components_homepage_stat_items_avatar_lnk_ord_fk 
      ON components_homepage_stat_items_avatar_lnk(stat_item_ord);
    `);
    console.log("  [OK] Created index on stat_item_ord");

    // =========================================================================
    // STEP 4: Verify migration
    // =========================================================================
    console.log("\nSTEP 4: Verifying migration...\n");

    // Check avatar_id column
    const verifyColumn = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'components_homepage_stat_items'
      AND column_name = 'avatar_id';
    `);

    if (verifyColumn.rows.length > 0) {
      console.log("  [OK] avatar_id column verified:");
      console.log(`      - Column: ${verifyColumn.rows[0].column_name}`);
      console.log(`      - Type: ${verifyColumn.rows[0].data_type}`);
      console.log(`      - Nullable: ${verifyColumn.rows[0].is_nullable}`);
    }

    // Check link table
    const verifyLinkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'components_homepage_stat_items_avatar_lnk'
      );
    `);

    if (verifyLinkTable.rows[0].exists) {
      console.log(
        "  [OK] components_homepage_stat_items_avatar_lnk table verified",
      );
    }

    // Count existing stat items
    const statItemsCount = await client.query(`
      SELECT COUNT(*) as count FROM components_homepage_stat_items;
    `);
    console.log(
      `  [INFO] Found ${statItemsCount.rows[0].count} existing stat items`,
    );

    // =========================================================================
    // Summary
    // =========================================================================
    console.log("\n" + "=".repeat(70));
    console.log("MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\nSummary:");
    console.log("  - Added avatar_id column to components_homepage_stat_items");
    console.log("  - Created components_homepage_stat_items_avatar_lnk table");
    console.log("  - Created indexes for performance");
    console.log("\nNext steps:");
    console.log("  1. Update Strapi component schema in Content-Type Builder:");
    console.log(
      "     - Navigate to Content-Type Builder > Components > homepage.stat-item",
    );
    console.log("     - Add new field: 'avatar' (Type: Media, Single image)");
    console.log("  2. Restart Strapi to sync schema changes");
    console.log("  3. Update TypeScript types:");
    console.log("     - strapi-cms/types/generated/components.d.ts");
    console.log("     - dental-frontend/src/types/strapi.ts");
    console.log("  4. Upload patient avatar images in Strapi admin");
    console.log("  5. Update TrustSection component to display avatars");
    console.log("  6. Test on development before applying to production");
    console.log("\nTo apply to production:");
    console.log("  DATABASE_HOST=<prod-host> DATABASE_PORT=<prod-port> \\");
    console.log("  DATABASE_NAME=<prod-db> DATABASE_USERNAME=<prod-user> \\");
    console.log("  DATABASE_PASSWORD=<prod-pass> \\");
    console.log("  node migration_scripts/035-add-avatar-to-stat-item.js");
    console.log("");
  } catch (error) {
    console.error("\n[ERROR] Migration failed:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  } finally {
    await client.end();
    console.log("[OK] Database connection closed");
  }
}

// Run migration
addAvatarToStatItem();
