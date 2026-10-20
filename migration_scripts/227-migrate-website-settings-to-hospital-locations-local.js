#!/usr/bin/env node

/**
 * Move the verified CIH address into Website Settings' hospital_locations.
 * Local database only. Dry-run by default; pass --write after reviewing the plan.
 * Run with: node --env-file=strapi-cms/.env migration_scripts/227-migrate-website-settings-to-hospital-locations-local.js
 */
const { createRequire } = require('node:module')
const { Client } = createRequire(`${process.cwd()}/strapi-cms/package.json`)('pg')

const WRITE = process.argv.includes('--write')
const CIH_NAME = 'City International Hospital'
// This verified CIH address was already used by migration 225 and in the old
// Website Settings value before the schema reload removed that legacy column.
const CIH_ADDRESS = 'No. 3, Street 17A, An Lac Ward, Ho Chi Minh City, Vietnam'
// CIH pin, cross-checked against the facility location and mapped building.
const CIH_LATITUDE = 10.7410059
const CIH_LONGITUDE = 106.609141
const CIH_MAPS_EMBED_URL = 'https://www.google.com/maps?q=City%20International%20Hospital%2C%203%20%C4%90%C6%B0%E1%BB%9Dng%20S%E1%BB%91%2017A%2C%20An%20L%E1%BA%A1c%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam&z=17&output=embed'

async function main() {
  const host = process.env.DATABASE_HOST || ''
  const database = process.env.DATABASE_NAME || ''
  if (!['localhost', '127.0.0.1', '::1'].includes(host) || !/(local|test)/i.test(database)) {
    throw new Error(`Local-only migration refused database host/name: ${host}/${database}`)
  }

  const client = new Client({ host, port: Number(process.env.DATABASE_PORT || 5432), database, user: process.env.DATABASE_USERNAME, password: process.env.DATABASE_PASSWORD })
  await client.connect()
  try {
    await client.query('BEGIN')
    const settings = await client.query('SELECT id, document_id, published_at FROM public.website_settings ORDER BY id FOR UPDATE')
    if (!settings.rowCount) throw new Error('Website Settings record is missing.')

    const plan = []
    for (const setting of settings.rows) {
      const address = CIH_ADDRESS
      const existing = await client.query(
        `SELECT location.id, relation."order"
           FROM public.website_settings_cmps relation
           JOIN public.components_website_setting_hospital_locations location ON location.id = relation.cmp_id
          WHERE relation.entity_id = $1 AND relation.field = 'hospital_locations'
            AND relation.component_type = 'website-setting.hospital-location'
            AND location.location_key = 'CIH' LIMIT 1`, [setting.id],
      )
      plan.push({ setting, address, existing: existing.rows[0] || null })
    }

    console.log(JSON.stringify({ mode: WRITE ? 'write' : 'dry-run', targetDatabase: database, versions: plan.map(({ setting, address, existing }) => ({ id: setting.id, documentId: setting.document_id, published: Boolean(setting.published_at), action: existing ? 'update CIH component' : 'append CIH component', address, latitude: CIH_LATITUDE, longitude: CIH_LONGITUDE, maps_embed_url: CIH_MAPS_EMBED_URL })) }, null, 2))
    if (!WRITE) { await client.query('ROLLBACK'); return }

    await client.query(`
      ALTER TABLE public.components_website_setting_hospital_locations
        ALTER COLUMN latitude DROP NOT NULL,
        ALTER COLUMN longitude DROP NOT NULL
    `)

    for (const { setting, address, existing } of plan) {
      let componentId = existing?.id
      if (componentId) {
        await client.query(
          `UPDATE public.components_website_setting_hospital_locations
              SET name = $2, address = $3, latitude = $4, longitude = $5, maps_embed_url = $6
            WHERE id = $1`, [componentId, CIH_NAME, address, CIH_LATITUDE, CIH_LONGITUDE, CIH_MAPS_EMBED_URL],
        )
      } else {
        const inserted = await client.query(
          `INSERT INTO public.components_website_setting_hospital_locations
             (location_key, name, address, latitude, longitude, maps_embed_url)
           VALUES ('CIH', $1, $2, $3, $4, $5) RETURNING id`, [CIH_NAME, address, CIH_LATITUDE, CIH_LONGITUDE, CIH_MAPS_EMBED_URL],
        )
        componentId = inserted.rows[0].id
        const orderResult = await client.query(`SELECT COALESCE(MAX("order"), -1) + 1 AS next_order FROM public.website_settings_cmps WHERE entity_id = $1 AND field = 'hospital_locations'`, [setting.id])
        await client.query(
          `INSERT INTO public.website_settings_cmps (entity_id, cmp_id, component_type, field, "order")
           VALUES ($1, $2, 'website-setting.hospital-location', 'hospital_locations', $3)`,
          [setting.id, componentId, orderResult.rows[0].next_order],
        )
      }
    }

    const verify = await client.query(
      `SELECT settings.id, locations.name, locations.address, locations.latitude, locations.longitude, locations.maps_embed_url
         FROM public.website_settings settings
         JOIN public.website_settings_cmps relation ON relation.entity_id = settings.id AND relation.field = 'hospital_locations'
         JOIN public.components_website_setting_hospital_locations locations ON locations.id = relation.cmp_id
        WHERE locations.location_key = 'CIH' ORDER BY settings.id`,
    )
    if (verify.rowCount !== plan.length || verify.rows.some((row) => row.name !== CIH_NAME || row.address !== CIH_ADDRESS || Number(row.latitude) !== CIH_LATITUDE || Number(row.longitude) !== CIH_LONGITUDE || row.maps_embed_url !== CIH_MAPS_EMBED_URL)) {
      throw new Error('Post-write verification failed for CIH hospital location data.')
    }
    await client.query('COMMIT')
    console.log(JSON.stringify({ result: 'migrated', verifiedVersions: verify.rowCount, locations: verify.rows }, null, 2))
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally { await client.end() }
}

main().catch((error) => { console.error(`[website-setting-hospital-locations-local] ${error.message}`); process.exitCode = 1 })
