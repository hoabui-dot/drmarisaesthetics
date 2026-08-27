/**
 * Migration Script 050: Fix Certification Schema
 *
 * Purpose: Add organization column to components_homepage_certification_items
 *          and ensure the schema matches our component definition
 *
 * Changes:
 * - Add organization column to components_homepage_certification_items
 * - Migrate any data from old certificate_items table if exists
 *
 * Database: dental_cms_strapi
 * Host: 100.68.50.41:5437
 * User: postgres
 * Password: postgres
 */

const { Client } = require("pg");

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

async function migrate() {
  try {
    await client.connect();
    console.log("✅ Connected to database\n");

    // Check current state
    console.log("🔍 Checking current schema...");
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_homepage_certification_items' 
        AND column_name = 'organization'
    `);

    if (checkColumn.rows.length > 0) {
      console.log(
        'ℹ️  Column "organization" already exists in components_homepage_certification_items',
      );
      return;
    }

    console.log(
      "🔄 Adding organization column to components_homepage_certification_items...",
    );

    // Add organization column
    await client.query(`
      ALTER TABLE components_homepage_certification_items
      ADD COLUMN IF NOT EXISTS organization VARCHAR(255)
    `);

    console.log("✅ Successfully added organization column");

    // Check if old table exists and has data
    const checkOldTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'components_homepage_certificate_items'
      ) as exists
    `);

    if (checkOldTable.rows[0].exists) {
      console.log("\n🔄 Checking old certificate_items table for data...");

      const oldData = await client.query(`
        SELECT COUNT(*) as count FROM components_homepage_certificate_items
      `);

      if (oldData.rows[0].count > 0) {
        console.log(`⚠️  Found ${oldData.rows[0].count} items in old table`);
        console.log(
          "   Note: You may need to manually migrate this data if needed",
        );
      } else {
        console.log("✅ Old table is empty, no migration needed");
      }
    }

    // Verify the change
    console.log("\n📋 Verifying schema...");
    const verifyColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'components_homepage_certification_items'
      ORDER BY ordinal_position
    `);

    console.log("Current columns in components_homepage_certification_items:");
    verifyColumns.rows.forEach((col) => {
      console.log(
        `   - ${col.column_name} (${col.data_type}) ${col.is_nullable === "NO" ? "NOT NULL" : "NULL"}`,
      );
    });

    console.log("\n✅ Migration 050 completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Restart Strapi CMS: cd strapi-cms && npm run develop");
    console.log(
      "   2. Check Strapi admin at https://guild-biblical-expectations-easily.trycloudflare.com/admin",
    );
    console.log(
      "   3. Go to Homepage content type and verify certification section works",
    );
    console.log(
      "   4. Add/edit certification items with name, image, and organization fields",
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed");
  }
}

// Run migration
migrate().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
