#!/usr/bin/env node

/**
 * Seed two temporary, research-reference hospital chapters into local About Us
 * so the editorial layout can be reviewed. External image rights and the
 * hospital/address copy must be confirmed before public production use.
 *
 * Dry run by default. Write with --write; publish locally with --publish.
 * The host guard intentionally rejects all non-local Strapi URLs.
 */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')
const COMPONENT = 'about.hospital-environments'
const ALLOWED_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])

function mapsDirectionsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

const baseUrl = new URL(BASE)
if (!ALLOWED_HOSTS.has(baseUrl.hostname)) {
  throw new Error(`Local-only seed refused non-local host: ${baseUrl.hostname}`)
}

const hospitalStories = [
  {
    chapter: '01',
    name: 'City International Hospital',
    abbreviation: 'CIH',
    short_name: 'City International Hospital',
    short_label: 'Established multidisciplinary hospital environment',
    address: 'No. 3, Street 17A, An Lac Ward, Ho Chi Minh City, Vietnam',
    maps_directions_url: mapsDirectionsUrl('No. 3, Street 17A, An Lac Ward, Ho Chi Minh City, Vietnam'),
    website: 'https://cih.com.vn/',
    source_url: 'https://cih.com.vn/',
    description: 'An established multidisciplinary hospital setting in Ho Chi Minh City, with clinical facilities and supporting medical services.',
    exterior_image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/City_International_Hospital_Vietnam.jpg',
    exterior_image_alt: 'Exterior of City International Hospital in Ho Chi Minh City, photographed in 2019.',
    interior_image_url: 'https://isofhcare-backup.s3-ap-southeast-1.amazonaws.com/images/dia-chi-benh-vien-quoc-te-city-binh-tan-tp-ho-chi-minh-ivie-4_7e208d37_c47f_4769_9f33_4cde2ab911ef.jpg',
    interior_image_alt: 'Patient room reference image associated with City International Hospital.',
    detail_image_url: 'https://cdn.medpro.vn/medpro-production/medpro/topics/bv-quoc-te-city-cih.jpg',
    detail_image_alt: 'Additional City International Hospital facility reference image.',
  },
  {
    chapter: '02',
    name: 'Hong Bang International University Hospital',
    abbreviation: 'HIU',
    short_name: 'Hong Bang Hospital',
    short_label: 'Modern university hospital environment',
    address: '01 Street 10, Van Phuc 1 Residential Area, Hiep Binh Ward, Ho Chi Minh City 700000, Vietnam',
    maps_directions_url: mapsDirectionsUrl('01 Street 10, Van Phuc 1 Residential Area, Hiep Binh Ward, Ho Chi Minh City 700000, Vietnam'),
    website: 'https://hiuhospital.com/',
    source_url: 'https://hiuhospital.com/lien-he',
    description: 'A multidisciplinary university hospital in Ho Chi Minh City with patient-care and clinical facilities.',
    exterior_image_url: 'https://hiuhospital.com/_next/image?q=75&url=https%3A%2F%2Fstorage.googleapis.com%2Fhiuh-public-media-production%2Fuploads%2Fcms%2Fcollections%2Ffacilities%2Fkhoi-nha-sanh-chinh.jpg&w=3840',
    exterior_image_alt: 'Main building of Hong Bang International University Hospital, shown on its official website.',
    interior_image_url: 'https://hiuhospital.com/_next/image?q=75&url=https%3A%2F%2Fstorage.googleapis.com%2Fhiuh-public-media-production%2Fuploads%2Fcms%2Fcollections%2Ffacilities%2Fkhu-noi-tru-tien-nghi.jpg&w=3840',
    interior_image_alt: 'Inpatient room reference image shown on the official Hong Bang International University Hospital website.',
    detail_image_url: 'https://hiuhospital.com/_next/image?q=75&url=https%3A%2F%2Fstorage.googleapis.com%2Fhiuh-public-media-production%2Fuploads%2Fcms%2Fcollections%2Ffacilities%2Fphong-kham-tieu-chuan.jpg&w=3840',
    detail_image_alt: 'Consultation room reference image shown on the official Hong Bang International University Hospital website.',
  },
]

