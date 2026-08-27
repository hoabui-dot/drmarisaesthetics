#!/usr/bin/env node

/**
 * Migration Script: Remove Title Field from Video Hero
 *
 * Purpose:
 * - Remove the old 'title' field from video hero component
 * - We now use titleLines (repeatable component) exclusively
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
  console.log("MIGRATION: Remove Title Field from Video Hero");
  console.log("=".repeat(80) + "\n");

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL\n");

    // Step 1: Check if title column exists
    console.log("Step 1: Checking if title column exists...");

    const columnExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'components_homepage_video_heroes' 
          AND column_name = 'title'
      );
    `);

    if (!columnExists.rows[0].exists) {
      console.log(
        "✅ Title column already removed. Migration already completed.\n",
      );
      return;
    }

    console.log("  Found title column, will remove it\n");

    // Step 2: Show current data (for reference)
    console.log("Step 2: Current video hero data:");
    const currentData = await client.query(`
      SELECT id, title 
      FROM components_homepage_video_heroes
    `);

    console.log("-".repeat(80));
    for (const row of currentData.rows) {
      console.log(`ID: ${row.id}`);
      console.log(`  Title (will be removed): ${row.title}`);

      // Show titleLines for this video hero
      const titleLines = await client.query(
        `
        SELECT tl.text, j."order"
        FROM components_homepage_title_lines tl
        JOIN components_homepage_video_heroes_cmps j 
          ON tl.id = j.cmp_id
        WHERE j.entity_id = $1 AND j.field = 'titleLines'
        ORDER BY j."order"
      `,
        [row.id],
      );

      console.log(`  Title Lines (will be used):`);
      titleLines.rows.forEach((line, idx) => {
        console.log(`    ${idx + 1}. "${line.text}"`);
      });
      console.log("-".repeat(80));
    }

    // Step 3: Drop the title column
    console.log("\nStep 3: Removing title column...");

    await client.query(`
      ALTER TABLE components_homepage_video_heroes 
      DROP COLUMN title
    `);

    console.log("  ✅ Removed title column\n");

    // Step 4: Verify
    console.log("Step 4: Verifying removal...");

    const verifyColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_homepage_video_heroes'
      ORDER BY ordinal_position
    `);

    console.log("\n📊 Remaining columns in components_homepage_video_heroes:");
    console.log("-".repeat(80));
    verifyColumn.rows.forEach((col, idx) => {
      console.log(`  ${idx + 1}. ${col.column_name}`);
    });
    console.log("-".repeat(80));

    console.log("\n" + "=".repeat(80));
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(80));
    console.log("\n📋 Summary:");
    console.log("  ✅ Removed 'title' column from video hero component");
    console.log("  ✅ Video hero now uses titleLines exclusively");
    console.log("\n🎯 Next Steps:");
    console.log("  1. Restart Strapi to load updated schema");
    console.log("  2. Update frontend to remove title fallback");
    console.log("  3. Test on frontend: http://localhost:3000");
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
