/**
 * Migration: Combine Hero and Map sections in Contact Page
 *
 * Changes:
 * 1. Add map fields to hero component (location data)
 * 2. Copy map_section data to hero component
 * 3. Remove map_section from contact_pages
 */

const { Client } = require("pg");

const client = new Client({
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: process.env.DATABASE_PORT || 5437,
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
});

async function up() {
  try {
    await client.connect();
    console.log("Connected to database");

    // 1. Add map fields to components_contact_heroes table
    console.log("Adding map fields to hero component...");
    await client.query(`
      ALTER TABLE components_contact_heroes
      ADD COLUMN IF NOT EXISTS location_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS location_address TEXT,
      ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10, 8),
      ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11, 8),
      ADD COLUMN IF NOT EXISTS show_map BOOLEAN DEFAULT true;
    `);

    // 2. Copy map_section data to hero component for each contact page
    console.log("Copying map section data to hero component...");

    const contactPages = await client.query(`
      SELECT 
        cp.id as page_id,
        cp.map_section_id,
        cpc.cmp_id as hero_id,
        cms.name as location_name,
        cms.address as location_address,
        cms.lat as location_lat,
        cms.lng as location_lng
      FROM contact_pages cp
      LEFT JOIN contact_pages_cmps cpc ON cp.id = cpc.entity_id AND cpc.component_type = 'contact.hero'
      LEFT JOIN components_contact_map_sections cms ON cp.map_section_id = cms.id
      WHERE cp.map_section_id IS NOT NULL AND cpc.cmp_id IS NOT NULL
    `);

    for (const page of contactPages.rows) {
      await client.query(
        `
        UPDATE components_contact_heroes
        SET 
          location_name = $1,
          location_address = $2,
          location_lat = $3,
          location_lng = $4,
          show_map = true
        WHERE id = $5
      `,
        [
          page.location_name,
          page.location_address,
          page.location_lat,
          page.location_lng,
          page.hero_id,
        ],
      );

      console.log(
        `Updated hero component ${page.hero_id} with map data from page ${page.page_id}`,
      );
    }

    // 3. Remove map_section_id from contact_pages (keep the data for rollback)
    console.log("Removing map_section_id reference from contact_pages...");
    await client.query(`
      ALTER TABLE contact_pages
      DROP COLUMN IF EXISTS map_section_id;
    `);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await client.end();
  }
}

async function down() {
  try {
    await client.connect();
    console.log("Connected to database for rollback");

    // 1. Add back map_section_id to contact_pages
    console.log("Adding back map_section_id to contact_pages...");
    await client.query(`
      ALTER TABLE contact_pages
      ADD COLUMN IF NOT EXISTS map_section_id INTEGER;
    `);

    // 2. Remove map fields from components_contact_heroes
    console.log("Removing map fields from hero component...");
    await client.query(`
      ALTER TABLE components_contact_heroes
      DROP COLUMN IF EXISTS location_name,
      DROP COLUMN IF EXISTS location_address,
      DROP COLUMN IF EXISTS location_lat,
      DROP COLUMN IF EXISTS location_lng,
      DROP COLUMN IF EXISTS show_map;
    `);

    console.log("Rollback completed successfully!");
  } catch (error) {
    console.error("Rollback failed:", error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run migration
if (require.main === module) {
  const command = process.argv[2];

  if (command === "down") {
    down()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    up()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = { up, down };
