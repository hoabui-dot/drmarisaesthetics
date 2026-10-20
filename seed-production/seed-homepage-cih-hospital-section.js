#!/usr/bin/env node

/**
 * Adds/updates the second Homepage hospital section for City International
 * Hospital, preserving the existing hospital section and every other section.
 * The CIH exterior image is the CC0 Wikimedia asset already used by the
 * Treatments/About content seeds. Dry-run is read-only; writes require the
 * explicit production approval gates documented in seed-production/README.md.
 */
const STRAPI_URL = (process.env.STRAPI_URL || '').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN || ''
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')
const WRITE_APPROVED = process.env.ALLOW_PRODUCTION_WRITE === 'YES'
const CONTENT_REVIEWED = process.env.PRODUCTION_CONTENT_REVIEWED === 'YES'
const IMAGE_REVIEWED = process.env.HOMEPAGE_CIH_IMAGE_REVIEWED === 'YES'

const SOURCE_UID = 'homepage.hospital-based-surgery-section'
const TARGET_UID = 'homepage.hospital-based-surgery-secondary-section'
const IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/8/8e/City_International_Hospital_Vietnam.jpg'
const IMAGE_NAME = 'city-international-hospital-cc0.jpg'
const IMAGE_ALT = 'Exterior of City International Hospital in Ho Chi Minh City. Photograph by Keronii, released under CC0 via Wikimedia Commons.'
const IMAGE_SOURCE = 'https://commons.wikimedia.org/wiki/File:City_International_Hospital_Vietnam.jpg'
const IMAGE_LICENSE = 'CC0 1.0 Universal Public Domain Dedication'

if (!STRAPI_URL) throw new Error('STRAPI_URL is unset; provide the authorized production Strapi HTTPS base URL.')
const target = new URL(STRAPI_URL)
if (target.protocol !== 'https:') throw new Error('Production STRAPI_URL must use HTTPS.')
if (!TOKEN) throw new Error('STRAPI_API_TOKEN is unset; provide a least-privilege token through the runtime environment.')
if (WRITE && (!PUBLISH || !WRITE_APPROVED || !CONTENT_REVIEWED || !IMAGE_REVIEWED)) {
  throw new Error('Production write requires --write --publish, ALLOW_PRODUCTION_WRITE=YES, PRODUCTION_CONTENT_REVIEWED=YES, and HOMEPAGE_CIH_IMAGE_REVIEWED=YES.')
}

async function request(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${TOKEN}`,
      ...(options.headers || {}),
    },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`)
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

