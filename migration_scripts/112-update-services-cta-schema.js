/**
 * Migration Script 112: Update Services CTA Schema
 *
 * Purpose:
 * 1. Create background_image link table for services-overview CTA component
 * 2. Remove user_avatars field from services CTA (matching homepage CTA cleanup)
 *
 * Context: Aligning services CTA with contact page CTA implementation
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
      "Step 1: Creating background_image link table for services CTA...",
    );

    // Create the link table for background_image
    await client.query(`
      CREATE TABLE IF NOT EXISTS components_services_overview_ctas_background_image_lnk (
        id SERIAL PRIMARY KEY,
        cta_id INTEGER REFERENCES components_services_overview_ctas(id) ON DELETE CASCADE,
        file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
        file_ord DOUBLE PRECISION DEFAULT 1
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS components_services_overview_ctas_bg_img_lnk_fk 
      ON components_services_overview_ctas_background_image_lnk(cta_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS components_services_overview_ctas_bg_img_lnk_inv_fk 
      ON components_services_overview_ctas_background_image_lnk(file_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS components_services_overview_ctas_bg_img_lnk_order_fk 
      ON components_services_overview_ctas_background_image_lnk(file_ord)
    `);

    console.log("✓ Background image link table created");

    console.log("Step 2: Removing user_avatars links from services CTA...");

    // Remove user_avatars links from files_related_mph
    const deleteResult = await client.query(`
      DELETE FROM files_related_mph 
      WHERE related_type = 'components_services_overview_ctas' 
        AND field = 'user_avatars'
    `);

    console.log(`✓ Removed ${deleteResult.rowCount} user_avatars links`);

    await client.query("COMMIT");
    console.log("Migration 112 completed successfully!");
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
