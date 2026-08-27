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
    
    console.log('Migrating Contact Hero to include CTA label...');

    // 1. Add Column (Safely)
    // In Strapi v5, table names correspond to the collectionName in schema
    // components_contact_heroes
    const checkCol = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='components_contact_heroes' 
      AND column_name='cta_label';
    `);

    if (checkCol.rows.length === 0) {
      await client.query(`
        ALTER TABLE components_contact_heroes 
        ADD COLUMN cta_label VARCHAR(255)
      `);
      console.log('Added cta_label column to components_contact_heroes');
    } else {
      console.log('cta_label column already exists');
    }

    // 2. Update existing rows with the "Gateway of Connection" aesthetic content
    // We update the only/all contact heroes
    const updateRes = await client.query(`
      UPDATE components_contact_heroes
      SET 
        title = 'Contact Saigon International Dental Clinic.',
        subtitle = 'Experience the next level of dental care. Reach out instantly and let our experts guide you to your perfect smile.',
        cta_label = 'Instant Consultation'
    `);
    
    console.log(`Updated ${updateRes.rowCount} hero rows with 2026 aesthetics texts.`);

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
