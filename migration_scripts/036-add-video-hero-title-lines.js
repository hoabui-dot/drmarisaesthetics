#!/usr/bin/env node

/**
 * Migration Script: Add Controlled Line Breaks to Video Hero Title
 *
 * Purpose:
 * - Add title_line_1, title_line_2, title_line_3 fields to video hero component
 * - Split existing title into multiple lines for controlled line breaks
 * - Maintain backward compatibility (keep original title field)
 *
 * Changes:
 * 1. Database: Add title_line_1, title_line_2, title_line_3 columns
 * 2. Data: Split existing title "International Dental Care in Ho Chi Minh City" into:
 *    - Line 1: "International Dental Care"
 *    - Line 2: "in Ho Chi Minh City"
 * 3. Strapi Schema: Add new fields to video-hero.json
 *
 * This script is IDEMPOTENT - safe to run multiple times
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
};

async function migrate() {
  const client = new Client(DB_CONFIG);

  console.log("\n" + "=".repeat(80));
  console.log("MIGRATION: Add Controlled Line Breaks to Video Hero Title");
  console.log("=".repeat(80) + "\n");

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL\n");

    // Step 1: Check if columns already exist
    console.log("Step 1: Checking if title line columns exist...");
    const checkColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_homepage_video_heroes' 
        AND column_name IN ('title_line_1', 'title_line_2', 'title_line_3')
    `);

    if (checkColumns.rows.length === 3) {
      console.log(
        "✅ Title line columns already exist. Migration already completed.\n",
      );
      return;
    }

    // Step 2: Add new columns
    console.log("Step 2: Adding title line columns...");

    if (!checkColumns.rows.find((r) => r.column_name === "title_line_1")) {
      await client.query(`
        ALTER TABLE components_homepage_video_heroes 
        ADD COLUMN title_line_1 VARCHAR(255)
      `);
      console.log("  ✅ Added title_line_1 column");
    }

    if (!checkColumns.rows.find((r) => r.column_name === "title_line_2")) {
      await client.query(`
        ALTER TABLE components_homepage_video_heroes 
        ADD COLUMN title_line_2 VARCHAR(255)
      `);
      console.log("  ✅ Added title_line_2 column");
    }

    if (!checkColumns.rows.find((r) => r.column_name === "title_line_3")) {
      await client.query(`
        ALTER TABLE components_homepage_video_heroes 
        ADD COLUMN title_line_3 VARCHAR(255)
      `);
      console.log("  ✅ Added title_line_3 column");
    }

    // Step 3: Get existing video hero records
    console.log("\nStep 3: Fetching existing video hero records...");
    const existingRecords = await client.query(`
      SELECT id, title 
      FROM components_homepage_video_heroes
    `);

    console.log(`  Found ${existingRecords.rows.length} record(s)\n`);

    // Step 4: Update existing records with split titles
    console.log("Step 4: Splitting titles into multiple lines...");

    for (const record of existingRecords.rows) {
      const { id, title } = record;

      // Split the title intelligently
      // "International Dental Care in Ho Chi Minh City" becomes:
      // Line 1: "International Dental Care"
      // Line 2: "in Ho Chi Minh City"

      let line1 = "";
      let line2 = "";
      let line3 = "";

      if (title) {
        // For the current title, split at "in"
        if (title.includes(" in ")) {
          const parts = title.split(" in ");
          line1 = parts[0].trim();
          line2 = "in " + parts[1].trim();
        } else {
          // Fallback: just use the title as line 1
          line1 = title;
        }
      }

      await client.query(
        `
        UPDATE components_homepage_video_heroes 
        SET title_line_1 = $1, 
            title_line_2 = $2, 
            title_line_3 = $3
        WHERE id = $4
      `,
        [line1, line2, line3, id],
      );

      console.log(`  ✅ Updated record ${id}:`);
      console.log(`     Original: "${title}"`);
      console.log(`     Line 1: "${line1}"`);
      if (line2) console.log(`     Line 2: "${line2}"`);
      if (line3) console.log(`     Line 3: "${line3}"`);
      console.log();
    }

    // Step 5: Verify the changes
    console.log("Step 5: Verifying changes...");
    const verifyRecords = await client.query(`
      SELECT id, title, title_line_1, title_line_2, title_line_3 
      FROM components_homepage_video_heroes
    `);

    console.log("\n📊 Current Video Hero Records:");
    console.log("-".repeat(80));
    for (const record of verifyRecords.rows) {
      console.log(`ID: ${record.id}`);
      console.log(`  Original Title: ${record.title}`);
      console.log(`  Line 1: ${record.title_line_1}`);
      console.log(`  Line 2: ${record.title_line_2 || "(empty)"}`);
      console.log(`  Line 3: ${record.title_line_3 || "(empty)"}`);
      console.log("-".repeat(80));
    }

    console.log("\n" + "=".repeat(80));
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(80));
    console.log("\n📋 Summary:");
    console.log("  ✅ Added title_line_1, title_line_2, title_line_3 columns");
    console.log(
      `  ✅ Updated ${existingRecords.rows.length} record(s) with split titles`,
    );
    console.log(
      "  ✅ Original title field preserved for backward compatibility",
    );
    console.log("\n🎯 Next Steps:");
    console.log(
      "  1. Update Strapi schema: strapi-cms/src/components/homepage/video-hero.json",
    );
    console.log("  2. Restart Strapi to load new schema");
    console.log(
      "  3. Update frontend component: dental-frontend/src/components/blocks/VideoHero.tsx",
    );
    console.log("  4. Test on frontend: http://localhost:3000");
    console.log();
  } catch (error) {
    console.error("\n❌ MIGRATION FAILED");
    console.error("=".repeat(80));
    console.error("Error:", error.message);
    console.error("\nStack trace:", error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run migration
migrate();
