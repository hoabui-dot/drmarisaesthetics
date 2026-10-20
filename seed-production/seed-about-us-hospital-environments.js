#!/usr/bin/env node

/**
 * Production-only seed for the About Us hospital environments section.
 *
 * Intentionally blank until a production operator verifies the target Strapi
 * URL/token, content approval, and direct Google Maps URLs. See README.md.
 * This script defaults to dry-run and never runs from app startup or Docker.
 */
const STRAPI_URL = (process.env.STRAPI_URL || '').replace(/\/$/, '')
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')
const ALLOW_PRODUCTION_WRITE = process.env.ALLOW_PRODUCTION_WRITE === 'YES'
const PRODUCTION_CONTENT_REVIEWED = process.env.PRODUCTION_CONTENT_REVIEWED === 'YES'
const COMPONENT = 'about.hospital-environments'

// Fill these with verified Google Maps share/directions URLs before production
// writes. Do not derive the production destinations from display-address text.
const PRODUCTION_HOSPITAL_DIRECTIONS = {
  CIH: '',
  HIU: '',
}

const hospitalStories = [
  {
    chapter: '01',
    name: 'City International Hospital',
    abbreviation: 'CIH',
    short_label: 'Established multidisciplinary hospital environment',
    address: 'No. 3, Street 17A, An Lac Ward, Ho Chi Minh City, Vietnam',
    maps_directions_url: PRODUCTION_HOSPITAL_DIRECTIONS.CIH,
    website: 'https://cih.com.vn/',
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
    short_label: 'Modern university hospital environment',
    address: '01 Street 10, Van Phuc 1 Residential Area, Hiep Binh Ward, Ho Chi Minh City 700000, Vietnam',
    maps_directions_url: PRODUCTION_HOSPITAL_DIRECTIONS.HIU,
    website: 'https://hiuhospital.com/',
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
}

function validateGoogleMapsUrl(value, abbreviation) {
  if (!value) throw new Error(`Set a verified Google Maps directions URL for ${abbreviation} in PRODUCTION_HOSPITAL_DIRECTIONS before writing.`)
  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${abbreviation} directions URL is not a valid URL.`)
  }
  const allowedHosts = ['google.com', 'www.google.com', 'maps.google.com', 'maps.app.goo.gl', 'goo.gl']
  if (url.protocol !== 'https:' || !allowedHosts.includes(url.hostname)) {
    throw new Error(`${abbreviation} directions URL must be an HTTPS Google Maps URL.`)
  }
  return url.toString()
}

if (!STRAPI_URL) throw new Error('STRAPI_URL is intentionally unset; supply the verified production Strapi base URL as an environment variable.')
const baseUrl = new URL(STRAPI_URL)
if (baseUrl.protocol !== 'https:') throw new Error('Production STRAPI_URL must use HTTPS.')
if (!STRAPI_API_TOKEN) throw new Error('STRAPI_API_TOKEN is intentionally unset; supply a scoped Strapi API token through the environment.')
if (WRITE && (!ALLOW_PRODUCTION_WRITE || !PRODUCTION_CONTENT_REVIEWED)) {
  throw new Error('Production write requires ALLOW_PRODUCTION_WRITE=YES and PRODUCTION_CONTENT_REVIEWED=YES after content/image-rights/address review.')
}
if (WRITE && !PUBLISH) throw new Error('Production write requires both --write and --publish so the public page is verified in one explicit operation.')
if (WRITE) {
  for (const hospital of hospitalStories) {
    hospital.maps_directions_url = validateGoogleMapsUrl(hospital.maps_directions_url, hospital.abbreviation)
  }
}

async function request(pathname, options = {}) {
  const response = await fetch(`${STRAPI_URL}${pathname}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
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
  const current = await request('/api/about-page?status=draft&populate=*')
  const document = current.data
  if (!document?.documentId || !Array.isArray(document.sections)) {
    throw new Error('About Page draft or dynamic-zone sections were not found.')
  }

  const sections = document.sections.map(serialize)
  const assessmentIndex = sections.findIndex((section) => section.__component === 'about.assessment')
  if (assessmentIndex < 0) throw new Error('About Page is missing about.assessment; refusing to guess section placement.')

  const existing = sections.find((section) => section.__component === COMPONENT)
  const hospitals = hospitalStories.map((hospital) => {
    const previous = existing?.hospitals?.find((item) => item.abbreviation === hospital.abbreviation)
    return { ...(previous?.id ? { id: previous.id } : {}), ...hospital }
  })
  const section = { ...(existing?.id ? { id: existing.id } : {}), ...sampleSection, hospitals }
  const sectionsWithoutDuplicate = sections.filter((item) => item.__component !== COMPONENT)
  const approachIndex = sectionsWithoutDuplicate.findIndex((item) => item.__component === 'about.assessment')
  sectionsWithoutDuplicate.splice(approachIndex + 1, 0, section)

  const report = {
    mode: WRITE ? 'WRITE + PUBLISH' : 'DRY RUN',
    target: baseUrl.origin,
    aboutDocumentId: document.documentId,
    sectionInsertedAfter: 'about.assessment',
    hospitals: hospitals.map(({ abbreviation, name, address, maps_directions_url }) => ({ abbreviation, name, address, maps_directions_url })),
    otherSectionsPreserved: sectionsWithoutDuplicate.filter((item) => item.__component !== COMPONENT).map((item) => item.__component),
  }
  console.log(JSON.stringify(report, null, 2))
  if (!WRITE) return

  await request('/api/about-page?status=draft', {
    method: 'PUT',
    body: JSON.stringify({ data: { sections: sectionsWithoutDuplicate } }),
  })
  await request('/api/about-page?status=published', {
    method: 'PUT',
    body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
  })

  const verify = await request('/api/about-page?populate=*')
  const publishedSections = verify.data?.sections || []
  const sectionIndex = publishedSections.findIndex((item) => item.__component === COMPONENT)
  const actual = publishedSections[sectionIndex]
  if (!actual || actual.hospitals?.length !== 2 || publishedSections[sectionIndex - 1]?.__component !== 'about.assessment') {
    throw new Error('Production verification failed: expected exactly two hospitals immediately after OUR APPROACH.')
  }
  for (const abbreviation of ['CIH', 'HIU']) {
    const hospital = actual.hospitals.find((item) => item.abbreviation === abbreviation)
    if (!hospital?.maps_directions_url) throw new Error(`Production verification failed: ${abbreviation} directions URL was not saved.`)
  }
  console.log(JSON.stringify({ result: 'seeded-and-published', sectionIndex, hospitals: actual.hospitals.map(({ name, abbreviation, maps_directions_url }) => ({ name, abbreviation, maps_directions_url })) }, null, 2))
}

main().catch((error) => {
  console.error(`[production-hospital-seed] ${error.message}`)
  process.exitCode = 1
})
