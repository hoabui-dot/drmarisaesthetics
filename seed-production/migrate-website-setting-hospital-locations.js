#!/usr/bin/env node

// Normalize HIU's displayed address to English and add/update CIH in the
// repeatable hospital_locations component. Preserve verified map data.
// Deploy the new Strapi schema before executing.
const BASE = (process.env.STRAPI_URL || '').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')
const REVIEWED = process.env.PRODUCTION_CONTENT_REVIEWED === 'YES'
const ALLOW_WRITE = process.env.ALLOW_PRODUCTION_WRITE === 'YES'
const HIU_ADDRESS = '01 Street 10, Van Phuc 1 Residential Area, Hiep Binh Ward, Ho Chi Minh City 700000, Vietnam'
const HIU_MAPS_SEARCH_QUERY = 'Bệnh viện Đại học Quốc tế Hồng Bàng, 01 Đường 10, Khu nhà ở Vạn Phúc 1, Hiệp Bình, Hồ Chí Minh 700000, Việt Nam'
// Google Maps CID verified from the HIU hospital place page, not the similarly
// named Hong Bang International University campus.
const HIU_LATITUDE = 10.8424391
const HIU_LONGITUDE = 106.7115029
const HIU_MAPS_EMBED_URL = 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!3m2!1m1!4s16010722763691272719'
const HIU_MAPS_PLACE_URL = 'https://www.google.com/maps/place/Hong+Bang+International+University+Hospital/@10.8424391,106.7115029,17z/data=!3m1!4b1!4m6!3m5!1s0x3175290308d31623:0xde3183866f142a0f!8m2!3d10.8424391!4d106.7115029!16s%2Fg%2F11lldfwggq?hl=en-GB'
const CIH_ADDRESS = 'No. 3, Street 17A, An Lac Ward, Ho Chi Minh City, Vietnam'
// CIH's official website confirms the street address. The coordinates are
// cross-checked against the mapped hospital building; querying by address alone
// can resolve to the wrong place and omit the facility marker.
const CIH_LATITUDE = 10.7410166
const CIH_LONGITUDE = 106.609125
// Build the embed from CIH's official Vietnamese street address to disambiguate
// it from similarly named map results. Official address: https://cih.com.vn/
const CIH_MAPS_SEARCH_QUERY = 'City International Hospital, 3 Đường Số 17A, An Lạc, Hồ Chí Minh 700000, Vietnam'
const CIH_MAPS_EMBED_URL = 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sCity+International+Hospital,+3+%C4%90%C6%B0%E1%BB%9Dng+S%E1%BB%91+17A,+An+L%E1%BA%A1c,+H%E1%BB%93+Ch%C3%AD+Minh+700000,+Vietnam!6i17'

