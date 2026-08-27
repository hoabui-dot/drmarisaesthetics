/**
 * Script: Query Homepage Single Type Structure
 * Purpose: Analyze the homepage Single Type structure in PostgreSQL database
 *          to understand the pattern for creating Customer Single Type
 * 
 * Run: node scripts/004-query-homepage-single-type-structure.js
 */

const { Client } = require('pg');
require('dotenv').config({ path: './strapi-cms/.env' });

// Database connection from strapi-cms/.env
const dbConfig = {
  host: process.env.DATABASE_HOST || '100.68.50.41',
  port: parseInt(process.env.DATABASE_PORT) || 5437,
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

async function queryDatabaseStructure() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}\n`);
    
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // 1. List all tables related to homepage and content types
    console.log('═'.repeat(60));
    console.log('📋 1. ALL STRAPI TABLES');
    console.log('═'.repeat(60));
    
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    const tables = await client.query(tablesQuery);
    console.log('\nAll tables in database:');
    tables.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // 2. Find homepage-related tables
    console.log('\n' + '═'.repeat(60));
    console.log('📋 2. HOMEPAGE RELATED TABLES');
    console.log('═'.repeat(60));
    
    const homepageTablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND (table_name LIKE '%homepage%' OR table_name LIKE '%home%')
      ORDER BY table_name;
    `;
    const homepageTables = await client.query(homepageTablesQuery);
    console.log('\nHomepage tables:');
    homepageTables.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // 3. Query homepage table structure
    console.log('\n' + '═'.repeat(60));
    console.log('📋 3. HOMEPAGE TABLE STRUCTURE');
    console.log('═'.repeat(60));
    
    const homepageStructureQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'homepages'
      ORDER BY ordinal_position;
    `;
    const homepageStructure = await client.query(homepageStructureQuery);
    console.log('\nHomepage columns:');
    homepageStructure.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    // 4. Query homepage data
    console.log('\n' + '═'.repeat(60));
    console.log('📋 4. HOMEPAGE DATA');
    console.log('═'.repeat(60));
    
    try {
      const homepageDataQuery = `SELECT * FROM homepages LIMIT 1;`;
      const homepageData = await client.query(homepageDataQuery);
      if (homepageData.rows.length > 0) {
        console.log('\nHomepage record:');
        const record = homepageData.rows[0];
        Object.keys(record).forEach(key => {
          const value = record[key];
          const displayValue = typeof value === 'object' ? JSON.stringify(value).substring(0, 100) + '...' : value;
          console.log(`   - ${key}: ${displayValue}`);
        });
      }
    } catch (e) {
      console.log('   No homepages table found or empty');
    }

    // 5. Query component tables (homepage components)
    console.log('\n' + '═'.repeat(60));
    console.log('📋 5. COMPONENT TABLES (homepage.* components)');
    console.log('═'.repeat(60));
    
    const componentTablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE 'components_homepage_%'
      ORDER BY table_name;
    `;
    const componentTables = await client.query(componentTablesQuery);
    console.log('\nHomepage component tables:');
    componentTables.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // 6. Query strapi_core_store_settings for content types
    console.log('\n' + '═'.repeat(60));
    console.log('📋 6. CONTENT TYPE DEFINITIONS');
    console.log('═'.repeat(60));
    
    const contentTypesQuery = `
      SELECT key, value::text 
      FROM strapi_core_store_settings 
      WHERE key LIKE '%content_types%' 
         OR key LIKE '%homepage%'
      LIMIT 10;
    `;
    try {
      const contentTypes = await client.query(contentTypesQuery);
      console.log('\nContent type settings:');
      contentTypes.rows.forEach(row => {
        console.log(`   - ${row.key}`);
      });
    } catch (e) {
      console.log('   Could not query strapi_core_store_settings');
    }

    // 7. Query for about-us related tables
    console.log('\n' + '═'.repeat(60));
    console.log('📋 7. ABOUT-US RELATED TABLES');
    console.log('═'.repeat(60));
    
    const aboutUsTablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND (table_name LIKE '%about%' OR table_name LIKE '%customer%')
      ORDER BY table_name;
    `;
    const aboutUsTables = await client.query(aboutUsTablesQuery);
    console.log('\nAbout-us and customer tables:');
    aboutUsTables.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // 8. Query for pages table
    console.log('\n' + '═'.repeat(60));
    console.log('📋 8. PAGES TABLE STRUCTURE');
    console.log('═'.repeat(60));
    
    const pagesStructureQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'pages'
      ORDER BY ordinal_position;
    `;
    try {
      const pagesStructure = await client.query(pagesStructureQuery);
      console.log('\nPages columns:');
      pagesStructure.rows.forEach(row => {
        console.log(`   - ${row.column_name}: ${row.data_type}`);
      });
    } catch (e) {
      console.log('   No pages table found');
    }

    // 9. Check for existing customer page in pages
    console.log('\n' + '═'.repeat(60));
    console.log('📋 9. EXISTING PAGES DATA');
    console.log('═'.repeat(60));
    
    try {
      const pagesDataQuery = `SELECT id, title, slug FROM pages;`;
      const pagesData = await client.query(pagesDataQuery);
      console.log('\nExisting pages:');
      pagesData.rows.forEach(row => {
        console.log(`   - [${row.id}] ${row.title} (/${row.slug})`);
      });
    } catch (e) {
      console.log('   Could not query pages');
    }

    // 10. Query layout/components link tables
    console.log('\n' + '═'.repeat(60));
    console.log('📋 10. COMPONENT LINK TABLES');
    console.log('═'.repeat(60));
    
    const linkTablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND (table_name LIKE '%_links' OR table_name LIKE '%components%links%')
      ORDER BY table_name;
    `;
    const linkTables = await client.query(linkTablesQuery);
    console.log('\nComponent link tables:');
    linkTables.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // Summary
    console.log('\n' + '═'.repeat(60));
    console.log('📋 SUMMARY');
    console.log('═'.repeat(60));
    console.log('\nHomepage Single Type Pattern:');
    console.log('   1. Main table: homepages (stores single type data)');
    console.log('   2. Component tables: components_homepage_* (stores reusable components)');
    console.log('   3. Link tables: homepages_components (links components to homepage)');
    console.log('\nTo create Customer Single Type, we need:');
    console.log('   1. Create customer-page single type via Strapi API');
    console.log('   2. Define layout components (customers.hero, customers.testimonials, etc.)');
    console.log('   3. Link components to the single type');

    console.log('\n✅ Database analysis complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Database connection refused. Check if PostgreSQL is running.');
    }
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the script
queryDatabaseStructure();
