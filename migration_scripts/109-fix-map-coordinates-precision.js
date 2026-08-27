/**
 * Migration Script 109: Fix Map Coordinates Decimal Precision
 *
 * Issue: Latitude and longitude are showing as 10.78 and 106.68 instead of full precision
 * Root Cause: PostgreSQL DECIMAL type without precision defaults to variable precision
 * Solution: Alter columns to DECIMAL(10,8) for proper coordinate precision
 *
 * Coordinates:
 * - Latitude: 10.776145 (needs 6 decimal places)
 * - Longitude: 106.676643 (needs 6 decimal places)
 * - Using DECIMAL(10,8) to allow up to 8 decimal places
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

    // Step 1: Check current data type
    console.log("\n📊 Checking current column types...");
    const typeCheck = await client.query(`
      SELECT column_name, data_type, numeric_precision, numeric_scale
      FROM information_schema.columns
      WHERE table_name = 'components_contact_map_sections'
        AND column_name IN ('latitude', 'longitude');
    `);
    console.log("Current types:", typeCheck.rows);

    // Step 2: Alter columns to DECIMAL(12,8) to accommodate longitude values like 106.676643
    console.log("\n🔧 Altering latitude column to DECIMAL(12,8)...");
    await client.query(`
      ALTER TABLE components_contact_map_sections
      ALTER COLUMN latitude TYPE DECIMAL(12,8);
    `);
    console.log("✓ Latitude column updated");

    console.log("\n🔧 Altering longitude column to DECIMAL(12,8)...");
    await client.query(`
      ALTER TABLE components_contact_map_sections
      ALTER COLUMN longitude TYPE DECIMAL(12,8);
    `);
    console.log("✓ Longitude column updated");

    // Step 3: Update the data with full precision
    console.log("\n📝 Updating coordinates with full precision...");
    const updateResult = await client.query(`
      UPDATE components_contact_map_sections
      SET 
        latitude = 10.776145,
        longitude = 106.676643
      WHERE id IN (3, 4);
    `);
    console.log(`✓ Updated ${updateResult.rowCount} rows`);

    // Step 4: Verify the changes
    console.log("\n✅ Verifying changes...");
    const verifyResult = await client.query(`
      SELECT id, latitude, longitude
      FROM components_contact_map_sections
      WHERE id IN (3, 4);
    `);
    console.log("Updated coordinates:");
    verifyResult.rows.forEach((row) => {
      console.log(`  ID ${row.id}: lat=${row.latitude}, lng=${row.longitude}`);
    });

    console.log("\n✅ Migration 109 completed successfully!");
    console.log("\n📝 Summary:");
    console.log("  - Changed latitude column to DECIMAL(10,8)");
    console.log("  - Changed longitude column to DECIMAL(10,8)");
    console.log("  - Updated coordinates to full precision");
    console.log("\n⚠️  Next steps:");
    console.log("  1. Restart Strapi to clear cache");
    console.log("  2. Test the map on http://localhost:3000/contact");
    console.log("  3. Verify coordinates show as 10.776145, 106.676643");
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
