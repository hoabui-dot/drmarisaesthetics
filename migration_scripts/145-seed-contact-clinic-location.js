#!/usr/bin/env node

/** Seed the Contact clinic-location section from the approved UI specification. */
const { Client } = require('pg');

const client = new Client({
  host: process.env.DATABASE_HOST || 'dental-postgres',
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

const benefits = [
  ['location', 'Thuận tiện di chuyển từ Phường Phú Nhuận'],
  ['landmark', 'Dễ dàng tiếp cận bằng ô tô và xe máy'],
  ['parking', 'Có bãi đậu xe ô tô và xe máy'],
];

const address = '233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam';
const mapAddress = address;
const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

async function seedSection(sectionId) {
  await client.query(`UPDATE components_contact_map_sections SET title = $1, address = $2, clinic_name = $3, map_address = $4, map_latitude = $5, map_longitude = $6, map_zoom = $7, directions_label = $8, directions_url = $9 WHERE id = $10`, [
    'Vị trí phòng khám', address, 'Smilux Dental Clinic', mapAddress, 10.776145, 106.676643, 16,
    'CHỈ ĐƯỜNG TRÊN GOOGLE MAPS', directionsUrl, sectionId,
  ]);

  await client.query('DELETE FROM components_contact_map_sections_cmps WHERE entity_id = $1 AND field = $2', [sectionId, 'benefits']);
  for (let index = 0; index < benefits.length; index += 1) {
    const result = await client.query('INSERT INTO components_contact_location_benefits (icon, text) VALUES ($1, $2) RETURNING id', benefits[index]);
    await client.query('INSERT INTO components_contact_map_sections_cmps (entity_id, cmp_id, component_type, field, "order") VALUES ($1, $2, $3, $4, $5)', [sectionId, result.rows[0].id, 'contact.location-benefit', 'benefits', index]);
  }
}

async function run() {
  await client.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query("SELECT DISTINCT cmp_id FROM contact_pages_cmps WHERE field = 'layout' AND component_type = 'contact.map-section'");
    for (const row of result.rows) await seedSection(row.cmp_id);
    await client.query('COMMIT');
    console.log(`[CONTACT LOCATION] seeded ${result.rows.length} map sections`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => { console.error(`[CONTACT LOCATION] failed: ${error.message}`); process.exitCode = 1; });
