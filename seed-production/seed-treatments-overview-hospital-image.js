#!/usr/bin/env node

/**
 * Adds the CIH image to the existing Treatments Overview editorial component.
 * Dry-run by default. Does not alter the primary image or other page sections.
 * Apply migration 034 and deploy the matching schema/frontend before writing.
 */
const STRAPI_URL = (process.env.STRAPI_URL || '').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN || ''
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')
const ALLOW_PRODUCTION_WRITE = process.env.ALLOW_PRODUCTION_WRITE === 'YES'
const CONTENT_REVIEWED = process.env.TREATMENTS_IMAGE_REVIEWED === 'YES'
const COMPONENT = 'treatments-page.editorial-section'
const IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/8/8e/City_International_Hospital_Vietnam.jpg'
const IMAGE_ALT = 'City International Hospital in An Lac, Ho Chi Minh City. Photograph by Keronii, released under CC0 via Wikimedia Commons.'

if (!STRAPI_URL) throw new Error('STRAPI_URL is unset; provide the verified production Strapi URL through the environment.')
const target = new URL(STRAPI_URL)
if (target.protocol !== 'https:') throw new Error('Production STRAPI_URL must use HTTPS.')
if (!TOKEN) throw new Error('STRAPI_API_TOKEN is unset; provide a scoped token through the environment.')
if (WRITE && (!ALLOW_PRODUCTION_WRITE || !CONTENT_REVIEWED || !PUBLISH)) {
  throw new Error('Production write requires --write --publish, ALLOW_PRODUCTION_WRITE=YES, and TREATMENTS_IMAGE_REVIEWED=YES.')
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

function serialize(value) {
  if (Array.isArray(value)) return value.map(serialize)
  if (!value || typeof value !== 'object') return value
  if (value.id && value.url && value.mime) return value.id
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'localizations'].includes(key))
    .map(([key, item]) => [key, serialize(item)]))
}

async function main() {
  const current = await request('/api/treatments-page?status=draft&populate=*')
  const document = current.data
  if (!document?.documentId || !Array.isArray(document.sections)) {
    throw new Error('Treatments Page draft/dynamic-zone sections not found; refusing a blind write.')
  }
  const sections = document.sections.map(serialize)
  const overview = sections.find((item) => item.__component === COMPONENT && String(item.section_key || '').trim().toLowerCase() === 'overview')
  if (!overview) throw new Error('Treatments Page has no treatments-page.editorial-section with section_key=overview.')
  if (!overview.image) throw new Error('Overview primary image is empty; preserve and verify the HIU image before seeding the second image.')

  const report = {
    mode: WRITE ? 'WRITE + PUBLISH' : 'DRY RUN',
    target: target.origin,
    documentId: document.documentId,
    overviewTitle: overview.title,
    primaryImagePreserved: true,
    secondaryImageUrl: IMAGE_URL,
    secondaryImageAlt: IMAGE_ALT,
    source: 'https://commons.wikimedia.org/wiki/File:City_International_Hospital_Vietnam.jpg',
    license: 'CC0 1.0 Universal Public Domain Dedication',
    otherSectionKeysPreserved: sections.filter((item) => item !== overview).map((item) => item.section_key || item.__component),
  }
  console.log(JSON.stringify(report, null, 2))
  if (!WRITE) return

  overview.secondary_image_url = IMAGE_URL
  overview.secondary_image_alt = IMAGE_ALT
  await request('/api/treatments-page?status=draft', {
    method: 'PUT',
    body: JSON.stringify({ data: { sections } }),
  })
  await request('/api/treatments-page?status=published', {
    method: 'PUT',
    body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
  })

  const verify = await request('/api/treatments-page?populate=*')
  const publishedOverview = verify.data?.sections?.find((item) => item.__component === COMPONENT && String(item.section_key || '').trim().toLowerCase() === 'overview')
  if (!publishedOverview?.image || publishedOverview.secondary_image_url !== IMAGE_URL || publishedOverview.secondary_image_alt !== IMAGE_ALT) {
    throw new Error('Published verification failed: primary image or CIH secondary image fields do not match.')
  }
  console.log(JSON.stringify({ result: 'seeded-and-published', primaryImagePreserved: true, secondaryImageUrl: publishedOverview.secondary_image_url }, null, 2))
}

main().catch((error) => {
  console.error(`[treatments-overview-hospital-image] ${error.message}`)
  process.exitCode = 1
})
