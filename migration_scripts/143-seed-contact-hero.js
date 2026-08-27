#!/usr/bin/env node

/** Seed the Contact Hero image and its four CMS-owned quick-contact cards. */
const { Client } = require('pg');

const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const SOURCE_IMAGE_URL = 'https://www.djurkovicdent.me/assets/images/djurkovic/004A9829.jpg';
const IMAGE_NAME = 'contact-hero-clinic-consultation.jpg';
const client = new Client({
  host: process.env.DATABASE_HOST || 'dental-postgres',
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

const cards = [
  ['Hotline', '1800 8888', 'Tư vấn & đặt lịch miễn phí 24/7', 'phone', 'tel:18008888'],
  ['Địa chỉ', '233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam', '', 'location', 'https://www.google.com/maps/search/?api=1&query=233%20%E2%80%93%20233A%20Nguyễn%20Trọng%20Tuyển%2C%20Phường%20Phú%20Nhuận%2C%20TP.%20Hồ%20Chí%20Minh%2C%20Việt%20Nam'],
  ['Email', 'info@smiluxdental.vn', 'Phản hồi trong 30 phút', 'email', 'mailto:info@smiluxdental.vn'],
  ['Giờ làm việc', 'Thứ 2 – Chủ nhật\n08:00 – 20:00', '', 'clock', ''],
];

async function api(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, { ...options, headers: { Authorization: `Bearer ${API_TOKEN}`, ...(options.headers || {}) } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function uploadImage() {
  const existing = await api(`/api/upload/files?filters[name][$eq]=${encodeURIComponent(IMAGE_NAME)}&pagination[pageSize]=1`);
  if (existing?.[0]) return existing[0].id;
  const source = await fetch(SOURCE_IMAGE_URL);
  if (!source.ok) throw new Error(`Image download failed: ${source.status} ${SOURCE_IMAGE_URL}`);
  const blob = await source.blob();
  const form = new FormData();
  form.append('files', blob, IMAGE_NAME);
  form.append('fileInfo', JSON.stringify({ name: IMAGE_NAME, alternativeText: 'Bác sĩ tư vấn điều trị nha khoa cho bệnh nhân tại phòng khám hiện đại' }));
  const uploaded = await api('/api/upload', { method: 'POST', body: form });
  return uploaded[0].id;
}

async function linkMedia(fileId, relatedId, relatedType, field) {
  await client.query('DELETE FROM files_related_mph WHERE related_type = $1 AND related_id = $2 AND field = $3', [relatedType, relatedId, field]);
  await client.query('INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order") VALUES ($1, $2, $3, $4, 1)', [fileId, relatedId, relatedType, field]);
}

async function run() {
  if (!API_TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const imageId = await uploadImage();
  await client.connect();
  try {
    await client.query('BEGIN');
    const heroes = await client.query("SELECT cmp_id FROM contact_pages_cmps WHERE field = 'layout' AND component_type = 'contact.hero' ORDER BY entity_id");
    for (const hero of heroes.rows) {
      await client.query('UPDATE components_contact_heroes SET title = $1, subtitle = $2, description = $3 WHERE id = $4', [
        'Liên hệ Smilux',
        'Tư vấn – Đặt lịch – Hỗ trợ điều trị Implant',
        'Đội ngũ chuyên gia của Smilux luôn sẵn sàng lắng nghe và đồng hành cùng bạn trên hành trình kiến tạo nụ cười khỏe đẹp. Liên hệ với chúng tôi để được tư vấn và đặt lịch khám nhanh chóng.',
        hero.cmp_id,
      ]);
      await linkMedia(imageId, hero.cmp_id, 'contact.hero', 'hero_image');

      const old = await client.query("SELECT cmp_id FROM components_contact_heroes_cmps WHERE entity_id = $1 AND field = 'contact_cards'", [hero.cmp_id]);
      await client.query("DELETE FROM components_contact_heroes_cmps WHERE entity_id = $1 AND field = 'contact_cards'", [hero.cmp_id]);
      for (const row of old.rows) await client.query('DELETE FROM components_contact_quick_contact_cards WHERE id = $1', [row.cmp_id]);
      for (let index = 0; index < cards.length; index += 1) {
        const item = await client.query('INSERT INTO components_contact_quick_contact_cards (label, value, supporting_text, icon, href) VALUES ($1, $2, $3, $4, $5) RETURNING id', cards[index]);
        await client.query("INSERT INTO components_contact_heroes_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'contact.quick-contact-card', 'contact_cards', $3)", [hero.cmp_id, item.rows[0].id, index]);
      }
    }
    await client.query('COMMIT');
    console.log(`[CONTACT HERO] seeded ${heroes.rows.length} hero components with image ${imageId} and ${cards.length} cards each`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => { console.error(`[CONTACT HERO] failed: ${error.message}`); process.exitCode = 1; });
