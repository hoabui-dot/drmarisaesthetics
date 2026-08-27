/**
 * Migration Script 111: Add Background Image Link Table for CTA Component
 *
 * Purpose: Create the missing link table for background_image field in homepage.cta component
 *
 * Issue: The background_image field was added to the CTA schema but Strapi didn't create
 * the link table automatically. This causes API errors when trying to populate background_image.
 *
 * Solution: Manually create the components_homepage_ctas_background_image_lnk table
 */

const { Pool } = require("pg");

const pool = new Pool({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log(
      "Creating components_homepage_ctas_background_image_lnk table...",
    );

    // Create the link table for background_image
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_homepage_ctas_background_image_lnk (
        id SERIAL PRIMARY KEY,
        cta_id INTEGER REFERENCES components_homepage_ctas(id) ON DELETE CASCADE,
        file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
        file_ord DOUBLE PRECISION DEFAULT 1
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS components_homepage_ctas_background_image_lnk_fk 
      ON components_homepage_ctas_background_image_lnk(cta_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS components_homepage_ctas_background_image_lnk_inv_fk 
      ON components_homepage_ctas_background_image_lnk(file_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS components_homepage_ctas_background_image_lnk_order_fk 
      ON components_homepage_ctas_background_image_lnk(file_ord)
    `);

    console.log("✓ Link table created successfully");

    await client.query("COMMIT");
    console.log("Migration 111 completed successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
