#!/usr/bin/env node

/**
 * Production content update for the Contact dual-hospital location explorer.
 * Hospital records remain canonical in About Page; this updates their verified
 * location metadata and the Contact map-section copy/order without touching
 * unrelated page sections or media.
 *
 * Dry-run by default. See README.md for the explicit write gates.
 */
const STRAPI_URL = (process.env.STRAPI_URL || '').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN || ''
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')
const WRITE_APPROVED = process.env.ALLOW_PRODUCTION_WRITE === 'YES'
const CONTENT_REVIEWED = process.env.PRODUCTION_CONTENT_REVIEWED === 'YES'
const HOSPITAL_SECTION = 'about.hospital-environments'
const MAP_SECTION = 'contact.map-section'

// Addresses and official source pages are provided by the implementation brief.
// Review them against the live official sources before the production write.
const HOSPITALS = {
  HIU: {
    short_name: 'Hong Bang Hospital',
    address: '01 Street 10, Van Phuc 1 Residential Area, Hiep Binh Ward, Ho Chi Minh City 700000, Vietnam',
    website: 'https://hiuhospital.com/',
    source_url: 'https://hiuhospital.com/lien-he',
  },
  CIH: {
    short_name: 'City International Hospital',
    address: 'No. 3, Street 17A, An Lac Ward, Ho Chi Minh City, Vietnam',
    website: 'https://cih.com.vn/',
    source_url: 'https://cih.com.vn/',
  },
}

if (!STRAPI_URL) throw new Error('STRAPI_URL is intentionally unset; provide the authorized production Strapi HTTPS base URL at runtime.')
const target = new URL(STRAPI_URL)
if (target.protocol !== 'https:') throw new Error('Production STRAPI_URL must use HTTPS.')
if (!TOKEN) throw new Error('STRAPI_API_TOKEN is intentionally unset; provide a least-privilege token at runtime.')
if (WRITE && (!WRITE_APPROVED || !CONTENT_REVIEWED)) {
  throw new Error('Writes require ALLOW_PRODUCTION_WRITE=YES and PRODUCTION_CONTENT_REVIEWED=YES after production content/address/image review.')
}
if (WRITE && !PUBLISH) throw new Error('For public Contact content, use both --write and --publish after reviewing the dry run.')

function directionsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

async function request(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      ...(options.headers || {}),
    },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

function assertGoogleMapsEmbedUrl(value, abbreviation) {
  let url
  try { url = new URL(value) } catch { throw new Error(`${abbreviation} maps_embed_url must be a complete Google Maps Embed URL.`) }
  if (url.protocol !== 'https:' || !['google.com', 'www.google.com', 'maps.google.com'].includes(url.hostname) || !url.pathname.startsWith('/maps/embed')) {
    throw new Error(`${abbreviation} maps_embed_url must use https://www.google.com/maps/embed...`)
  }
  return url.toString()
}

function serialize(value) {
  if (Array.isArray(value)) return value.map(serialize)
  if (!value || typeof value !== 'object') return value
  if (value.id && value.url && value.mime) return value.id
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'localizations'].includes(key))
    .map(([key, item]) => [key, serialize(item)]))
}

function assertGoogleDirectionsUrl(value, abbreviation) {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.hostname !== 'www.google.com' || !url.pathname.startsWith('/maps/dir/')) {
    throw new Error(`${abbreviation} directions URL was not generated as an HTTPS Google Maps directions URL.`)
  }
  return url.toString()
}

