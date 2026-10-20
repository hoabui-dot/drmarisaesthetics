#!/usr/bin/env node

/**
 * Correct both canonical hospital map embeds in local Website Settings.
 * HIU uses its exact Google Maps CID; CIH uses a Google-generated
 * name + verified street query because the hand-built Place ID embed resolved incorrectly.
 * Local database only; dry-run unless --write.
 * Run: node --env-file=strapi-cms/.env migration_scripts/228-set-hiu-google-maps-search-query-local.js [--write]
 */
const { createRequire } = require('node:module')
const { Client } = createRequire(`${process.cwd()}/strapi-cms/package.json`)('pg')

const WRITE = process.argv.includes('--write')
const HIU_QUERY = 'Bệnh viện Đại học Quốc tế Hồng Bàng, 01 Đường 10, Khu nhà ở Vạn Phúc 1, Hiệp Bình, Hồ Chí Minh 700000, Việt Nam'
const CIH_QUERY = 'City International Hospital, 3 Đường Số 17A, An Lạc, Hồ Chí Minh 700000, Vietnam'
const HIU = {
  latitude: 10.8424391,
  longitude: 106.7115029,
  maps_embed_url: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!3m2!1m1!4s16010722763691272719',
  maps_place_url: 'https://www.google.com/maps/place/Hong+Bang+International+University+Hospital/@10.8424391,106.7115029,17z/data=!3m1!4b1!4m6!3m5!1s0x3175290308d31623:0xde3183866f142a0f!8m2!3d10.8424391!4d106.7115029!16s%2Fg%2F11lldfwggq?hl=en-GB',
}
const CIH = {
  latitude: 10.7410166,
  longitude: 106.609125,
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
    const found = await client.query(
      `SELECT setting.id AS setting_id, setting.document_id, setting.published_at,
              location.id AS component_id, location.location_key, location.name, location.address,
              location.latitude, location.longitude,
              location.maps_embed_url, location.maps_place_url, location.maps_search_query
         FROM public.website_settings setting
         JOIN public.website_settings_cmps relation
           ON relation.entity_id = setting.id
          AND relation.component_type = 'website-setting.hospital-location'
          AND relation.field = 'hospital_locations'
         JOIN public.components_website_setting_hospital_locations location
           ON location.id = relation.cmp_id
        WHERE location.location_key IN ('HIU', 'CIH')
        ORDER BY setting.id
        FOR UPDATE OF setting, location`,
    )
    if (!found.rows.some((row) => row.location_key === 'HIU') || !found.rows.some((row) => row.location_key === 'CIH')) throw new Error('Both HIU and CIH hospital_locations entries must exist in local Website Settings.')
    console.log(JSON.stringify({ mode: WRITE ? 'write' : 'dry-run', targetDatabase: database, HIU: { ...HIU, maps_search_query: HIU_QUERY }, CIH: { ...CIH, maps_search_query: CIH_QUERY }, versions: found.rows.map(({ setting_id, document_id, published_at, component_id, location_key, name, address, latitude, longitude, maps_embed_url, maps_place_url }) => ({ settingId: setting_id, documentId: document_id, published: Boolean(published_at), componentId: component_id, locationKey: location_key, name, displayAddressUnchanged: address, previousCoordinates: [latitude, longitude], previousMapsEmbedUrl: maps_embed_url, previousMapsPlaceUrl: maps_place_url })) }, null, 2))
    if (!WRITE) {
      await client.query('ROLLBACK')
      return
    }

    await client.query(`ALTER TABLE public.components_website_setting_hospital_locations ADD COLUMN IF NOT EXISTS maps_search_query text`)
    for (const row of found.rows) {
      const data = row.location_key === 'HIU' ? HIU : CIH
      await client.query(
        `UPDATE public.components_website_setting_hospital_locations
            SET latitude = $2, longitude = $3, maps_embed_url = $4,
                maps_place_url = COALESCE($5, maps_place_url), maps_search_query = $6
          WHERE id = $1`,
        [row.component_id, data.latitude, data.longitude, data.maps_embed_url, row.location_key === 'HIU' ? HIU.maps_place_url : null, row.location_key === 'HIU' ? HIU_QUERY : CIH_QUERY],
      )
    }
    const verified = await client.query(
      `SELECT setting.id, setting.published_at, location.location_key, location.name, location.address,
              location.latitude, location.longitude, location.maps_embed_url,
              location.maps_place_url, location.maps_search_query
         FROM public.website_settings setting
         JOIN public.website_settings_cmps relation
           ON relation.entity_id = setting.id AND relation.component_type = 'website-setting.hospital-location' AND relation.field = 'hospital_locations'
         JOIN public.components_website_setting_hospital_locations location ON location.id = relation.cmp_id
        WHERE location.location_key IN ('HIU', 'CIH')
        ORDER BY setting.id`,
    )
    const invalid = verified.rows.some((row) => {
      const expected = row.location_key === 'HIU' ? HIU : CIH
      return Number(row.latitude) !== expected.latitude
        || Number(row.longitude) !== expected.longitude
        || row.maps_embed_url !== expected.maps_embed_url
        || row.maps_search_query !== (row.location_key === 'HIU' ? HIU_QUERY : CIH_QUERY)
        || (row.location_key === 'HIU' && row.maps_place_url !== HIU.maps_place_url)
    })
    if (verified.rowCount !== found.rowCount || invalid) {
      throw new Error('Post-write verification failed: HIU CID and CIH address-query embeds/coordinates must match.')
    }
    await client.query('COMMIT')
    console.log(JSON.stringify({ result: 'updated', verifiedVersions: verified.rowCount, locations: verified.rows.map(({ location_key, name, address, latitude, longitude, maps_embed_url, maps_place_url }) => ({ location_key, name, address, latitude, longitude, maps_embed_url, maps_place_url })) }, null, 2))
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => { console.error(`[hospital-place-embeds-local] ${error.message}`); process.exitCode = 1 })
