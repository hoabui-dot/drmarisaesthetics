#!/usr/bin/env node

/**
 * Keep every persisted clinic-address field on the approved single location.
 * This migration intentionally updates the current CMS records, including
 * legacy components still referenced by older page data.
 */
const { Client } = require('pg');

const client = new Client({
  host: process.env.DATABASE_HOST || 'dental-postgres',
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

const ADDRESS = '233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam';
const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

async function updateColumn(table, column) {
  const result = await client.query(`UPDATE "${table}" SET "${column}" = $1 WHERE "${column}" IS DISTINCT FROM $1`, [ADDRESS]);
  return result.rowCount || 0;
}

async function run() {
  await client.connect();
  try {
    await client.query('BEGIN');

    let updated = 0;
    for (const [table, column] of [
      ['components_about_bookings', 'address'],
      ['components_contact_address_tiles', 'address_text'],
      ['components_contact_map_sections', 'address'],
      ['components_contact_map_sections', 'map_address'],
      ['components_footer_contact_infos', 'address'],
      ['components_homepage_consultations', 'address'],
      ['components_service_detail_consultation_sections', 'address'],
    ]) {
      updated += await updateColumn(table, column);
    }

    const directions = await client.query(
      'UPDATE components_contact_map_sections SET directions_url = $1 WHERE directions_url IS DISTINCT FROM $1',
      [MAP_URL],
    );
    updated += directions.rowCount || 0;

    const quickCards = await client.query(
      `UPDATE components_contact_quick_contact_cards
       SET value = $1, href = $2
       WHERE icon = 'location' OR label IN ('Địa chỉ', 'Address')`,
      [ADDRESS, MAP_URL],
    );
    updated += quickCards.rowCount || 0;

    const locations = await client.query(
      `UPDATE components_contact_select_options
       SET label = 'Smilux - Phú Nhuận', value = 'smilux-phu-nhuan'
       WHERE label = 'Smilux - Quận 1' OR value = 'smilux-district-1'`,
    );
    updated += locations.rowCount || 0;

    const benefits = await client.query(
      `UPDATE components_contact_location_benefits
       SET text = CASE
         WHEN text ILIKE '%Quận 1%' OR text ILIKE '%Nhà hát Thành phố%' THEN 'Thuận tiện di chuyển từ Phường Phú Nhuận'
         ELSE text
       END
       WHERE text ILIKE '%Quận 1%' OR text ILIKE '%Nhà hát Thành phố%'`,
    );
    updated += benefits.rowCount || 0;

    await client.query('COMMIT');
    console.log(`[CLINIC ADDRESS] updated ${updated} persisted fields to ${ADDRESS}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(`[CLINIC ADDRESS] failed: ${error.message}`);
  process.exitCode = 1;
});
