#!/usr/bin/env node

/**
 * Correct only the CIH map embed in local Website Settings.
 * Uses the facility name plus its verified Vietnamese address to disambiguate
 * the map search. The admin-facing address remains English.
 * Dry-run by default; pass --write to update local draft/published rows.
 */
const { createRequire } = require('node:module')
const { Client } = createRequire(`${process.cwd()}/strapi-cms/package.json`)('pg')

const WRITE = process.argv.includes('--write')
const CIH = {
  latitude: 10.7410166,
  longitude: 106.609125,
  maps_search_query: 'City International Hospital, 3 Đường Số 17A, An Lạc, Hồ Chí Minh 700000, Vietnam',
  maps_embed_url: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sCity+International+Hospital,+3+%C4%90%C6%B0%E1%BB%9Dng+S%E1%BB%91+17A,+An+L%E1%BA%A1c,+H%E1%BB%93+Ch%C3%AD+Minh+700000,+Vietnam!6i17',
}

async function main() {
  const host = process.env.DATABASE_HOST || ''
  const database = process.env.DATABASE_NAME || ''
  if (!['localhost', '127.0.0.1', '::1'].includes(host) || !/(local|test)/i.test(database)) {
    throw new Error(`Local-only update refused database host/name: ${host}/${database}`)
  }

  const client = new Client({ host, port: Number(process.env.DATABASE_PORT || 5432), database, user: process.env.DATABASE_USERNAME, password: process.env.DATABASE_PASSWORD })
  await client.connect()
  try {
    await client.query('BEGIN')
    const current = await client.query(
      `SELECT setting.id AS setting_id, setting.document_id, setting.published_at,
              location.id AS component_id, location.name, location.address,
              location.latitude, location.longitude,
              location.maps_embed_url, location.maps_search_query
         FROM public.website_settings setting
         JOIN public.website_settings_cmps relation
           ON relation.entity_id = setting.id
          AND relation.component_type = 'website-setting.hospital-location'
          AND relation.field = 'hospital_locations'
         JOIN public.components_website_setting_hospital_locations location
           ON location.id = relation.cmp_id
        WHERE location.location_key = 'CIH'
        ORDER BY setting.id
        FOR UPDATE OF setting, location`,
    )
    if (!current.rowCount) throw new Error('No CIH hospital_locations entry found in local Website Settings.')
    console.log(JSON.stringify({ mode: WRITE ? 'write' : 'dry-run', database, desiredCIH: CIH, existingVersions: current.rows.map(({ setting_id, document_id, published_at, component_id, name, address, latitude, longitude, maps_embed_url, maps_search_query }) => ({ setting_id, document_id, published: Boolean(published_at), component_id, name, displayAddressUnchanged: address, latitude, longitude, maps_embed_url, maps_search_query })) }, null, 2))
    if (!WRITE) {
      await client.query('ROLLBACK')
      return
    }

    for (const row of current.rows) {
      await client.query(
        `UPDATE public.components_website_setting_hospital_locations
            SET latitude = $2, longitude = $3,
                maps_embed_url = $4, maps_search_query = $5
          WHERE id = $1`,
        [row.component_id, CIH.latitude, CIH.longitude, CIH.maps_embed_url, CIH.maps_search_query],
      )
    }
    const verified = await client.query(
      `SELECT setting.id, setting.published_at, location.location_key, location.name, location.address,
              location.latitude, location.longitude,
              location.maps_embed_url, location.maps_search_query
         FROM public.website_settings setting
         JOIN public.website_settings_cmps relation
           ON relation.entity_id = setting.id AND relation.component_type = 'website-setting.hospital-location' AND relation.field = 'hospital_locations'
         JOIN public.components_website_setting_hospital_locations location ON location.id = relation.cmp_id
        WHERE location.location_key = 'CIH'
        ORDER BY setting.id`,
    )
    if (verified.rowCount !== current.rowCount || verified.rows.some((row) =>
      Number(row.latitude) !== CIH.latitude || Number(row.longitude) !== CIH.longitude
      || row.maps_embed_url !== CIH.maps_embed_url
      || row.maps_search_query !== CIH.maps_search_query
    )) throw new Error('CIH post-write verification failed.')
    await client.query('COMMIT')
    console.log(JSON.stringify({ result: 'updated-CIH-only', versions: verified.rowCount, locations: verified.rows }, null, 2))
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => { console.error(`[cih-map-fix-local] ${error.message}`); process.exitCode = 1 })
