#!/usr/bin/env node

/**
 * Idempotent, local-database seed for the HIU map location in Website Settings.
 * Dry-run by default. Loads strapi-cms/.env when run from repository root.
 */
const { createRequire } = require('node:module')
const { Client } = createRequire(`${process.cwd()}/strapi-cms/package.json`)('pg')

const WRITE = process.argv.includes('--write')
const HIU = {
  location_key: 'HIU',
  name: 'Hong Bang International University Hospital',
  address: '01 Street 10, Van Phuc 1 Residential Area, Hiep Binh Ward, Ho Chi Minh City 700000, Vietnam',
  // The Maps URL's !3d / !4d coordinates identify the place pin. The /@ pair
  // in the URL is only the viewport center and is not used for this marker.
  latitude: 10.8424391,
  longitude: 106.7115029,
  maps_place_url: 'https://www.google.com/maps/place/Hong+Bang+International+University+Hospital/@10.8424391,106.7067393,17z/data=!4m10!1m2!2m1!1zSG9uZyBCYW5nIEludGVybmF0aW9uYWwgVW5pdmVyc2l0eSBIb3NwaXRhbCwgMDEgxJDGsOG7nW5nIDEwLCBLaHUgbmjDoCDhu58gVuG6oW4gUGjDumMgMSwgSGnhu4dwIELDrG5oLCBI4buTIENow60gTWluaCA3MDAwMDAsIFZpZXRuYW0!3m6!1s0x3175290308d31623:0xde3183866f142a0f!8m2!3d10.8424391!4d106.7115029!15sCoYBSG9uZyBCYW5nIEludGVybmF0aW9uYWwgVW5pdmVyc2l0eSBIb3NwaXRhbCwgMDEgxJDGsOG7nW5nIDEwLCBLaHUgbmjDoCDhu58gVuG6oW4gUGjDumMgMSwgSGnhu4dwIELDrG5oLCBI4buTIENow60gTWluaCA3MDAwMDAsIFZpZXRuYW2SARN1bml2ZXJzaXR5X2hvc3BpdGFs4AEA!16s%2Fg%2F11lldfwggq?hl=en-GB&entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D',
}

