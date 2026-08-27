/**
 * Migration Script 051: Restore Certification Data
 *
 * Purpose: Migrate certification data from old certificate_items table
 *          to new certification_items table with proper structure
 *
 * Data to migrate:
 * - 4 unique certificates with organization names and images
 * - File associations need to be updated to new related_type
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

    // Get old certificate data with files
    console.log("🔍 Fetching old certificate data...");
    const oldData = await client.query(`
      SELECT 
        ci.id,
        ci.organization,
        f.id as file_id,
        f.name as file_name,
        f.url as file_url
      FROM components_homepage_certificate_items ci
      LEFT JOIN files_related_mph frm ON frm.related_id = ci.id 
        AND frm.related_type = 'homepage.certificate-item'
      LEFT JOIN files f ON f.id = frm.file_id
      WHERE ci.id IN (1, 2, 3, 4)
      ORDER BY ci.id
    `);

    console.log(`Found ${oldData.rows.length} certificates to migrate\n`);

    // Start transaction
    await client.query("BEGIN");

    try {
      // Clear existing data in new table
      console.log("🗑️  Clearing new certification_items table...");
      await client.query("DELETE FROM components_homepage_certification_items");

      // Insert data into new table
      console.log("📝 Inserting certification data...\n");

      const certData = [
        {
          name: "Advanced Clinical Excellence Certificate",
          organization: "ORAL HEALTH PARTNERS",
          fileId: 118,
        },
        {
          name: "Certificate of Clinical Excellence & Research",
          organization: "ELITE DENTAL SPECIALISTS",
          fileId: 119,
        },
        {
          name: "Certification of Advanced Dental Care",
          organization: "ADVANCED DENTAL CARE PARTNERS",
          fileId: 120,
        },
        {
          name: "Power for Our Dentist",
          organization: "DENTAL TECH SOLUTIONS",
          fileId: 121,
        },
      ];

      const insertedIds = [];

      for (let i = 0; i < certData.length; i++) {
        const cert = certData[i];

        // Insert certification item
        const result = await client.query(
          `
          INSERT INTO components_homepage_certification_items (name, organization)
          VALUES ($1, $2)
          RETURNING id
        `,
          [cert.name, cert.organization],
        );

        const newId = result.rows[0].id;
        insertedIds.push(newId);

        console.log(`✅ Inserted: ${cert.name}`);
        console.log(`   Organization: ${cert.organization}`);
        console.log(`   New ID: ${newId}`);

        // Create file association
        await client.query(
          `
          INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
          VALUES ($1, $2, $3, $4, $5)
        `,
          [cert.fileId, newId, "homepage.certification-item", "image", 1],
        );

        console.log(`   Linked to file ID: ${cert.fileId}\n`);
      }

      // Now link these items to the certification section
      console.log("🔗 Linking certification items to section...");

      // Find the certification section
      const certSection = await client.query(`
        SELECT id FROM components_homepage_certifications
        ORDER BY id DESC
        LIMIT 1
      `);

      if (certSection.rows.length > 0) {
        const sectionId = certSection.rows[0].id;
        console.log(`   Found certification section ID: ${sectionId}`);

        // Check if link table exists
        const linkTableCheck = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'components_homepage_certifications_cmps'
          ) as exists
        `);

        if (linkTableCheck.rows[0].exists) {
          // Clear old links
          await client.query(
            `
            DELETE FROM components_homepage_certifications_cmps
            WHERE entity_id = $1 AND field = 'certificates'
          `,
            [sectionId],
          );

          // Create new links
          for (let i = 0; i < insertedIds.length; i++) {
            await client.query(
              `
              INSERT INTO components_homepage_certifications_cmps 
              (entity_id, cmp_id, component_type, field, "order")
              VALUES ($1, $2, $3, $4, $5)
            `,
              [
                sectionId,
                insertedIds[i],
                "homepage.certification-item",
                "certificates",
                i + 1,
              ],
            );
          }

          console.log(`   ✅ Linked ${insertedIds.length} items to section\n`);
        } else {
          console.log(
            "   ⚠️  Link table does not exist yet (will be created by Strapi)\n",
          );
        }
      } else {
        console.log("   ⚠️  No certification section found\n");
      }

      // Commit transaction
      await client.query("COMMIT");
      console.log("✅ Transaction committed successfully!");
    } catch (error) {
      // Rollback on error
      await client.query("ROLLBACK");
      throw error;
    }

    // Verify the migration
    console.log("\n📋 Verifying migration...");
    const verify = await client.query(`
      SELECT 
        ci.id,
        ci.name,
        ci.organization,
        f.name as file_name
      FROM components_homepage_certification_items ci
      LEFT JOIN files_related_mph frm ON frm.related_id = ci.id 
        AND frm.related_type = 'homepage.certification-item'
      LEFT JOIN files f ON f.id = frm.file_id
      ORDER BY ci.id
    `);

    console.log(
      `\nNew certification_items table now has ${verify.rows.length} items:`,
    );
    verify.rows.forEach((row) => {
      console.log(`  - ${row.name} (${row.organization})`);
      console.log(`    File: ${row.file_name || "No file"}`);
    });

    console.log("\n✅ Migration 051 completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Restart Strapi CMS: cd strapi-cms && npm run develop");
    console.log("   2. Check homepage in Strapi admin");
    console.log("   3. Verify certification section shows 4 certificates");
    console.log("   4. Test frontend to see certificates display correctly");
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
