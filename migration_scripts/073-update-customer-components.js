/**
 * Migration: Update Customer Components
 *
 * Changes:
 * 1. Gallery Item: Replace 'image' with 'before_image' and 'after_image'
 * 2. Story Item: Replace 'icon', 'before_image', 'after_image' with 'avatar', remove 'location'
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
    console.log("Connected to database");

    // Start transaction
    await client.query("BEGIN");

    // ============================================
    // 1. Update Gallery Items Component
    // ============================================
    console.log("\n1. Updating components_customer_gallery_items...");

    // Check if old columns exist
    const galleryColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_customer_gallery_items'
    `);
    const galleryColumnNames = galleryColumns.rows.map((r) => r.column_name);
    console.log("Current gallery columns:", galleryColumnNames);

    // Rename 'image' to 'before_image' if it exists
    if (galleryColumnNames.includes("image")) {
      await client.query(`
        ALTER TABLE components_customer_gallery_items 
        RENAME COLUMN image TO before_image
      `);
      console.log("✓ Renamed image → before_image");
    }

    // Add 'after_image' column if it doesn't exist
    if (!galleryColumnNames.includes("after_image")) {
      await client.query(`
        ALTER TABLE components_customer_gallery_items 
        ADD COLUMN after_image integer
      `);
      console.log("✓ Added after_image column");
    }

    // Rename 'category' to 'treatment_type' if it exists
    if (galleryColumnNames.includes("category")) {
      await client.query(`
        ALTER TABLE components_customer_gallery_items 
        RENAME COLUMN category TO treatment_type
      `);
      console.log("✓ Renamed category → treatment_type");
    }

    // Drop 'alt_text' column if it exists
    if (galleryColumnNames.includes("alt_text")) {
      await client.query(`
        ALTER TABLE components_customer_gallery_items 
        DROP COLUMN alt_text
      `);
      console.log("✓ Dropped alt_text column");
    }

    // ============================================
    // 2. Update Story Items Component
    // ============================================
    console.log("\n2. Updating components_customer_story_items...");

    // Check if old columns exist
    const storyColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_customer_story_items'
    `);
    const storyColumnNames = storyColumns.rows.map((r) => r.column_name);
    console.log("Current story columns:", storyColumnNames);

    // Rename 'icon' to 'avatar' if it exists
    if (storyColumnNames.includes("icon")) {
      await client.query(`
        ALTER TABLE components_customer_story_items 
        RENAME COLUMN icon TO avatar
      `);
      console.log("✓ Renamed icon → avatar");
    }

    // Drop 'before_image' column if it exists
    if (storyColumnNames.includes("before_image")) {
      await client.query(`
        ALTER TABLE components_customer_story_items 
        DROP COLUMN before_image
      `);
      console.log("✓ Dropped before_image column");
    }

    // Drop 'after_image' column if it exists
    if (storyColumnNames.includes("after_image")) {
      await client.query(`
        ALTER TABLE components_customer_story_items 
        DROP COLUMN after_image
      `);
      console.log("✓ Dropped after_image column");
    }

    // Drop 'location' column if it exists
    if (storyColumnNames.includes("location")) {
      await client.query(`
        ALTER TABLE components_customer_story_items 
        DROP COLUMN location
      `);
      console.log("✓ Dropped location column");
    }

    // Commit transaction
    await client.query("COMMIT");
    console.log("\n✅ Migration completed successfully!");

    // Verify final schema
    console.log("\n=== Final Schema Verification ===");

    const finalGalleryColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_customer_gallery_items'
      ORDER BY ordinal_position
    `);
    console.log("\nGallery Items columns:");
    finalGalleryColumns.rows.forEach((row) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    const finalStoryColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_customer_story_items'
      ORDER BY ordinal_position
    `);
    console.log("\nStory Items columns:");
    finalStoryColumns.rows.forEach((row) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\nDatabase connection closed");
  }
}

migrate().catch(console.error);
