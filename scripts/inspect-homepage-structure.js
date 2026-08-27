const { Client } = require("pg");

const client = new Client({
  host: "100.68.50.41",
  port: 5437,
  database: "dental_cms_strapi",
  user: "postgres",
  password: "postgres",
});

async function inspectStructure() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL\n");

    // Check homepages table structure
    console.log("📋 Homepages table columns:");
    const homepageColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'homepages'
      ORDER BY ordinal_position
    `);
    homepageColumns.rows.forEach((col) => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

    // Check homepages_cmps table structure
    console.log("\n📋 Homepages_cmps table columns:");
    const cmpsColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'homepages_cmps'
      ORDER BY ordinal_position
    `);
    cmpsColumns.rows.forEach((col) => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

    // Get sample data
    console.log("\n📊 Sample homepage_cmps data:");
    const sampleData = await client.query(`
      SELECT * FROM homepages_cmps LIMIT 3
    `);
    console.log(JSON.stringify(sampleData.rows, null, 2));

    // Check component tables
    console.log("\n📋 Available component tables:");
    const componentTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE 'components_homepage_%'
      ORDER BY table_name
    `);
    componentTables.rows.forEach((table) => {
      console.log(`  - ${table.table_name}`);
    });

    await client.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    await client.end();
    process.exit(1);
  }
}

inspectStructure();
