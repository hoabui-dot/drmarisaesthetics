/**
 * Script: Inspect Strapi Database Structure
 * 
 * This script queries the PostgreSQL database to understand the current
 * Strapi CMS structure including:
 * - All tables
 * - Component tables
 * - Single types
 * - Collections
 * - Dynamic zones
 */

const { Client } = require("pg");

const client = new Client({
  host: process.env.DB_HOST || "100.68.50.41",
  port: process.env.DB_PORT || 5437,
  database: process.env.DB_NAME || "dental_cms_strapi",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

async function inspectDatabase() {
  console.log("🔍 Inspecting Strapi Database Structure...\n");

  try {
    await client.connect();
    console.log("✓ Connected to PostgreSQL database\n");

    // 1. List all tables
    console.log("📋 All Tables in Database:");
    console.log("=" .repeat(60));
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    const tables = tablesResult.rows.map(r => r.table_name);
    tables.forEach(table => console.log(`  - ${table}`));
    console.log(`\n  Total: ${tables.length} tables\n`);

    // 2. Find component tables (components_*)
    console.log("🧩 Component Tables (components_*):");
    console.log("=" .repeat(60));
    const componentTables = tables.filter(t => t.startsWith('components_'));
    if (componentTables.length === 0) {
      console.log("  No component tables found");
    } else {
      for (const table of componentTables) {
        const columnsResult = await client.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1
          ORDER BY ordinal_position;
        `, [table]);
        
        console.log(`\n  📦 ${table}:`);
        columnsResult.rows.forEach(col => {
          console.log(`     - ${col.column_name}: ${col.data_type}`);
        });
        
        // Count records
        const countResult = await client.query(`SELECT COUNT(*) FROM "${table}"`);
        console.log(`     [${countResult.rows[0].count} records]`);
      }
    }

    // 3. Find about-related tables
    console.log("\n\n📄 About-related Tables:");
    console.log("=" .repeat(60));
    const aboutTables = tables.filter(t => 
      t.includes('about') || t.includes('About')
    );
    if (aboutTables.length === 0) {
      console.log("  No about-related tables found");
    } else {
      for (const table of aboutTables) {
        const columnsResult = await client.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1
          ORDER BY ordinal_position;
        `, [table]);
        
        console.log(`\n  📄 ${table}:`);
        columnsResult.rows.forEach(col => {
          console.log(`     - ${col.column_name}: ${col.data_type}`);
        });
        
        // Sample data
        const sampleResult = await client.query(`SELECT * FROM "${table}" LIMIT 1`);
        if (sampleResult.rows.length > 0) {
          console.log(`     Sample: ${JSON.stringify(sampleResult.rows[0]).substring(0, 100)}...`);
        }
      }
    }

    // 4. Find customer-related tables
    console.log("\n\n👥 Customer-related Tables:");
    console.log("=" .repeat(60));
    const customerTables = tables.filter(t => 
      t.includes('customer') || t.includes('Customer')
    );
    if (customerTables.length === 0) {
      console.log("  No customer-related tables found");
    } else {
      customerTables.forEach(t => console.log(`  - ${t}`));
    }

    // 5. Check strapi_core_store_settings for content types
    console.log("\n\n⚙️ Strapi Content Type Settings:");
    console.log("=" .repeat(60));
    const contentTypesResult = await client.query(`
      SELECT key, value::text 
      FROM strapi_core_store_settings 
      WHERE key LIKE 'plugin_content_manager_configuration_content_types%'
      LIMIT 20;
    `);
    
    contentTypesResult.rows.forEach(row => {
      const key = row.key.replace('plugin_content_manager_configuration_content_types::', '');
      console.log(`  - ${key}`);
    });

    // 6. Check pages table structure
    console.log("\n\n📄 Pages Table Structure:");
    console.log("=" .repeat(60));
    const pagesColumnsResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'pages'
      ORDER BY ordinal_position;
    `);
    
    if (pagesColumnsResult.rows.length > 0) {
      pagesColumnsResult.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''}`);
      });
      
      // List existing pages
      console.log("\n  Existing Pages:");
      const pagesResult = await client.query(`
        SELECT id, document_id, slug, title, published_at IS NOT NULL as is_published
        FROM pages ORDER BY id;
      `);
      pagesResult.rows.forEach(page => {
        console.log(`    - [${page.id}] ${page.slug}: ${page.title} (published: ${page.is_published})`);
      });
    } else {
      console.log("  Pages table not found");
    }

    // 7. Check for dynamic zone tables (table_cmps)
    console.log("\n\n🔗 Dynamic Zone Tables (*_cmps):");
    console.log("=" .repeat(60));
    const cmpsTables = tables.filter(t => t.endsWith('_cmps'));
    if (cmpsTables.length === 0) {
      console.log("  No dynamic zone tables found");
    } else {
      for (const table of cmpsTables) {
        const countResult = await client.query(`SELECT COUNT(*) FROM "${table}"`);
        console.log(`  - ${table}: ${countResult.rows[0].count} records`);
        
        // Sample component types
        const typesResult = await client.query(`
          SELECT DISTINCT component_type FROM "${table}" LIMIT 10;
        `);
        if (typesResult.rows.length > 0) {
          console.log(`    Component types: ${typesResult.rows.map(r => r.component_type).join(', ')}`);
        }
      }
    }

    // 8. Check strapi_components table for registered components
    console.log("\n\n🧱 Registered Strapi Components:");
    console.log("=" .repeat(60));
    const hasComponentsTable = tables.includes('strapi_components');
    if (hasComponentsTable) {
      const componentsResult = await client.query(`SELECT * FROM strapi_components;`);
      componentsResult.rows.forEach(comp => {
        console.log(`  - ${comp.uid}: ${comp.category}.${comp.display_name}`);
      });
    } else {
      // Check core store for component info
      const componentSettingsResult = await client.query(`
        SELECT key, value::text 
        FROM strapi_core_store_settings 
        WHERE key LIKE '%component%'
        LIMIT 10;
      `);
      if (componentSettingsResult.rows.length > 0) {
        componentSettingsResult.rows.forEach(row => {
          console.log(`  - ${row.key}`);
        });
      } else {
        console.log("  Component registration not found in database");
      }
    }

    console.log("\n\n✅ Database inspection complete!");

  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  } finally {
    await client.end();
    console.log("\n✓ Database connection closed");
  }
}

// Run inspection
inspectDatabase()
  .then(() => {
    console.log("\n📋 Summary: Use this information to understand the database structure");
    console.log("   and create appropriate migration scripts for new pages/components.");
    process.exit(0);
  })
  .catch(error => {
    console.error("\n❌ Inspection failed:", error);
    process.exit(1);
  });