if (!/^https:\/\//i.test(BASE)) throw new Error('Set STRAPI_URL to the authorized HTTPS production CMS URL.')
if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required; keep it in the runtime environment, not source control.')
if (WRITE && (!PUBLISH || !REVIEWED || !ALLOW_WRITE)) {
  throw new Error('A production write requires --write --publish plus PRODUCTION_CONTENT_REVIEWED=YES and ALLOW_PRODUCTION_WRITE=YES.')
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, { ...options, headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', ...(options.headers || {}) } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

function cleanComponent(item) {
  return Object.fromEntries(Object.entries(item || {}).filter(([key]) => !['createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'localizations'].includes(key)))
}

async function main() {
  const draftResponse = await request('/api/website-setting?status=draft&populate[hospital_locations]=true')
  const draft = draftResponse.data
  if (!draft?.documentId) throw new Error('Website Settings draft was not found.')
  const locations = Array.isArray(draft.hospital_locations) ? draft.hospital_locations.map(cleanComponent) : []
  const existingHIUIndex = locations.findIndex((item) => item.location_key === 'HIU')
  const existingHIU = existingHIUIndex >= 0 ? locations[existingHIUIndex] : null
  // HIU's canonical identity, English address, place URL, embed URL, and
  // coordinates are already verified above. Bootstrap it when production has
  // no HIU row instead of making CIH migration impossible; preserve any other
  // existing HIU fields when the row is present.
  const hiu = {
    ...(existingHIU || {}),
    location_key: 'HIU',
    name: existingHIU?.name || 'Hong Bang International University Hospital',
    address: HIU_ADDRESS,
    latitude: HIU_LATITUDE,
    longitude: HIU_LONGITUDE,
    maps_embed_url: HIU_MAPS_EMBED_URL,
    maps_place_url: HIU_MAPS_PLACE_URL,
    maps_search_query: HIU_MAPS_SEARCH_QUERY,
  }
  if (existingHIUIndex >= 0) locations[existingHIUIndex] = hiu
  else locations.unshift(hiu)
  const existingIndex = locations.findIndex((item) => item.location_key === 'CIH')
  const cih = {
    ...(existingIndex >= 0 ? locations[existingIndex] : {}),
    location_key: 'CIH',
    name: 'City International Hospital',
    address: CIH_ADDRESS,
    latitude: CIH_LATITUDE,
    longitude: CIH_LONGITUDE,
    maps_embed_url: CIH_MAPS_EMBED_URL,
    maps_search_query: CIH_MAPS_SEARCH_QUERY,
  }
  if (existingIndex >= 0) locations[existingIndex] = cih
  else locations.push(cih)

  console.log(JSON.stringify({ mode: WRITE ? 'write-and-publish' : 'dry-run', documentId: draft.documentId, existingLocationKeys: (draft.hospital_locations || []).map((item) => item.location_key), createdCanonicalHIU: !existingHIU, updatedHIU: { location_key: hiu.location_key, name: hiu.name, address: hiu.address, maps_search_query: hiu.maps_search_query, latitude: hiu.latitude, longitude: hiu.longitude, maps_place_url: hiu.maps_place_url, maps_embed_url: hiu.maps_embed_url }, migratedCIH: cih }, null, 2))
  if (!WRITE) return

  await request('/api/website-setting?status=draft', { method: 'PUT', body: JSON.stringify({ data: { hospital_locations: locations } }) })
  await request('/api/website-setting?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  const verify = await request('/api/website-setting?status=published&populate[hospital_locations]=true')
  const saved = verify.data?.hospital_locations || []
  const savedHIU = saved.find((item) => item.location_key === 'HIU')
  const savedCIH = saved.find((item) => item.location_key === 'CIH')
  if (savedHIU?.address !== HIU_ADDRESS
    || savedHIU?.maps_search_query !== HIU_MAPS_SEARCH_QUERY
    || Number(savedHIU?.latitude) !== HIU_LATITUDE
    || Number(savedHIU?.longitude) !== HIU_LONGITUDE
    || savedHIU?.maps_embed_url !== HIU_MAPS_EMBED_URL
    || savedHIU?.maps_place_url !== HIU_MAPS_PLACE_URL
    || savedHIU?.latitude !== hiu.latitude
    || savedHIU?.longitude !== hiu.longitude
    || savedHIU?.maps_place_url !== hiu.maps_place_url
    || !savedCIH || savedCIH.name !== 'City International Hospital' || savedCIH.address !== CIH_ADDRESS
    || Number(savedCIH.latitude) !== CIH_LATITUDE || Number(savedCIH.longitude) !== CIH_LONGITUDE
    || savedCIH.maps_embed_url !== CIH_MAPS_EMBED_URL
    || savedCIH.maps_search_query !== CIH_MAPS_SEARCH_QUERY) {
    throw new Error('Post-publish verification failed for English hospital addresses, CIH map pin, or preserved HIU map data. Confirm Website Settings before applying migration 031.')
  }
  console.log(JSON.stringify({ result: 'migrated-and-published', locations: saved.map(({ location_key, name, address, maps_search_query, latitude, longitude, maps_embed_url, maps_place_url }) => ({ location_key, name, address, maps_search_query, latitude, longitude, maps_embed_url, maps_place_url })) }, null, 2))
}

main().catch((error) => { console.error(`[website-setting-hospital-locations-production] ${error.message}`); process.exitCode = 1 })
