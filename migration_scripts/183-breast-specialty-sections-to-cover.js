#!/usr/bin/env node

/**
 * Breast Augmentation: the consecutive implant/revision modules are visual
 * chapters, not card tiles. Keep their existing media and render each image
 * as a full-width background cover in the frontend.
 */
const { Client } = require('pg')

const client = new Client({
  host: process.env.DATABASE_HOST || 'dental-postgres',
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || 'dental_cms_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
})

const SECTION_KEYS = [
  'specialty',
  'specialty-motiva-options',
  'specialty-augmentation-vs-lift',
  'specialty-breast-revision',
]

async function run() {
  await client.connect()
  try {
    await client.query('BEGIN')
    const result = await client.query(
      `UPDATE components_service_detail_specialty_sections AS section
       SET image_layout = 'cover'
       WHERE section.section_key = ANY($1::text[])
         AND EXISTS (
           SELECT 1
           FROM service_details_cmps AS link
           JOIN service_details AS service ON service.id = link.entity_id
           WHERE link.cmp_id = section.id
             AND link.component_type = 'service-detail.specialty-section'
             AND service.slug = 'breast-augmentation'
         )`,
      [SECTION_KEYS],
    )
    await client.query('COMMIT')
    console.log(`[breast-augmentation] ${result.rowCount || 0} specialty sections set to cover`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    await client.end()
  }
}

run().catch((error) => {
  console.error('[breast-augmentation] migration failed:', error.message)
  process.exitCode = 1
})
