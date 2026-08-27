/**
 * Migration Script 049: Remove name field from paper items
 *
 * Purpose: Remove the name column from components_homepage_paper_items table
 *          as it's no longer displayed in the UI
 *
 * Changes:
 * - Drop name column from components_homepage_paper_items table
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
    console.log("✅ Connected to database");

    // Check if name column exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_homepage_paper_items' 
        AND column_name = 'name'
    `);

    if (checkColumn.rows.length === 0) {
      console.log(
        'ℹ️  Column "name" does not exist in components_homepage_paper_items table',
      );
      return;
    }

    console.log(
      "🔄 Removing name column from components_homepage_paper_items...",
    );

    // Drop the name column
    await client.query(`
      ALTER TABLE components_homepage_paper_items
      DROP COLUMN IF EXISTS name
    `);

    console.log(
      "✅ Successfully removed name column from components_homepage_paper_items",
    );

    // Verify the change
    const verifyColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'components_homepage_paper_items'
      ORDER BY ordinal_position
    `);

    console.log("\n📋 Current columns in components_homepage_paper_items:");
    verifyColumns.rows.forEach((col) => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });

    console.log("\n✅ Migration 049 completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Restart Strapi CMS to pick up schema changes");
    console.log(
      "   2. Run type check: cd dental-frontend && npm run type-check",
    );
    console.log("   3. Run lint: cd dental-frontend && npm run lint");
    console.log(
      "   4. Test in browser - papers section should show 3 items on desktop",
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("🔌 Database connection closed");
  }
}

// Run migration
migrate().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
