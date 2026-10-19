#!/usr/bin/env node

/**
 * Creates one local sample entry for the distinct second hospital section by
 * copying the existing Homepage hospital section. The sample is intentionally
 * marked so it can be replaced with the real second hospital's details.
 *
 * Run with --write --publish. Defaults to the local Strapi port and rejects
 * non-local hosts to prevent accidental production writes.
 */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')
const SOURCE_UID = 'homepage.hospital-based-surgery-section'
const TARGET_UID = 'homepage.hospital-based-surgery-secondary-section'

const parsedBase = new URL(BASE)
if (!['localhost', '127.0.0.1', '::1'].includes(parsedBase.hostname)) {
  throw new Error(`This sample seed is local-only; refusing host ${parsedBase.hostname}`)
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      ...(options.headers || {}),
    },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

function serialize(value, { preserveComponentIds }) {
  if (Array.isArray(value)) return value.map((item) => serialize(item, { preserveComponentIds }))
  if (!value || typeof value !== 'object') return value

  // Strapi's populated upload format; retain the media link without sending
  // the upload record's descriptive fields back as component data.
  if (value.id && value.url && value.mime) return value.id

  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => ![
      'documentId', 'createdAt', 'updatedAt', 'publishedAt',
      'createdBy', 'updatedBy', 'localizations',
    ].includes(key) && (preserveComponentIds || key !== 'id'))
    .map(([key, item]) => [key, serialize(item, { preserveComponentIds })]))
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')
  const current = await request('/api/homepage?status=draft&populate=*')
  const document = current.data
  if (!document?.documentId || !Array.isArray(document.sections)) {
    throw new Error('Local Homepage draft or dynamic-zone sections were not found')
  }

  const source = document.sections.find((section) => section.__component === SOURCE_UID)
  if (!source) throw new Error(`Source section ${SOURCE_UID} was not found in the Homepage draft`)

  const sections = document.sections.map((section) => serialize(section, { preserveComponentIds: true }))
  const sourceIndex = sections.findIndex((section) => section.__component === SOURCE_UID)
  const existingSampleIndex = sections.findIndex((section) => section.__component === TARGET_UID)
  const sample = existingSampleIndex >= 0
    ? sections[existingSampleIndex]
    : serialize(source, { preserveComponentIds: false })
  sample.__component = TARGET_UID
  sample.eyebrow = 'HOSPITAL-BASED SURGERY · SAMPLE COPY'
  sample.title = `${source.title || 'Hospital-based surgery'} — Sample Copy`
  sample.image = source.image?.id || null
  sample.mobile_image = source.mobile_image?.id || source.image?.id || null

  if (existingSampleIndex >= 0) sections[existingSampleIndex] = sample
  else sections.splice(sourceIndex + 1, 0, sample)

  console.log(JSON.stringify({
    mode: WRITE ? 'write' : 'dry-run',
    publish: WRITE && PUBLISH,
    documentId: document.documentId,
    sourceTitle: source.title,
    sampleTitle: sample.title,
    sectionCountBefore: document.sections.length,
    sectionCountAfter: sections.length,
    sampleImageId: sample.image,
    sampleMobileImageId: sample.mobile_image,
  }, null, 2))

  if (!WRITE) return
  await request(`/api/homepage?status=draft`, {
    method: 'PUT',
    body: JSON.stringify({ data: { sections } }),
  })

  if (PUBLISH) {
    await request(`/api/homepage?status=published`, {
      method: 'PUT',
      body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
    })
  }

  const verify = await request(`/api/homepage?${PUBLISH ? '' : 'status=draft&'}populate=*`)
  const matches = (verify.data?.sections || []).filter((section) => section.__component === TARGET_UID)
  if (matches.length !== 1 || matches[0].title !== sample.title || !matches[0].image?.id) {
    throw new Error(`Verification failed: found ${matches.length} target section(s)`)
  }
  console.log(JSON.stringify({ result: 'seeded', published: PUBLISH, sample: {
    component: matches[0].__component,
    eyebrow: matches[0].eyebrow,
    title: matches[0].title,
    proofItems: matches[0].proof_items?.length || 0,
    imageId: matches[0].image?.id || null,
  } }, null, 2))
}

main().catch((error) => {
  console.error(`[homepage-secondary-hospital] ${error.message}`)
  process.exitCode = 1
})