async function main() {
  const host = process.env.DATABASE_HOST || ''
  const database = process.env.DATABASE_NAME || ''
  if (!['localhost', '127.0.0.1', '::1'].includes(host) || !/(local|test)/i.test(database)) {
    throw new Error(`Local-only seed refused database host/name: ${host}/${database}`)
  }

  const client = new Client({
    host,
    port: Number(process.env.DATABASE_PORT || 5432),
    database,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  })
  await client.connect()
  try {
    await client.query('BEGIN')
    const settings = await client.query(
      'SELECT id, document_id, published_at FROM public.website_settings ORDER BY id FOR UPDATE',
    )
    if (!settings.rowCount) throw new Error('Website Settings record does not exist in the local database.')

    const plan = []
    for (const setting of settings.rows) {
      const existing = await client.query(
        `SELECT relation.cmp_id, relation."order"
           FROM public.website_settings_cmps AS relation
           JOIN public.components_website_setting_hospital_locations AS location
             ON location.id = relation.cmp_id
          WHERE relation.entity_id = $1
            AND relation.component_type = 'website-setting.hospital-location'
            AND relation.field = 'hospital_locations'
            AND location.location_key = 'HIU'
          LIMIT 1`,
        [setting.id],
      )
      plan.push({ setting, existing: existing.rows[0] || null })
    }

    console.log(JSON.stringify({
      mode: WRITE ? 'write' : 'dry-run',
      targetDatabase: database,
      affectedWebsiteSettingVersions: plan.length,
      HIU,
      versions: plan.map(({ setting, existing }) => ({ id: setting.id, documentId: setting.document_id, published: Boolean(setting.published_at), action: existing ? 'update existing component' : 'add component', componentId: existing?.cmp_id ?? null })),
    }, null, 2))

    if (!WRITE) {
      await client.query('ROLLBACK')
      return
    }

    // Strapi's default PostgreSQL decimal scale is two places; widen before
    // writing so the seven-decimal GPS coordinates are not rounded.
    await client.query(`
      ALTER TABLE public.components_website_setting_hospital_locations
        ALTER COLUMN latitude TYPE numeric(10,7) USING latitude::numeric(10,7),
        ALTER COLUMN longitude TYPE numeric(10,7) USING longitude::numeric(10,7)
    `)

    for (const { setting, existing } of plan) {
      let componentId = existing?.cmp_id
      if (componentId) {
        await client.query(
          `UPDATE public.components_website_setting_hospital_locations
              SET name = $2, address = $3, latitude = $4, longitude = $5, maps_place_url = $6
            WHERE id = $1`,
          [componentId, HIU.name, HIU.address, HIU.latitude, HIU.longitude, HIU.maps_place_url],
        )
      } else {
        const inserted = await client.query(
          `INSERT INTO public.components_website_setting_hospital_locations
             (location_key, name, address, latitude, longitude, maps_place_url)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [HIU.location_key, HIU.name, HIU.address, HIU.latitude, HIU.longitude, HIU.maps_place_url],
        )
        componentId = inserted.rows[0].id
        const orderResult = await client.query(
          `SELECT COALESCE(MAX("order"), -1) + 1 AS next_order
             FROM public.website_settings_cmps
            WHERE entity_id = $1 AND field = 'hospital_locations'`,
          [setting.id],
        )
        await client.query(
          `INSERT INTO public.website_settings_cmps (entity_id, cmp_id, component_type, field, "order")
           VALUES ($1, $2, 'website-setting.hospital-location', 'hospital_locations', $3)`,
          [setting.id, componentId, orderResult.rows[0].next_order],
        )
      }
    }

    await client.query(`
      WITH setting AS (
        SELECT key, value::jsonb AS config
        FROM public.strapi_core_store_settings
        WHERE key = 'plugin_content_manager_configuration_content_types::api::website-setting.website-setting'
      ), has_field AS (
        SELECT key, config,
          EXISTS (
            SELECT 1
            FROM jsonb_array_elements(COALESCE(config #> '{layouts,edit}', '[]'::jsonb)) AS rows(row_data)
            CROSS JOIN LATERAL jsonb_array_elements(rows.row_data) AS fields(field)
            WHERE fields.field->>'name' = 'hospital_locations'
          ) AS present
        FROM setting
      )
      UPDATE public.strapi_core_store_settings AS target
         SET value = jsonb_set(
           has_field.config,
           '{layouts,edit}',
           COALESCE(has_field.config #> '{layouts,edit}', '[]'::jsonb)
             || jsonb_build_array(jsonb_build_array(jsonb_build_object('name', 'hospital_locations'))),
           true
         )::text
        FROM has_field
       WHERE target.key = has_field.key AND NOT has_field.present
    `)

    const verify = await client.query(
      `SELECT setting.id, setting.published_at, location.address, location.latitude, location.longitude, location.maps_place_url
         FROM public.website_settings AS setting
         JOIN public.website_settings_cmps AS relation
           ON relation.entity_id = setting.id
          AND relation.component_type = 'website-setting.hospital-location'
          AND relation.field = 'hospital_locations'
         JOIN public.components_website_setting_hospital_locations AS location
           ON location.id = relation.cmp_id
        WHERE location.location_key = 'HIU'
        ORDER BY setting.id`,
    )
    if (verify.rowCount !== plan.length || verify.rows.some((row) => row.address !== HIU.address || Number(row.latitude) !== HIU.latitude || Number(row.longitude) !== HIU.longitude || row.maps_place_url !== HIU.maps_place_url)) {
      throw new Error('Post-write verification failed: HIU location does not match the supplied Google Maps place.')
    }
    await client.query('COMMIT')
    console.log(JSON.stringify({ result: 'seeded', verifiedVersions: verify.rowCount, address: HIU.address, latitude: HIU.latitude, longitude: HIU.longitude, mapsPlaceUrl: HIU.maps_place_url }, null, 2))
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(`[hospital-location-seed-local] ${error.message}`)
  process.exitCode = 1
})