async function main() {
  const [aboutResponse, contactResponse] = await Promise.all([
    request('/api/about-page?status=draft&populate=*'),
    request('/api/contact-page?status=draft&populate=*'),
  ])
  const about = aboutResponse.data
  const contact = contactResponse.data
  if (!about?.documentId || !Array.isArray(about.sections)) throw new Error('Production About Page draft was not found.')
  if (!contact?.documentId || !Array.isArray(contact.layout)) throw new Error('Production Contact Page draft was not found.')

  const sections = about.sections.map(serialize)
  const hospitalSection = sections.find((item) => item.__component === HOSPITAL_SECTION)
  if (!hospitalSection || !Array.isArray(hospitalSection.hospitals)) {
    throw new Error('Canonical About Page hospital-environments section is missing; add/review its two hospital records before this seed.')
  }
  const hospitalRecords = hospitalSection.hospitals.map((hospital) => {
    const details = HOSPITALS[hospital.abbreviation]
    if (!details) return hospital
    const maps_directions_url = directionsUrl(details.address)
    assertGoogleDirectionsUrl(maps_directions_url, hospital.abbreviation)
    return { ...hospital, ...details, maps_directions_url }
  })
  if (WRITE && !['HIU', 'CIH'].every((abbreviation) => hospitalRecords.some((hospital) => hospital.abbreviation === abbreviation && hospital.maps_embed_url))) {
    throw new Error('Production write requires a separately verified maps_embed_url for both HIU and CIH. Add each facility’s Google Maps Share → Embed a map iframe src in About Page first; the seed intentionally does not invent map URLs or coordinates.')
  }
  if (WRITE) {
    for (const abbreviation of ['HIU', 'CIH']) {
      const hospital = hospitalRecords.find((item) => item.abbreviation === abbreviation)
      hospital.maps_embed_url = assertGoogleMapsEmbedUrl(hospital.maps_embed_url, abbreviation)
    }
    if (hospitalRecords.find((item) => item.abbreviation === 'HIU').maps_embed_url === hospitalRecords.find((item) => item.abbreviation === 'CIH').maps_embed_url) {
      throw new Error('HIU and CIH must have distinct facility-specific Google Maps embed URLs.')
    }
  }
  for (const abbreviation of ['HIU', 'CIH']) {
    const record = hospitalRecords.find((hospital) => hospital.abbreviation === abbreviation)
    if (!record) throw new Error(`Canonical About Page is missing ${abbreviation}; refusing a partial update.`)
    if (!record.exterior_image_url || !record.exterior_image_alt) {
      throw new Error(`${abbreviation} has no reviewed exterior image. Keep its existing image or obtain an approved asset before writing.`)
    }
  }
  hospitalSection.hospitals = hospitalRecords

  const layout = contact.layout.map(serialize)
  const mapSection = layout.find((item) => item.__component === MAP_SECTION)
  if (!mapSection) throw new Error('Contact Page is missing contact.map-section; refusing to create or replace unrelated content.')
  Object.assign(mapSection, {
    eyebrow: 'HOSPITAL LOCATIONS',
    title: 'Visit Our Hospital Facilities',
    description: 'Explore hospital locations and find directions to each facility in Ho Chi Minh City.',
    directions_label: 'Get Directions',
    official_website_label: 'Official Website',
  })
  const faqIndexBeforeMove = layout.findIndex((item) => item.__component === 'contact.faq')
  const currentMapIndex = layout.indexOf(mapSection)
  if (faqIndexBeforeMove >= 0 && currentMapIndex > faqIndexBeforeMove) {
    layout.splice(currentMapIndex, 1)
    layout.splice(faqIndexBeforeMove, 0, mapSection)
  }

  console.log(JSON.stringify({
    mode: WRITE ? 'WRITE + PUBLISH' : 'DRY RUN',
    target: target.origin,
    aboutDocumentId: about.documentId,
    contactDocumentId: contact.documentId,
    locations: hospitalRecords.filter((item) => HOSPITALS[item.abbreviation]).map(({ abbreviation, name, short_name, address, maps_directions_url, maps_embed_url, website, source_url, exterior_image_url }) => ({ abbreviation, name, short_name, address, maps_directions_url, maps_embed_url: maps_embed_url || null, website, source_url, exterior_image_url })),
    contactSection: { eyebrow: mapSection.eyebrow, title: mapSection.title, description: mapSection.description },
    contactSectionBeforeFaq: layout.findIndex((item) => item.__component === MAP_SECTION) < layout.findIndex((item) => item.__component === 'contact.faq'),
    unrelatedAboutSectionsPreserved: sections.filter((item) => item !== hospitalSection).map((item) => item.__component),
    unrelatedContactSectionsPreserved: layout.filter((item) => item !== mapSection).map((item) => item.__component),
  }, null, 2))
  if (!WRITE) return

  await Promise.all([
    request('/api/about-page?status=draft', { method: 'PUT', body: JSON.stringify({ data: { sections } }) }),
    request('/api/contact-page?status=draft', { method: 'PUT', body: JSON.stringify({ data: { layout } }) }),
  ])
  const publishedAt = new Date().toISOString()
  await Promise.all([
    request('/api/about-page?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt } }) }),
    request('/api/contact-page?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt } }) }),
  ])

  const [verifyAbout, verifyContact] = await Promise.all([
    request('/api/about-page?populate=*'),
    request('/api/contact-page?populate=*'),
  ])
  const verifiedHospitals = verifyAbout.data?.sections?.find((item) => item.__component === HOSPITAL_SECTION)?.hospitals || []
  const verifiedLayout = verifyContact.data?.layout || []
  const verifiedMap = verifiedLayout.find((item) => item.__component === MAP_SECTION)
  const verifiedMapIndex = verifiedLayout.indexOf(verifiedMap)
  const verifiedFaqIndex = verifiedLayout.findIndex((item) => item.__component === 'contact.faq')
  for (const abbreviation of ['HIU', 'CIH']) {
    const record = verifiedHospitals.find((item) => item.abbreviation === abbreviation)
    if (!record?.address || !record?.maps_directions_url || !record?.maps_embed_url || !record?.exterior_image_url || !record?.short_name) {
      throw new Error(`Published verification failed: ${abbreviation} is missing address, directions, exact map embed URL, short name, or exterior image.`)
    }
  }
  if (!verifiedMap?.eyebrow || !verifiedMap?.official_website_label || (verifiedFaqIndex >= 0 && verifiedMapIndex > verifiedFaqIndex)) {
    throw new Error('Published verification failed: Contact location copy or ordering is incorrect.')
  }
  console.log(JSON.stringify({ result: 'seeded-and-published', hospitals: ['HIU', 'CIH'], contactSectionBeforeFaq: verifiedFaqIndex < 0 || verifiedMapIndex < verifiedFaqIndex }, null, 2))
}

main().catch((error) => {
  console.error(`[contact-dual-hospital-seed] ${error.message}`)
  process.exitCode = 1
})
