/**
 * Migration Script 107: Add Map Section to Contact Page
 *
 * Adds Google Maps section to both draft and published versions of contact page
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

    const DRAFT_ID = 6;
    const PUBLISHED_ID = 71;

    // Step 1: Create map_sections table if not exists
    console.log("📝 Step 1: Creating map_sections table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS components_contact_map_sections (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) DEFAULT 'Find Us',
        description TEXT DEFAULT 'Visit our conveniently located clinic',
        location_name VARCHAR(255) NOT NULL DEFAULT 'Saigon International Dental Clinic',
        address TEXT NOT NULL DEFAULT '233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam',
        latitude DECIMAL(10, 6) NOT NULL DEFAULT 10.776145,
        longitude DECIMAL(10, 6) NOT NULL DEFAULT 106.676643
      )
    `);

    console.log("   ✅ Table created/verified");

    // Step 2: Create map section component for draft
    console.log("\n📝 Step 2: Creating map section component for draft...");

    const draftMapResult = await client.query(
      `
      INSERT INTO components_contact_map_sections (
        title, description, location_name, address, latitude, longitude
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `,
      [
        "Find Us",
        "Visit our conveniently located clinic in the heart of Ho Chi Minh City",
        "Saigon International Dental Clinic",
        "233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam",
        10.776145,
        106.676643,
      ],
    );

    const draftMapId = draftMapResult.rows[0].id;
    console.log(`   ✅ Created draft map section: ${draftMapId}`);

    // Step 3: Create map section component for published
    console.log("\n📝 Step 3: Creating map section component for published...");

    const publishedMapResult = await client.query(
      `
      INSERT INTO components_contact_map_sections (
        title, description, location_name, address, latitude, longitude
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `,
      [
        "Find Us",
        "Visit our conveniently located clinic in the heart of Ho Chi Minh City",
        "Saigon International Dental Clinic",
        "233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam",
        10.776145,
        106.676643,
      ],
    );

    const publishedMapId = publishedMapResult.rows[0].id;
    console.log(`   ✅ Created published map section: ${publishedMapId}`);

    // Step 4: Link map section to draft (order: 2.5, between elite_stack and faq)
    console.log("\n📝 Step 4: Linking map section to draft...");

    await client.query(
      `
      INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, $3, $4, $5)
    `,
      [DRAFT_ID, draftMapId, "contact.map-section", "map_section", 2.5],
    );

    console.log("   ✅ Linked map section to draft");

    // Step 5: Link map section to published
    console.log("\n📝 Step 5: Linking map section to published...");

    await client.query(
      `
      INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
      VALUES ($1, $2, $3, $4, $5)
    `,
      [PUBLISHED_ID, publishedMapId, "contact.map-section", "map_section", 2.5],
    );

    console.log("   ✅ Linked map section to published");

    // Step 6: Verify the result
    console.log("\n🔍 Step 6: Verifying the result...\n");

    const finalState = await client.query(`
      SELECT 
        cp.id as page_id,
        CASE WHEN cp.published_at IS NULL THEN 'DRAFT' ELSE 'PUBLISHED' END as status,
        cpc.field,
        cpc.cmp_id,
        cpc.component_type,
        cpc.order
      FROM contact_pages cp
      LEFT JOIN contact_pages_cmps cpc ON cp.id = cpc.entity_id
      WHERE cp.document_id = 'w6l20x2kkku0xljbzd074nz7'
      ORDER BY cp.id, cpc.order
    `);

    console.log("📊 Final State:");
    console.table(finalState.rows);

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Restart Strapi to load new schema");
    console.log("2. Check contact page in Strapi admin");
    console.log("3. Update frontend to render map section");
    console.log("4. Verify map displays correctly");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed");
  }
}

migrate();
