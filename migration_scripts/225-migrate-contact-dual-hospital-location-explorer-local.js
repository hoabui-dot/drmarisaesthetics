#!/usr/bin/env node

/**
 * Local-only data migration for the Contact dual-hospital explorer.
 * Canonical hospital details are kept in About Page and shared by Contact.
 * Preview by default; use --write and optionally --publish after review.
 */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')
const ALLOWED_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])
const baseUrl = new URL(BASE)
if (!ALLOWED_HOSTS.has(baseUrl.hostname)) throw new Error(`Local-only migration refused non-local host: ${baseUrl.hostname}`)

const COMPONENT = 'about.hospital-environments'
const MAP_COMPONENT = 'contact.map-section'
const VERIFIED_HOSPITAL_DETAILS = {
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

function directionsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      ...(options.headers || {}),
    },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

function serialize(value) {
  if (Array.isArray(value)) return value.map(serialize)
  if (!value || typeof value !== 'object') return value
  if (value.id && value.url && value.mime) return value.id
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'localizations'].includes(key))
    .map(([key, item]) => [key, serialize(item)]))
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required.')

  const [aboutResponse, contactResponse] = await Promise.all([
    request('/api/about-page?status=draft&populate=*'),
    request('/api/contact-page?status=draft&populate=*'),
  ])
  const about = aboutResponse.data
  const contact = contactResponse.data
  if (!about?.documentId || !Array.isArray(about.sections)) throw new Error('Local About Page draft was not found.')
  if (!contact?.documentId || !Array.isArray(contact.layout)) throw new Error('Local Contact Page draft was not found.')

  const aboutSections = about.sections.map(serialize)
  const hospitalSection = aboutSections.find((section) => section.__component === COMPONENT)
  if (!hospitalSection || !Array.isArray(hospitalSection.hospitals)) {
    throw new Error('Seed the two canonical hospital entries in About Page first; this migration will not invent hospital image/content records.')
  }

  const hospitals = hospitalSection.hospitals.map((hospital) => {
    const details = VERIFIED_HOSPITAL_DETAILS[hospital.abbreviation]
    if (!details) return hospital
    return {
      ...hospital,
      ...details,
      maps_directions_url: directionsUrl(details.address),
    }
  })
  for (const abbreviation of ['HIU', 'CIH']) {
    if (!hospitals.some((hospital) => hospital.abbreviation === abbreviation)) {
      throw new Error(`About Page is missing ${abbreviation}; refusing a partial two-hospital configuration.`)
    }
  }
  hospitalSection.hospitals = hospitals

  const contactLayout = contact.layout.map(serialize)
  const mapSection = contactLayout.find((section) => section.__component === MAP_COMPONENT)
  if (!mapSection) throw new Error('Contact Page is missing contact.map-section; refusing to add/reorder unrelated blocks.')
  Object.assign(mapSection, {
    eyebrow: 'HOSPITAL LOCATIONS',
    title: 'Visit Our Hospital Facilities',
    description: 'Explore the locations of Hong Bang International University Hospital and City International Hospital in Ho Chi Minh City.',
    directions_label: 'Get Directions',
    official_website_label: 'Official Website',
  })
  const faqIndex = contactLayout.findIndex((section) => section.__component === 'contact.faq')
  const mapIndex = contactLayout.indexOf(mapSection)
  if (faqIndex >= 0 && mapIndex > faqIndex) {
    contactLayout.splice(mapIndex, 1)
    contactLayout.splice(faqIndex, 0, mapSection)
  }

  console.log(JSON.stringify({
    mode: WRITE ? 'write' : 'dry-run',
    publish: WRITE && PUBLISH,
    aboutDocumentId: about.documentId,
    contactDocumentId: contact.documentId,
    hospitals: hospitals.filter((hospital) => VERIFIED_HOSPITAL_DETAILS[hospital.abbreviation]).map(({ abbreviation, name, short_name, address, maps_directions_url, maps_embed_url, source_url }) => ({ abbreviation, name, short_name, address, maps_directions_url, maps_embed_url: maps_embed_url || null, source_url })),
    contactSection: mapSection,
    contactSectionBeforeFaq: faqIndex < 0 || contactLayout.findIndex((section) => section.__component === MAP_COMPONENT) < contactLayout.findIndex((section) => section.__component === 'contact.faq'),
  }, null, 2))
  if (!WRITE) return

  await Promise.all([
    request('/api/about-page?status=draft', { method: 'PUT', body: JSON.stringify({ data: { sections: aboutSections } }) }),
    request('/api/contact-page?status=draft', { method: 'PUT', body: JSON.stringify({ data: { layout: contactLayout } }) }),
  ])
  if (PUBLISH) {
    await Promise.all([
      request('/api/about-page?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) }),
      request('/api/contact-page?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) }),
    ])
  }

  const [verifyAbout, verifyContact] = await Promise.all([
    request(`/api/about-page?${PUBLISH ? '' : 'status=draft&'}populate=*`),
    request(`/api/contact-page?${PUBLISH ? '' : 'status=draft&'}populate=*`),
  ])
  const verifiedHospitals = verifyAbout.data?.sections?.find((section) => section.__component === COMPONENT)?.hospitals || []
  const verifiedLayout = verifyContact.data?.layout || []
  const verifiedMap = verifiedLayout.find((section) => section.__component === MAP_COMPONENT)
  const verifiedMapIndex = verifiedLayout.indexOf(verifiedMap)
  const verifiedFaqIndex = verifiedLayout.findIndex((section) => section.__component === 'contact.faq')
  if (!['HIU', 'CIH'].every((abbr) => verifiedHospitals.some((hospital) => hospital.abbreviation === abbr && hospital.maps_directions_url))) {
    throw new Error('Verification failed: canonical About hospital records or directions URLs are missing.')
  }
  if (!verifiedMap?.eyebrow || !verifiedMap?.official_website_label || (verifiedFaqIndex >= 0 && verifiedMapIndex > verifiedFaqIndex)) {
    throw new Error('Verification failed: Contact hospital explorer fields or section order are incorrect.')
  }
  console.log(JSON.stringify({ result: 'migrated', published: PUBLISH, hospitalCount: verifiedHospitals.length, contactSectionBeforeFaq: verifiedFaqIndex < 0 || verifiedMapIndex < verifiedFaqIndex }, null, 2))
}

main().catch((error) => {
  console.error(`[contact-hospital-explorer-local] ${error.message}`)
  process.exitCode = 1
})
