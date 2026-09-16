#!/usr/bin/env node

/**
 * Small, targeted migration for the Homepage Patient Results component.
 * It changes only the component's presentation fields; result cases remain
 * owned by the Results API and are not copied into the homepage.
 */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}), ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

function stripMetadata(value) {
  if (Array.isArray(value)) return value.map(stripMetadata)
  if (!value || typeof value !== 'object') return value
  if (value.id && value.url && value.mime) return { connect: [value.id] }
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'localizations'].includes(key))
    .map(([key, item]) => [key, stripMetadata(item)]))
}

async function main() {
  const current = await request('/api/homepage?status=draft&populate=*')
  const sections = current.data?.sections || []
  const patientResults = sections.find((section) => section.__component === 'homepage.patient-results-section')
  if (!patientResults) throw new Error('Homepage Patient Results section was not found')

  const nextSections = sections.map((section) => {
    const next = stripMetadata(section)
    if (section.__component !== 'homepage.patient-results-section') return next
    delete next.eyebrow
    delete next.editorial_lead
    delete next.note
    delete next.source
    return {
      ...next,
      badge: section.badge || section.eyebrow || 'PATIENT RESULTS',
      title: section.title || section.editorial_lead || 'Results are individual. Planning is personal.',
      subtitle: section.subtitle || section.note || 'Individual results vary. Patient images are presented for educational context and do not guarantee a specific outcome.',
    }
  })
  const result = nextSections.find((section) => section.__component === 'homepage.patient-results-section')
  console.log(JSON.stringify({ mode: WRITE ? 'write' : 'dry-run', component: result }, null, 2))
  if (!WRITE) return
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required with --write')
  await request('/api/homepage?status=draft', { method: 'PUT', body: JSON.stringify({ data: { sections: nextSections } }) })
  await request('/api/homepage?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  console.log('[homepage-results] Patient Results fields migrated and published')
}

main().catch((error) => { console.error(`[homepage-results] ${error.message}`); process.exitCode = 1 })
