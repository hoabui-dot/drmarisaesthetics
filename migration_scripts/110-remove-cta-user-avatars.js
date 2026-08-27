/**
 * Migration Script 110: Remove user_avatars from CTA components
 *
 * Purpose: Clean up unused user_avatars data from homepage CTA components
 *
 * Changes:
 * - Remove user_avatars_links junction table entries
 * - Remove user_avatars column from components_homepage_ctas table
 */

const { Client } = require("pg");

const DB_CONFIG = {
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
};

async function main() {
  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log("✓ Connected to database");

    // Step 1: Check if junction table exists
    console.log("\n📊 Checking for user_avatars junction table...");
    const junctionCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE '%cta%user_avatars%';
    `);

    if (junctionCheck.rows.length > 0) {
      console.log(
        "Found junction tables:",
        junctionCheck.rows.map((r) => r.table_name),
      );

      // Drop junction tables
      for (const row of junctionCheck.rows) {
        console.log(`\n🗑️  Dropping table: ${row.table_name}...`);
        await client.query(`DROP TABLE IF EXISTS "${row.table_name}" CASCADE;`);
        console.log(`✓ Dropped ${row.table_name}`);
      }
    } else {
      console.log("No junction tables found");
    }

    // Step 2: Check if user_avatars column exists in components_homepage_ctas
    console.log("\n📊 Checking for user_avatars column...");
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_homepage_ctas' 
        AND column_name = 'user_avatars';
    `);

    if (columnCheck.rows.length > 0) {
      console.log("Found user_avatars column");

      console.log("\n🗑️  Dropping user_avatars column...");
      await client.query(`
        ALTER TABLE components_homepage_ctas 
        DROP COLUMN IF EXISTS user_avatars CASCADE;
      `);
      console.log("✓ Dropped user_avatars column");
    } else {
      console.log("user_avatars column does not exist");
    }

    // Step 3: Verify cleanup
    console.log("\n✅ Verifying cleanup...");
    const verifyTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE '%cta%user_avatars%';
    `);

    const verifyColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'components_homepage_ctas' 
        AND column_name = 'user_avatars';
    `);

    console.log("Remaining junction tables:", verifyTables.rows.length);
    console.log("Remaining user_avatars columns:", verifyColumns.rows.length);

    console.log("\n✅ Migration 110 completed successfully!");
    console.log("\n📝 Summary:");
    console.log("  - Removed user_avatars junction tables");
    console.log("  - Removed user_avatars column from CTA component");
    console.log("\n⚠️  Next steps:");
    console.log("  1. Restart Strapi to apply schema changes");
    console.log("  2. Test CTA section on homepage");
    console.log('  3. Verify "Happy Patients" section is removed');
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed");
  }
}

main();
