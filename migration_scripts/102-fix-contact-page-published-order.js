/**
 * Migration Script 102: Fix Contact Page Published Version Order Values
 *
 * Issue: When publishing the contact page in Strapi v5, the component order values
 * become NULL, causing the data to appear lost in the CMS and API responses.
 *
 * This is a known Strapi v5 Draft & Publish bug where component order values
 * are not properly copied from draft to published version.
 *
 * Solution: Set proper order values for all components in the published version.
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

    // Fix order values for contact_pages_cmps (main components)
    console.log("\n📝 Fixing order values for contact page components...");

    const updateMainComponents = `
      UPDATE contact_pages_cmps
      SET "order" = CASE
        WHEN field = 'hero' THEN 1
        WHEN field = 'elite_stack' THEN 2
        WHEN field = 'faq' THEN 3
        WHEN field = 'final_cta' THEN 4
        ELSE "order"
      END
      WHERE entity_id = 67 AND "order" IS NULL;
    `;

    const mainResult = await client.query(updateMainComponents);
    console.log(
      `✅ Updated ${mainResult.rowCount} main component order values`,
    );

    // Fix order values for hero nested components
    console.log("\n📝 Fixing order values for hero nested components...");

    const updateHeroComponents = `
      UPDATE components_contact_heroes_cmps
      SET "order" = 1
      WHERE entity_id = 67 AND "order" IS NULL;
    `;

    const heroResult = await client.query(updateHeroComponents);
    console.log(
      `✅ Updated ${heroResult.rowCount} hero component order values`,
    );

    // Verify the fix
    console.log("\n🔍 Verifying the fix...");

    const verifyQuery = `
      SELECT 
        cp.id,
        cp.document_id,
        cp.published_at,
        cpc.field,
        cpc.order,
        cpc.component_type
      FROM contact_pages cp
      LEFT JOIN contact_pages_cmps cpc ON cp.id = cpc.entity_id
      WHERE cp.id = 67
      ORDER BY cpc.order;
    `;

    const verifyResult = await client.query(verifyQuery);
    console.log("\n📊 Published contact page components:");
    console.table(verifyResult.rows);

    // Check hero nested components
    const verifyHeroQuery = `
      SELECT 
        ch.id,
        ch.title,
        chc.field,
        chc.order,
        chc.component_type
      FROM components_contact_heroes ch
      LEFT JOIN components_contact_heroes_cmps chc ON ch.id = chc.entity_id
      WHERE ch.id = 67;
    `;

    const verifyHeroResult = await client.query(verifyHeroQuery);
    console.log("\n📊 Hero nested components:");
    console.table(verifyHeroResult.rows);

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📝 Next steps:");
    console.log(
      "1. Restart Strapi to clear cache: npm run develop (in strapi-cms)",
    );
    console.log("2. Check contact page in Strapi admin");
    console.log(
      "3. Verify API response at: https://guild-biblical-expectations-easily.trycloudflare.com/api/contact-page",
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed");
  }
}

migrate();
