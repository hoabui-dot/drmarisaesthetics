const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../strapi-cms/.env') });

// OVERRIDE FOR PG HOST AS PER USER DB
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
    
    console.log('Migrating Bento Grid data into contact_pages...');

    // 1. Check if the component table exists (Wait for Strapi to sync schemas)
    const checkTable = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE tablename = 'components_contact_bento_grids';
    `);

    if (checkTable.rows.length === 0) {
      console.warn('❌ Table components_contact_bento_grids does NOT exist yet!');
      console.warn('Please make sure Strapi server has restarted after creating the schema, which allows Strapi to auto-generate the Postgres table.');
      process.exit(1);
    }

    // 2. Insert the Bento Grid Component Data
    // We generate a custom ID or let sequence do it
    const insertRes = await client.query(`
      INSERT INTO components_contact_bento_grids (
        section_title, section_subtitle, 
        card_a_title, card_b_title, card_b_tag, 
        card_c_title, card_d_title, card_d_text
      ) VALUES (
        'International Hub',
        'World-class dental care standards delivered at the heart of Ho Chi Minh City.',
        'Heart of Ho Chi Minh City',
        'High-Tech Care',
        'Specialized Dental',
        'Global Payment & Insurance Partners',
        'Direct Assist 24/7',
        'Live Chat Now'
      ) RETURNING id;
    `);

    const bentoGridId = insertRes.rows[0].id;
    console.log(`✅ Inserted Bento Grid Component with ID: ${bentoGridId}`);

    // 3. Link the Bento Grid Component to the existing Contact Page
    // Assuming there is 1 contact page row due to Single Type, we link it up.
    // Table is likely contact_pages_components
    
    const pageCheck = await client.query(`SELECT id FROM contact_pages ORDER BY id ASC LIMIT 1;`);
    if (pageCheck.rows.length === 0) {
      console.warn('❌ contact_pages table is empty.');
    } else {
      const pageId = pageCheck.rows[0].id;
      
      // Look for the correct linkage terminology. Strapi v5 often uses entity_id, cmp_id, field
      const linkTableCheck = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'contact_pages_components'
      `);

      if (linkTableCheck.rows.length > 0) {
        // Link Table exists. Insert mapping:
        // usually: entity_id = contact_page id, component_id = bento grid id, component_type = 'contact.bento-grid', field = 'bento_grid'
        // For standard Strapi 4/5: 'entity_id', 'component_id', 'component_type', 'field'
        
        // Remove old mapping if exists to avoid duplicates
        await client.query(`
           DELETE FROM contact_pages_components 
           WHERE entity_id = $1 AND field = 'bento_grid';
        `, [pageId]);

        await client.query(`
          INSERT INTO contact_pages_components (
            entity_id, cmp_id, component_type, field, "order"
          ) VALUES (
            $1, $2, 'contact.bento-grid', 'bento_grid', 1
          )
        `, [pageId, bentoGridId]);

        console.log(`✅ Linked Bento Grid (ID: ${bentoGridId}) to Contact Page (ID: ${pageId})`);
      }
    }

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
