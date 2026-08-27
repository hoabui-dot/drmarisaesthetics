#!/usr/bin/env node

/** Seed the Contact consultation section immediately after Contact Hero. */
const { Client } = require('pg');

const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const SOURCE_IMAGE_URL = 'https://hospiten.com/hs-fs/hubfs/medicos/250612_HOSPITEN%20LANZAROTE-12.jpg?height=2160&name=250612_HOSPITEN%2BLANZAROTE-12.jpg&width=3240';
const IMAGE_NAME = 'contact-consultation-advisor.jpg';
const locations = [['Smilux - Phú Nhuận', 'smilux-phu-nhuan']];
const contacts = [
  ['hotline', 'Hotline 24/7', '1800 8888', 'tel:18008888'],
  ['zalo', 'Zalo OA', 'Smilux Dental Clinic', 'https://zalo.me/866118687837492387'],
  ['whatsapp', 'WhatsApp', '(+84) 90 123 4567', 'https://wa.me/84901234567'],
  ['email', 'Email', 'info@smiluxdental.vn', 'mailto:info@smiluxdental.vn'],
];
const client = new Client({ host: process.env.DATABASE_HOST || 'dental-postgres', port: Number(process.env.DATABASE_PORT || 5432), database: process.env.DATABASE_NAME || 'dental_cms_strapi', user: process.env.DATABASE_USERNAME || 'postgres', password: process.env.DATABASE_PASSWORD || 'postgres' });

async function api(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, { ...options, headers: { Authorization: `Bearer ${API_TOKEN}`, ...(options.headers || {}) } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function uploadAdvisor() {
  const existing = await api(`/api/upload/files?filters[name][$eq]=${encodeURIComponent(IMAGE_NAME)}&pagination[pageSize]=1`);
  if (existing?.[0]) return existing[0].id;
  const source = await fetch(SOURCE_IMAGE_URL);
  if (!source.ok) throw new Error(`Advisor image download failed: ${source.status}`);
  const form = new FormData();
  form.append('files', await source.blob(), IMAGE_NAME);
  form.append('fileInfo', JSON.stringify({ name: IMAGE_NAME, alternativeText: 'Bác sĩ tư vấn nha khoa Smilux' }));
  const uploaded = await api('/api/upload', { method: 'POST', body: form });
  return uploaded[0].id;
}

async function linkMedia(fileId, relatedId, relatedType, field) {
  await client.query('DELETE FROM files_related_mph WHERE related_type = $1 AND related_id = $2 AND field = $3', [relatedType, relatedId, field]);
  await client.query('INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order") VALUES ($1, $2, $3, $4, 1)', [fileId, relatedId, relatedType, field]);
}

async function seedOptions(sectionId, field, values) {
  for (let index = 0; index < values.length; index += 1) {
    const option = await client.query('INSERT INTO components_contact_select_options (label, value) VALUES ($1, $2) RETURNING id', values[index]);
    await client.query("INSERT INTO components_contact_consultation_sections_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'contact.select-option', $3, $4)", [sectionId, option.rows[0].id, field, index]);
  }
}

async function seedContacts(sectionId) {
  for (let index = 0; index < contacts.length; index += 1) {
    const contact = await client.query('INSERT INTO components_contact_consultation_contacts (type, label, value, href) VALUES ($1, $2, $3, $4) RETURNING id', contacts[index]);
    await client.query("INSERT INTO components_contact_consultation_sections_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'contact.consultation-contact', 'contacts', $3)", [sectionId, contact.rows[0].id, index]);
  }
}

async function run() {
  if (!API_TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const advisorImageId = await uploadAdvisor();
  await client.connect();
  try {
    await client.query('BEGIN');
    const pages = await client.query("SELECT id FROM contact_pages WHERE id IN (SELECT entity_id FROM contact_pages_cmps WHERE field = 'layout' AND component_type = 'contact.hero') ORDER BY id");
    for (const page of pages.rows) {
      const existing = await client.query("SELECT id, cmp_id FROM contact_pages_cmps WHERE entity_id = $1 AND field = 'layout' AND component_type = 'contact.consultation-section'", [page.id]);
      let sectionId;
      if (existing.rows[0]) {
        sectionId = existing.rows[0].cmp_id;
        await client.query('DELETE FROM components_contact_consultation_sections_cmps WHERE entity_id = $1', [sectionId]);
        await client.query('DELETE FROM components_contact_consultation_sections WHERE id = $1', [sectionId]);
        await client.query('DELETE FROM contact_pages_cmps WHERE id = $1', [existing.rows[0].id]);
      }
      const section = await client.query(`INSERT INTO components_contact_consultation_sections (form_title, form_intro, privacy_policy_label, privacy_policy_href, submit_label, info_title, info_description, advisor_title, advisor_description, trust_title, trust_description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`, [
        'Đặt lịch hẹn / Gửi yêu cầu tư vấn',
        'Vui lòng điền thông tin để chúng tôi liên hệ hỗ trợ bạn sớm nhất.',
        'Chính sách bảo mật', '/privacy-policy', 'GỬI YÊU CẦU', 'Thông tin Smilux Dental',
        'Phòng khám chuyên sâu Implant và phục hình thẩm mỹ với công nghệ hiện đại, bác sĩ giàu kinh nghiệm.',
        'Bạn sẽ được tư vấn 1:1 cùng bác sĩ', 'Giải đáp chi tiết về tình trạng răng miệng, phương án điều trị và chi phí minh bạch.',
        'Tư vấn Implant miễn phí - Không áp lực', 'Cam kết bảo mật thông tin - Hỗ trợ tận tâm',
      ]);
      sectionId = section.rows[0].id;
      await linkMedia(advisorImageId, sectionId, 'contact.consultation-section', 'advisor_image');
      await seedOptions(sectionId, 'location_options', locations);
      await seedContacts(sectionId);
      await client.query("UPDATE contact_pages_cmps SET \"order\" = \"order\" + 1 WHERE entity_id = $1 AND field = 'layout' AND \"order\" >= 2", [page.id]);
      await client.query("INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, \"order\") VALUES ($1, $2, 'contact.consultation-section', 'layout', 2)", [page.id, sectionId]);
    }
    await client.query('COMMIT');
    console.log(`[CONTACT CONSULTATION] seeded ${pages.rows.length} sections with advisor image ${advisorImageId}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => { console.error(`[CONTACT CONSULTATION] failed: ${error.message}`); process.exitCode = 1; });
