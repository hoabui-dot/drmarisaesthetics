#!/usr/bin/env node

/** Seed the final About Us booking section for draft and published records. */
const { Client } = require('pg');

const client = new Client({
  host: process.env.DATABASE_HOST || '100.68.50.41',
  port: Number(process.env.DATABASE_PORT || 5437),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

const BOOKING = {
  heading: 'Book a Consultation',
  clinicName: 'Smilux Dental Clinic',
  address: '233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam',
  phone: '+84396877518',
  email: 'sgnhakhoaquocte@gmail.com',
  openingHours: 'Mon – Sun: 8:00 AM – 7:00 PM',
  imageId: 359,
};

async function run() {
  await client.connect();
  try {
    await client.query('BEGIN');
    const pages = await client.query('SELECT id FROM about_pages ORDER BY id');
    for (const page of pages.rows) {
      await client.query("DELETE FROM about_pages_cmps WHERE entity_id = $1 AND field = 'booking'", [page.id]);
      const booking = await client.query(
        'INSERT INTO components_about_bookings (heading, clinic_name, address, phone, email, opening_hours) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [BOOKING.heading, BOOKING.clinicName, BOOKING.address, BOOKING.phone, BOOKING.email, BOOKING.openingHours],
      );
      const bookingId = booking.rows[0].id;
      await client.query(
        "INSERT INTO about_pages_cmps (entity_id, cmp_id, component_type, field) VALUES ($1, $2, 'about.booking', 'booking')",
        [page.id, bookingId],
      );
      await client.query("DELETE FROM files_related_mph WHERE related_id = $1 AND related_type = 'about.booking' AND field = 'clinic_image'", [bookingId]);
      await client.query(
        "INSERT INTO files_related_mph (file_id, related_id, related_type, field, \"order\") VALUES ($1, $2, 'about.booking', 'clinic_image', 1)",
        [BOOKING.imageId, bookingId],
      );
    }
    await client.query('COMMIT');
    console.log(`[ABOUT BOOKING] seeded ${pages.rowCount} draft/published records with reception image ${BOOKING.imageId}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(`[ABOUT BOOKING] failed: ${error.message}`);
  process.exitCode = 1;
});