async function findOrUploadImage() {
  const query = new URLSearchParams({ 'filters[name][$eq]': IMAGE_NAME })
  const existing = await request(`/api/upload/files?${query.toString()}`)
  const match = Array.isArray(existing) ? existing.find((file) => file.name === IMAGE_NAME && file.mime === 'image/jpeg') : null
  if (match?.id) return match.id

  const imageUrl = new URL(IMAGE_URL)
  if (imageUrl.protocol !== 'https:' || imageUrl.hostname !== 'upload.wikimedia.org') {
    throw new Error('CIH image must be fetched from the reviewed HTTPS Wikimedia upload host.')
  }
  const imageResponse = await fetch(imageUrl)
  if (!imageResponse.ok) throw new Error(`Could not download CIH image: ${imageResponse.status}`)
  const contentType = (imageResponse.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
  if (contentType !== 'image/jpeg') throw new Error(`Expected a JPEG CIH image, received ${contentType || 'unknown content type'}.`)
  const bytes = await imageResponse.arrayBuffer()
  if (!bytes.byteLength || bytes.byteLength > 12 * 1024 * 1024) throw new Error(`CIH image size is invalid (${bytes.byteLength} bytes; maximum 12 MB).`)

  const form = new FormData()
  form.append('files', new Blob([bytes], { type: contentType }), IMAGE_NAME)
  form.append('fileInfo', JSON.stringify({ name: IMAGE_NAME, alternativeText: IMAGE_ALT, caption: `${IMAGE_SOURCE} — ${IMAGE_LICENSE}` }))
  const uploaded = await request('/api/upload', { method: 'POST', body: form })
  const file = Array.isArray(uploaded) ? uploaded.find((item) => item.name === IMAGE_NAME) || uploaded[0] : null
  if (!file?.id) throw new Error('Strapi Upload API did not return the uploaded CIH image ID.')
  return file.id
}

async function main() {
  const current = await request('/api/homepage?status=draft&populate=*')
  const document = current.data
  if (!document?.documentId || !Array.isArray(document.sections)) {
    throw new Error('Homepage draft/dynamic-zone sections are unavailable; refusing a blind write.')
  }
  const originalSections = document.sections.map(serialize)
  const sourceMatches = originalSections.filter((section) => section.__component === SOURCE_UID)
  if (sourceMatches.length !== 1) {
    throw new Error(`Expected exactly one existing ${SOURCE_UID} section; found ${sourceMatches.length}.`)
  }

  const sections = [...originalSections]
  const sourceIndex = sections.findIndex((section) => section.__component === SOURCE_UID)
  const existingTargetIndex = sections.findIndex((section) => section.__component === TARGET_UID)
  const existingTarget = existingTargetIndex >= 0 ? sections[existingTargetIndex] : null
  // Resolve the specifically named CC0 CIH asset at write time. Do not reuse
  // an arbitrary image from a prior sample/target component.
  const imageId = null
  const proposedSection = {
    ...(existingTarget?.id ? { id: existingTarget.id } : {}),
    __component: TARGET_UID,
    eyebrow: 'HOSPITAL-BASED SURGERY',
    title: 'Surgery at City International Hospital.',
    editorial_lead: 'A hospital setting considered as part of an individual surgical care plan.',
    description: 'City International Hospital is one of the independent hospital settings that may be considered for surgery. Facility suitability and arrangements are confirmed individually following clinical assessment.',
    disclaimer: 'DR. MARIS AESTHETICS and City International Hospital are separate entities. The appropriate facility is confirmed individually; no ownership or universal procedure availability is implied.',
    image_alt: IMAGE_ALT,
    proof_items: [
      { text: 'Individual clinical assessment' },
      { text: 'Facility suitability confirmed before treatment' },
    ],
    ...(imageId ? { image: imageId, mobile_image: imageId } : {}),
  }

  if (existingTargetIndex >= 0) sections.splice(existingTargetIndex, 1)
  const refreshedSourceIndex = sections.findIndex((section) => section.__component === SOURCE_UID)
  sections.splice(refreshedSourceIndex + 1, 0, proposedSection)

  console.log(JSON.stringify({
    mode: WRITE ? 'WRITE + PUBLISH' : 'DRY RUN',
    target: target.origin,
    homepageDocumentId: document.documentId,
    sourceSection: { component: SOURCE_UID, title: sourceMatches[0].title },
    targetSection: { component: TARGET_UID, title: proposedSection.title, insertedImmediatelyAfterSource: true },
    existingTargetUpdated: Boolean(existingTarget),
    cihImage: { url: IMAGE_URL, alt: IMAGE_ALT, source: IMAGE_SOURCE, license: IMAGE_LICENSE, existingMediaId: imageId },
    sectionCountBefore: originalSections.length,
    sectionCountAfter: sections.length,
    unrelatedSectionsPreserved: true,
  }, null, 2))
  if (!WRITE) return

  const uploadedImageId = imageId || await findOrUploadImage()
  proposedSection.image = uploadedImageId
  proposedSection.mobile_image = uploadedImageId
  await request('/api/homepage?status=draft', {
    method: 'PUT',
    body: JSON.stringify({ data: { sections } }),
  })
  await request('/api/homepage?status=published', {
    method: 'PUT',
    body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
  })

  const verify = await request('/api/homepage?populate=*')
  const publishedSections = verify.data?.sections || []
  const matches = publishedSections.filter((section) => section.__component === TARGET_UID)
  const actualIndex = publishedSections.findIndex((section) => section.__component === TARGET_UID)
  const actual = matches[0]
  if (matches.length !== 1
    || publishedSections[actualIndex - 1]?.__component !== SOURCE_UID
    || actual?.title !== proposedSection.title
    || actual?.image?.id !== uploadedImageId
    || actual?.mobile_image?.id !== uploadedImageId) {
    throw new Error('Published verification failed: expected one CIH section after the original section with the approved desktop/mobile image.')
  }
  console.log(JSON.stringify({
    result: 'seeded-and-published',
    component: TARGET_UID,
    title: actual.title,
    imageId: actual.image.id,
    mobileImageId: actual.mobile_image.id,
    otherSectionsPreserved: true,
  }, null, 2))
}

main().catch((error) => {
  console.error(`[homepage-cih-hospital-seed] ${error.message}`)
  process.exitCode = 1
})