const sampleSection = {
  __component: COMPONENT,
  eyebrow: 'HOSPITAL-BASED SURGICAL CARE',
  title: 'Where Surgical Care Takes Place.',
  description: 'Explore the independent hospital environments associated with DR. MARIS AESTHETICS in Ho Chi Minh City. The hospital for any individual procedure is confirmed as part of your clinical assessment and treatment plan.',
  disclaimer: 'DR. MARIS AESTHETICS and the hospitals shown are separate entities. Surgical locations, arrangements, and suitability are confirmed individually before treatment.',
  cta_label: 'Discuss Your Care Plan',
  hospitals: hospitalStories,
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
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required for the local Content API write')
  const current = await request('/api/about-page?status=draft&populate=*')
  const document = current.data
  if (!document?.documentId || !Array.isArray(document.sections)) {
    throw new Error('Local About Page draft or dynamic-zone sections were not found')
  }

  const sections = document.sections.map(serialize)
  const assessmentIndex = sections.findIndex((section) => section.__component === 'about.assessment')
  if (assessmentIndex < 0) throw new Error('About Page is missing about.assessment (OUR APPROACH); refusing to guess placement')

  const existing = sections.find((section) => section.__component === COMPONENT)
  const hospitals = hospitalStories.map((hospital) => {
    const previous = existing?.hospitals?.find((item) => item.abbreviation === hospital.abbreviation)
    return { ...(previous?.id ? { id: previous.id } : {}), ...hospital }
  })
  const section = { ...(existing?.id ? { id: existing.id } : {}), ...sampleSection, hospitals }
  const withoutOldSection = sections.filter((item) => item.__component !== COMPONENT)
  const refreshedAssessmentIndex = withoutOldSection.findIndex((item) => item.__component === 'about.assessment')
  withoutOldSection.splice(refreshedAssessmentIndex + 1, 0, section)

  const report = {
    mode: WRITE ? 'write' : 'dry-run',
    publish: WRITE && PUBLISH,
    aboutDocumentId: document.documentId,
    sectionsBefore: sections.map((item) => item.__component),
    sectionInsertedAfter: 'about.assessment',
    hospitals: hospitals.map(({ chapter, abbreviation, name, maps_directions_url, exterior_image_url, interior_image_url }) => ({ chapter, abbreviation, name, maps_directions_url, exterior_image_url, interior_image_url })),
  }
  console.log(JSON.stringify(report, null, 2))
  if (!WRITE) return

  await request('/api/about-page?status=draft', {
    method: 'PUT',
    body: JSON.stringify({ data: { sections: withoutOldSection } }),
  })
  if (PUBLISH) {
    await request('/api/about-page?status=published', {
      method: 'PUT',
      body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
    })
  }

  const verify = await request(`/api/about-page?${PUBLISH ? '' : 'status=draft&'}populate=*`)
  const actualSections = verify.data?.sections || []
  const actualIndex = actualSections.findIndex((item) => item.__component === COMPONENT)
  const actual = actualSections[actualIndex]
  if (!actual || actual.hospitals?.length !== 2 || actualSections[actualIndex - 1]?.__component !== 'about.assessment') {
    throw new Error('Verification failed: expected exactly two hospitals immediately after OUR APPROACH')
  }
  console.log(JSON.stringify({ result: 'seeded', published: PUBLISH, sectionIndex: actualIndex, hospitals: actual.hospitals.map((hospital) => ({ name: hospital.name, abbreviation: hospital.abbreviation })) }, null, 2))
}

main().catch((error) => {
  console.error(`[about-hospital-environments] ${error.message}`)
  process.exitCode = 1
})
