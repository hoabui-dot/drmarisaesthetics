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
    
    console.log('Seeding Papers Section...');
    
    // Check if tables exist (Strapi must have synced them first)
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'components_homepage_papers_sections'
      );
    `);
    
    if (!checkTable.rows[0].exists) {
      console.warn('⚠️ Table components_homepage_papers_sections does not exist yet. Please restart Strapi to sync schemas before running this migration.');
      // Create minimal tables to suppress errors but warn the user
      await client.query('ROLLBACK');
      process.exit(0);
    }

    // 1. Insert Papers Section
    const sectionRes = await client.query(`
      INSERT INTO components_homepage_papers_sections (title, subtitle)
      VALUES ('Research Publications', 'Our latest scientific papers and contributions')
      RETURNING id;
    `);
    const sectionId = sectionRes.rows[0].id;
    console.log(`Inserted section with ID: ${sectionId}`);

    // 2. Link section to homepage
    // We assume homepage is ID 1 (Standard for Single Types)
    const homepageRes = await client.query(`SELECT id FROM homepages LIMIT 1`);
    if (homepageRes.rows.length > 0) {
      const homeId = homepageRes.rows[0].id;
      // Get max order
      const maxOrderRes = await client.query(`
        SELECT MAX(item_order) as max_order FROM homepages_components WHERE entity_id = $1
      `, [homeId]);
      const nextOrder = (maxOrderRes.rows[0].max_order || 0) + 1;

      await client.query(`
        INSERT INTO homepages_components (
          entity_id, component_id, component_type, field, item_order
        ) VALUES (
          $1, $2, 'homepage.papers-section', 'layout', $3
        )
      `, [homeId, sectionId, nextOrder]);
      console.log('Linked section to Homepage ID 1');
    }

    // 3. Insert Dummy Papers
    const dummyPapers = [
      { name: 'Advanced Clinical Excellence in Digital Dentistry 2025', link: 'https://example.com/paper1' },
      { name: 'Revolutionary Orthodontic Techniques', link: 'https://example.com/paper2' },
      { name: 'Pediatric Dental Innovations', link: 'https://example.com/paper3' }
    ];

    for (let i = 0; i < dummyPapers.length; i++) {
      const paper = dummyPapers[i];
      const paperRes = await client.query(`
        INSERT INTO components_homepage_paper_items (name, link)
        VALUES ($1, $2)
        RETURNING id;
      `, [paper.name, paper.link]);
      const paperId = paperRes.rows[0].id;

      // Notice: strapi automatically creates a link table for repeatable components 
      // with name format {entityTypeName}_components_links 
      // Actually it's usually {entity_table_name}_{component_field_name}_links
      // -> components_homepage_papers_sections_papers_links
      
      const linkTableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'components_homepage_papers_sections_papers_links'
        );
      `);

      if (linkTableCheck.rows[0].exists) {
        await client.query(`
          INSERT INTO components_homepage_papers_sections_papers_links (
            papers_section_id, paper_item_id, paper_item_order
          ) VALUES ($1, $2, $3)
        `, [sectionId, paperId, i + 1]);
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
