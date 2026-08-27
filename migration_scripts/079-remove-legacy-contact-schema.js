const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../strapi-cms/.env') });

const dbHost = '100.68.50.41';

const pool = new Pool({
  host: dbHost,
  port: process.env.DATABASE_PORT || 5437,
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log('Dropping legacy Contact Page components from Postgres...');

    // Drop tables if they exist
    const tablesToDrop = [
      'components_contact_ctas',
      'components_contact_forms',
      'components_contact_bento_grids',
      'components_contact_quick_contact_cards',
      'components_contact_map_sections',
      
      // Cleanup generic join tables
      'components_contact_forms_components',
      'components_contact_forms_fields_links',
      'components_contact_ctas_components'
    ];

    for (const tableName of tablesToDrop) {
      await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE;`);
      console.log(`✅ Dropped table: ${tableName}`);
    }

    // Clean up mapping rows from contact_pages_components
    // 'field' mapped from previous contact page config.
    await client.query(`
      DELETE FROM contact_pages_components 
      WHERE field IN ('cta', 'contact_form', 'bento_grid', 'quick_contact_cards', 'map_section');
    `);
    console.log('✅ Cleaned up old mapping links in contact_pages_components.');

    await client.query('COMMIT');
    console.log('Migration completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

main();
