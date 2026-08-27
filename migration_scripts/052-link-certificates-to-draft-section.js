/**
 * Migration Script 052: Link Certificates to Draft Section
 *
 * Purpose: Link certificate items to BOTH draft and published certification sections
 *          so they appear in Strapi CMS admin panel
 *
 * Issue: Strapi v5 Draft & Publish requires separate entries for draft and published
 *        - Homepage ID 1 (draft) → Certification Section ID 1 (draft) → NO items
 *        - Homepage ID 159 (published) → Certification Section ID 13 (published) → HAS items
 *
 * Solution: Link certificate items to BOTH sections
 *
 * Database: dental_cms_strapi
 * Host: 100.68.50.41:5437
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

    // Get certificate items
    console.log("🔍 Checking certificate items...");
    const items = await client.query(`
      SELECT id, name, organization
      FROM components_homepage_certification_items
      ORDER BY id
    `);

    console.log(`Found ${items.rows.length} certificate items:\n`);
    items.rows.forEach((row) => {
      console.log(`  - ID ${row.id}: ${row.name}`);
    });

    // Check current links
    console.log("\n🔍 Checking current links...");
    const currentLinks = await client.query(`
      SELECT entity_id, COUNT(*) as count
      FROM components_homepage_certifications_cmps
      WHERE field = 'certificates'
      GROUP BY entity_id
    `);

    console.log("Current links:");
    currentLinks.rows.forEach((row) => {
      console.log(`  - Section ${row.entity_id}: ${row.count} items`);
    });

    // Start transaction
    await client.query("BEGIN");

    try {
      // Clear existing links for section 1 (draft)
      console.log("\n🗑️  Clearing old links for section 1 (draft)...");
      await client.query(`
        DELETE FROM components_homepage_certifications_cmps
        WHERE entity_id = 1 AND field = 'certificates'
      `);

      // Link items to section 1 (draft)
      console.log("🔗 Linking items to section 1 (draft)...");
      const itemIds = items.rows.map((r) => r.id);

      for (let i = 0; i < itemIds.length; i++) {
        await client.query(
          `
          INSERT INTO components_homepage_certifications_cmps 
          (entity_id, cmp_id, component_type, field, "order")
          VALUES ($1, $2, $3, $4, $5)
        `,
          [1, itemIds[i], "homepage.certification-item", "certificates", i + 1],
        );

        console.log(`  ✅ Linked item ${itemIds[i]} to section 1`);
      }

      // Verify section 13 (published) still has links
      console.log("\n🔍 Verifying section 13 (published) links...");
      const section13Links = await client.query(`
        SELECT COUNT(*) as count
        FROM components_homepage_certifications_cmps
        WHERE entity_id = 13 AND field = 'certificates'
      `);

      console.log(
        `  Section 13 has ${section13Links.rows[0].count} items linked`,
      );

      // Commit transaction
      await client.query("COMMIT");
      console.log("\n✅ Transaction committed successfully!");
    } catch (error) {
      // Rollback on error
      await client.query("ROLLBACK");
      throw error;
    }

    // Verify the migration
    console.log("\n📋 Verifying migration...");
    const verify = await client.query(`
      SELECT 
        c.entity_id as section_id,
        c.cmp_id as item_id,
        c.order,
        ci.name,
        ci.organization
      FROM components_homepage_certifications_cmps c
      JOIN components_homepage_certification_items ci ON ci.id = c.cmp_id
      WHERE c.field = 'certificates'
      ORDER BY c.entity_id, c.order
    `);

    console.log("\nFinal state:");
    let currentSection = null;
    verify.rows.forEach((row) => {
      if (row.section_id !== currentSection) {
        currentSection = row.section_id;
        console.log(`\nSection ${row.section_id}:`);
      }
      console.log(`  ${row.order}. ${row.name} (${row.organization})`);
    });

    console.log("\n✅ Migration 052 completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Restart Strapi CMS: cd strapi-cms && npm run develop");
    console.log(
      "   2. Go to Strapi admin: https://guild-biblical-expectations-easily.trycloudflare.com/admin",
    );
    console.log("   3. Navigate to Content Manager → Homepage");
    console.log(
      "   4. Check Certification section - should now show 4 certificates",
    );
    console.log(
      "   5. Verify both draft and published versions have certificates",
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed");
  }
}

// Run migration
migrate().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
