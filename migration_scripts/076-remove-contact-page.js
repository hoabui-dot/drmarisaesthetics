const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../strapi-cms/.env') });

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5437,
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log('Removing generic "Contact Us" page to switch to Single Type...');

    // 1. Find the page IDs
    const findRes = await client.query(`
      SELECT id FROM pages WHERE slug = 'contact' OR title LIKE '%Contact Us%';
    `);

    if (findRes.rows.length === 0) {
      console.log('No generic Contact pages found. It might have already been removed.');
    } else {
      const ids = findRes.rows.map(r => r.id);
      console.log(`Found conflicting legacy contact pages with IDs: ${ids.join(', ')}`);

      // 2. Delete relationships (dynamic zones / components typically linked via pages_components table)
      // First, get the component IDs linked to these pages so we can delete the component instances if we want to be thorough.
      // But typically Strapi cascading or just left orphaned components is fine for a quick cleanup.
      // Easiest is to delete from pages_components if it exists.
      const checkRelTable = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'pages_components'
        );
      `);

      if (checkRelTable.rows[0].exists) {
        await client.query(`
          DELETE FROM pages_components WHERE entity_id = ANY($1::int[])
        `, [ids]);
        console.log('Cleared legacy component links.');
      }

      // 3. Delete the actual pages
      const deleteRes = await client.query(`
        DELETE FROM pages WHERE id = ANY($1::int[])
      `, [ids]);

      console.log(`Successfully deleted ${deleteRes.rowCount} legacy contact pages.`);
    }

    await client.query('COMMIT');
    console.log('Migration completed safely.');
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
