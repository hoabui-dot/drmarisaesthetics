#!/usr/bin/env node

/**
 * Migration Script: Convert Video Hero Title to Repeatable Component
 *
 * Purpose:
 * - Create title-line component table for repeatable title lines
 * - Create junction table to link video hero with title lines
 * - Migrate existing title_line_1, title_line_2, title_line_3 to repeatable components
 * - Remove old title_line_* columns
 *
 * Pattern: Same as Trust section stats (repeatable components)
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
  console.log("MIGRATION: Convert Video Hero Title to Repeatable Component");
  console.log("=".repeat(80) + "\n");

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL\n");

    // Step 1: Create title-line component table
    console.log("Step 1: Creating title-line component table...");

    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'components_homepage_title_lines'
      );
    `);

    if (!tableExists.rows[0].exists) {
      await client.query(`
        CREATE TABLE components_homepage_title_lines (
          id SERIAL PRIMARY KEY,
          text VARCHAR(255) NOT NULL
        );
      `);
      console.log("  ✅ Created components_homepage_title_lines table");
    } else {
      console.log("  ℹ️  Table components_homepage_title_lines already exists");
    }

    // Step 2: Create junction table
    console.log("\nStep 2: Creating junction table...");

    const junctionExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'components_homepage_video_heroes_cmps'
      );
    `);

    if (!junctionExists.rows[0].exists) {
      await client.query(`
        CREATE TABLE components_homepage_video_heroes_cmps (
          id SERIAL PRIMARY KEY,
          entity_id INTEGER,
          cmp_id INTEGER,
          component_type VARCHAR(255),
          field VARCHAR(255),
          "order" INTEGER
        );
      `);
      console.log(
        "  ✅ Created components_homepage_video_heroes_cmps junction table",
      );
    } else {
      console.log("  ℹ️  Junction table already exists");
    }

    // Step 3: Migrate existing data
    console.log("\nStep 3: Migrating existing title lines to components...");

    const videoHeroes = await client.query(`
      SELECT id, title_line_1, title_line_2, title_line_3 
      FROM components_homepage_video_heroes
      WHERE title_line_1 IS NOT NULL OR title_line_2 IS NOT NULL OR title_line_3 IS NOT NULL
    `);

    console.log(
      `  Found ${videoHeroes.rows.length} video hero record(s) with title lines\n`,
    );

    for (const hero of videoHeroes.rows) {
      const { id, title_line_1, title_line_2, title_line_3 } = hero;

      console.log(`  Processing video hero ID ${id}:`);

      // Check if already migrated
      const existingComponents = await client.query(
        `
        SELECT COUNT(*) as count 
        FROM components_homepage_video_heroes_cmps 
        WHERE entity_id = $1 AND field = 'titleLines'
      `,
        [id],
      );

      if (parseInt(existingComponents.rows[0].count) > 0) {
        console.log(
          `    ℹ️  Already migrated (${existingComponents.rows[0].count} title lines exist)`,
        );
        continue;
      }

      const titleLines = [title_line_1, title_line_2, title_line_3].filter(
        Boolean,
      );

      for (let i = 0; i < titleLines.length; i++) {
        const text = titleLines[i];

        // Create title-line component
        const result = await client.query(
          `
          INSERT INTO components_homepage_title_lines (text) 
          VALUES ($1) 
          RETURNING id
        `,
          [text],
        );

        const componentId = result.rows[0].id;

        // Link to video hero
        await client.query(
          `
          INSERT INTO components_homepage_video_heroes_cmps 
          (entity_id, cmp_id, component_type, field, "order") 
          VALUES ($1, $2, $3, $4, $5)
        `,
          [id, componentId, "homepage.title-line", "titleLines", i + 1],
        );

        console.log(`    ✅ Created title line ${i + 1}: "${text}"`);
      }
    }

    // Step 4: Drop old columns
    console.log("\nStep 4: Removing old title_line_* columns...");

    const columnsToRemove = ["title_line_1", "title_line_2", "title_line_3"];

    for (const column of columnsToRemove) {
      const columnExists = await client.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'components_homepage_video_heroes' 
            AND column_name = $1
        );
      `,
        [column],
      );

      if (columnExists.rows[0].exists) {
        await client.query(`
          ALTER TABLE components_homepage_video_heroes 
          DROP COLUMN ${column}
        `);
        console.log(`  ✅ Removed column ${column}`);
      }
    }

    // Step 5: Verify the migration
    console.log("\nStep 5: Verifying migration...");

    const verification = await client.query(`
      SELECT 
        vh.id,
        vh.title,
        COUNT(tl.id) as title_line_count
      FROM components_homepage_video_heroes vh
      LEFT JOIN components_homepage_video_heroes_cmps j 
        ON vh.id = j.entity_id AND j.field = 'titleLines'
      LEFT JOIN components_homepage_title_lines tl 
        ON j.cmp_id = tl.id
      GROUP BY vh.id, vh.title
    `);

    console.log("\n📊 Video Hero Records:");
    console.log("-".repeat(80));
    for (const record of verification.rows) {
      console.log(`ID: ${record.id}`);
      console.log(`  Original Title: ${record.title}`);
      console.log(`  Title Lines: ${record.title_line_count}`);

      // Show actual title lines
      const titleLines = await client.query(
        `
        SELECT tl.text, j."order"
        FROM components_homepage_title_lines tl
        JOIN components_homepage_video_heroes_cmps j 
          ON tl.id = j.cmp_id
        WHERE j.entity_id = $1 AND j.field = 'titleLines'
        ORDER BY j."order"
      `,
        [record.id],
      );

      titleLines.rows.forEach((line, idx) => {
        console.log(`    Line ${idx + 1}: "${line.text}"`);
      });
      console.log("-".repeat(80));
    }

    console.log("\n" + "=".repeat(80));
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(80));
    console.log("\n📋 Summary:");
    console.log("  ✅ Created components_homepage_title_lines table");
    console.log(
      "  ✅ Created components_homepage_video_heroes_cmps junction table",
    );
    console.log(
      `  ✅ Migrated ${videoHeroes.rows.length} video hero record(s)`,
    );
    console.log(
      "  ✅ Removed old title_line_1, title_line_2, title_line_3 columns",
    );
    console.log("\n🎯 Next Steps:");
    console.log("  1. Restart Strapi to load new schema");
    console.log("  2. Update frontend TypeScript types");
    console.log(
      "  3. Update frontend component to render repeatable title lines",
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
