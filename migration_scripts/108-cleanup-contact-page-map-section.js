/**
 * Migration Script 108: Cleanup Contact Page Map Section
 *
 * Removes duplicate map section and fixes order values
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
    console.log("✅ Connected to database\n");

    // Remove duplicate map section from draft
    console.log("📝 Step 1: Removing duplicate map section from draft...");
    await client.query(`
      DELETE FROM contact_pages_cmps 
      WHERE entity_id = 6 AND field = 'map_section' AND cmp_id = 1
    `);
    console.log("   ✅ Removed duplicate");

    // Fix order values for draft
    console.log("\n📝 Step 2: Fixing order values for draft...");
    await client.query(
      `UPDATE contact_pages_cmps SET "order" = 3 WHERE entity_id = 6 AND field = 'faq'`,
    );
    console.log("   ✅ Fixed draft order values");

    // Fix order values for published
    console.log("\n📝 Step 3: Fixing order values for published...");
    await client.query(
      `UPDATE contact_pages_cmps SET "order" = 1 WHERE entity_id = 71 AND field = 'hero'`,
    );
    await client.query(
      `UPDATE contact_pages_cmps SET "order" = 2 WHERE entity_id = 71 AND field = 'elite_stack'`,
    );
    await client.query(
      `UPDATE contact_pages_cmps SET "order" = 3 WHERE entity_id = 71 AND field = 'faq'`,
    );
    await client.query(
      `UPDATE contact_pages_cmps SET "order" = 4 WHERE entity_id = 71 AND field = 'final_cta'`,
    );
    console.log("   ✅ Fixed published order values");

    // Verify
    console.log("\n🔍 Step 4: Verifying the result...\n");
    const result = await client.query(`
      SELECT 
        cp.id as page_id,
        CASE WHEN cp.published_at IS NULL THEN 'DRAFT' ELSE 'PUBLISHED' END as status,
        cpc.field,
        cpc.cmp_id,
        cpc.order
      FROM contact_pages cp
      LEFT JOIN contact_pages_cmps cpc ON cp.id = cpc.entity_id
      WHERE cp.document_id = 'w6l20x2kkku0xljbzd074nz7'
      ORDER BY cp.id, cpc.order
    `);

    console.log("📊 Final State:");
    console.table(result.rows);

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed");
  }
}

migrate();
