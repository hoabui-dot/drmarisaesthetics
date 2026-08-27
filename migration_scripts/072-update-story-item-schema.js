/**
 * Migration Script: Update Story Item Schema
 *
 * Changes:
 * 1. Remove 'before_after' boolean field
 * 2. Remove 'customer_image' field
 * 3. Change 'icon' from string to media field
 * 4. Add 'before_image' media field
 * 5. Add 'after_image' media field
 *
 * Run: node migration_scripts/072-update-story-item-schema.js
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
    console.log("✅ Connected to database");

    // Start transaction
    await client.query("BEGIN");

    // 1. Remove before_after column
    console.log("\n📝 Removing before_after column...");
    await client.query(`
      ALTER TABLE components_customer_story_items 
      DROP COLUMN IF EXISTS before_after;
    `);
    console.log("✅ Removed before_after column");

    // 2. Remove customer_image column
    console.log("\n📝 Removing customer_image column...");
    await client.query(`
      ALTER TABLE components_customer_story_items 
      DROP COLUMN IF EXISTS customer_image;
    `);
    console.log("✅ Removed customer_image column");

    // 3. Check if icon column exists and its type
    const iconCheck = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_customer_story_items' 
      AND column_name = 'icon';
    `);

    if (
      iconCheck.rows.length > 0 &&
      iconCheck.rows[0].data_type === "character varying"
    ) {
      console.log("\n📝 Dropping old icon column (string type)...");
      await client.query(`
        ALTER TABLE components_customer_story_items 
        DROP COLUMN icon;
      `);
      console.log("✅ Dropped old icon column");
    }

    // 4. Add before_image column if not exists
    console.log("\n📝 Adding before_image column...");
    await client.query(`
      ALTER TABLE components_customer_story_items 
      ADD COLUMN IF NOT EXISTS before_image integer;
    `);
    console.log("✅ Added before_image column");

    // 5. Add after_image column if not exists
    console.log("\n📝 Adding after_image column...");
    await client.query(`
      ALTER TABLE components_customer_story_items 
      ADD COLUMN IF NOT EXISTS after_image integer;
    `);
    console.log("✅ Added after_image column");

    // 6. Add icon column as integer (media reference) if not exists
    console.log("\n📝 Adding icon column (media type)...");
    await client.query(`
      ALTER TABLE components_customer_story_items 
      ADD COLUMN IF NOT EXISTS icon integer;
    `);
    console.log("✅ Added icon column");

    // Commit transaction
    await client.query("COMMIT");
    console.log("\n✅ Migration completed successfully!");

    // Show updated schema
    console.log("\n📋 Updated schema:");
    const schema = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'components_customer_story_items'
      ORDER BY ordinal_position;
    `);
    console.table(schema.rows);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\n✅ Database connection closed");
  }
}

migrate().catch(console.error);
