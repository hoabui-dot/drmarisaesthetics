#!/usr/bin/env node

/* Keep only the About hero in the CMS dynamic zone until the Stitch About route
 * has dedicated CMS components for its newer editorial sections. */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const DRY_RUN = process.argv.includes('--dry-run')

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

function strip(value) {
  if (Array.isArray(value)) return value.map(strip)
  if (!value || typeof value !== 'object') return value
  if (value.url && value.mime && value.id) return { connect: [value.id] }
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'localizations'].includes(key))
    .map(([key, item]) => [key, strip(item)]))
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')
  const current = await request('/api/about-page?status=draft&populate=*')
  const sections = current.data?.sections || []
  const kept = sections.filter((section) => section.__component === 'about.hero').map(strip)
  const removed = sections.filter((section) => section.__component !== 'about.hero').map((section) => section.__component)
  console.log(JSON.stringify({ kept: kept.map((section) => section.__component), removed }, null, 2))
  if (DRY_RUN || removed.length === 0) return
  await request('/api/about-page?status=draft', { method: 'PUT', body: JSON.stringify({ data: { sections: kept } }) })
  await request('/api/about-page?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  const verify = await request('/api/about-page?populate=*')
  const actual = verify.data?.sections || []
  if (actual.some((section) => section.__component !== 'about.hero')) throw new Error('About section cleanup verification failed')
  console.log('[about-page] removed unmapped CMS sections; hero remains canonical')
}

main().catch((error) => { console.error(`[about-page] failed: ${error.message}`); process.exitCode = 1 })
