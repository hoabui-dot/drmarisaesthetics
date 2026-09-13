#!/usr/bin/env node

/* Keep homepage.maris-method-section as the single canonical Maris Method block. */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const DRY_RUN = process.argv.includes('--dry-run')

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  })
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
  const current = await request('/api/homepage?status=draft&populate=*')
  const sections = current.data?.sections || []
  const duplicateUid = 'homepage.surgical-care-process-section'
  const removed = sections.filter((section) => section.__component === duplicateUid)
  const nextSections = sections.filter((section) => section.__component !== duplicateUid).map(strip)
  console.log(JSON.stringify({ removed: removed.map((section) => ({ id: section.id, title: section.title })), remaining: nextSections.map((section) => section.__component) }, null, 2))
  if (DRY_RUN || removed.length === 0) return
  await request('/api/homepage?status=draft', { method: 'PUT', body: JSON.stringify({ data: { sections: nextSections } }) })
  await request('/api/homepage?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  const verify = await request('/api/homepage?populate=*')
  const matches = (verify.data?.sections || []).filter((section) => /MARIS METHOD/i.test(section.eyebrow || '') || /procedure menu/i.test(section.title || ''))
  if (matches.length !== 1 || matches[0].__component !== 'homepage.maris-method-section') throw new Error('Canonical Maris Method verification failed')
  console.log('[homepage] removed duplicate surgical-care-process section and kept maris-method-section')
}

main().catch((error) => { console.error(`[homepage] failed: ${error.message}`); process.exitCode = 1 })
