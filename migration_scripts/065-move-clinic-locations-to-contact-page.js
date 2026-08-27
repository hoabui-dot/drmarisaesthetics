#!/usr/bin/env node

const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: parseInt(process.env.DATABASE_PORT || "5437"),
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};

async function run() {
  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log("[OK] Connected to PostgreSQL\n");

    await client.query("BEGIN");

    // 1. Create component table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_clinic_locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        hours TEXT,
        lat DECIMAL NOT NULL,
        lng DECIMAL NOT NULL,
        is_primary BOOLEAN DEFAULT false
      )
    `);
    console.log("  [OK] Created components_contact_clinic_locations table");

    // 2. Fetch existing locations
    const resLocations = await client.query("SELECT * FROM clinic_locations ORDER BY display_order ASC, id ASC");
    const locations = resLocations.rows;
    console.log(`  [OK] Found ${locations.length} clinic locations to migrate`);

    // 3. Find the contact page ID
    const resContact = await client.query("SELECT id FROM contact_pages ORDER BY id ASC LIMIT 1");
    if (resContact.rows.length === 0) {
        console.log("  [WARN] No contact_pages found. Skipping data migration.");
    } else {
        const contactPageId = resContact.rows[0].id;
        console.log(`  [OK] Found contact page id: ${contactPageId}`);

        // Ensure link table exists
        await client.query(`
          CREATE TABLE IF NOT EXISTS contact_pages_components (
            id SERIAL PRIMARY KEY,
            entity_id INTEGER NOT NULL REFERENCES contact_pages(id) ON DELETE CASCADE,
            cmp_id INTEGER NOT NULL,
            component_type VARCHAR(255) NOT NULL,
            field VARCHAR(255) NOT NULL,
            "order" DOUBLE PRECISION
          )
        `);

        // Need to delete any existing ones first if migrating over existing run?
        // Let's just append or if empty, insert.
        const resExisting = await client.query(`SELECT count(*) FROM contact_pages_components WHERE field = 'clinic_locations'`);
        if (parseInt(resExisting.rows[0].count) > 0) {
            console.log("  [WARN] Data already exists in contact_pages_components for clinic_locations. Skipping row inserts.");
        } else {
            let order = 1;
            for (const loc of locations) {
                // Insert into component table
                const insertCompRes = await client.query(
                    `INSERT INTO components_contact_clinic_locations (name, address, phone, email, hours, lat, lng, is_primary) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
                    [loc.name, loc.address, loc.phone, loc.email, loc.hours, loc.lat, loc.lng, loc.is_primary]
                );
                const cmpId = insertCompRes.rows[0].id;
                
                // Link it to contact_pages
                await client.query(
                    `INSERT INTO contact_pages_components (entity_id, cmp_id, component_type, field, "order") 
                     VALUES ($1, $2, 'contact.clinic-location', 'clinic_locations', $3)`,
                    [contactPageId, cmpId, order]
                );
                order++;
            }
            console.log("  [OK] Migrated data to component table and linked to contact_pages");
        }
    }

    // 4. Drop the old table and its links (if any)
    await client.query("DROP TABLE IF EXISTS clinic_locations CASCADE");
    console.log("  [OK] Dropped table clinic_locations");

    // Also remove from upfi_clinic_locations etc if present? Usually not needed if CASCADE is used or simple setup.

    await client.query("COMMIT");
    console.log("\n[OK] MIGRATION COMPLETED SUCCESSFULLY");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("\n[ERROR]", err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
