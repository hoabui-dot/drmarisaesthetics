/**
 * Migration script for About Us Hero Title (Recovery + Migration)
 * 
 * Recreates the multi-line structure since the original title column was dropped by Strapi.
 */

const { Client } = require('pg');

async function migrate() {
  const client = new Client({
    host: '100.68.50.41',
    port: 5437,
    user: 'postgres',
    password: 'postgres',
    database: 'dental_cms_strapi',
  });

  const RECOVERED_TITLE = 'About Saigon International Dental Clinic: Dental Care in VN';
  // Split into lines for the professional look
  const TITLE_LINES = [
    'About Saigon',
    'International Dental Clinic'
  ];

  try {
    await client.connect();
    console.log('Connected to database');

    const { rows: heroes } = await client.query('SELECT id FROM components_about_heroes;');
    console.log(`Found ${heroes.length} heroes to fix`);

    for (const hero of heroes) {
      console.log(`Processing hero ID ${hero.id}`);

      // Check if already has titleLines
      const { rows: existing } = await client.query(
        'SELECT id FROM components_about_heroes_cmps WHERE entity_id = $1 AND field = \'titleLines\';',
        [hero.id]
      );

      if (existing.length > 0) {
        console.log(`  Hero ID ${hero.id} already has titleLines. Skipping.`);
        continue;
      }

      for (let i = 0; i < TITLE_LINES.length; i++) {
        const lineText = TITLE_LINES[i];
        
        // Insert into components_homepage_title_lines
        const { rows: titleLineRows } = await client.query(
          'INSERT INTO components_homepage_title_lines (text) VALUES ($1) RETURNING id;',
          [lineText]
        );
        const titleLineId = titleLineRows[0].id;

        // Link to hero in components_about_heroes_cmps
        await client.query(
          'INSERT INTO components_about_heroes_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, $3, $4, $5);',
          [hero.id, titleLineId, 'homepage.title-line', 'titleLines', i]
        );
        
        console.log(`  Added line: "${lineText}" (ID: ${titleLineId})`);
      }
    }

    console.log('Migration complete');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
