#!/usr/bin/env node

/** Remove the obsolete Principles section and split remaining editorial sections. */
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

function componentForEditorial(section) {
  const text = `${section.eyebrow || ''} ${section.title || ''}`.toLowerCase()
  if (text.includes('professional') || text.includes('hospital environment')) return 'our-team.professional-section'
  if (text.includes('international patient') || text.includes('international')) return 'our-team.international-section'
  return 'our-team.journey-section'
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')
  const current = await request('/api/our-team?status=draft&populate=*')
  const sections = current.data?.sections || []
  let removed = 0
  const nextSections = sections.flatMap((section) => {
    if (section.__component !== 'our-team.editorial-section') return [strip(section)]
    const marker = `${section.eyebrow || ''} ${section.title || ''}`.toLowerCase()
    if (marker.includes('principles behind the practice')) {
      removed += 1
      return []
    }
    return [{ ...strip(section), __component: componentForEditorial(section) }]
  })
  console.log(JSON.stringify({ removed, components: nextSections.map((section) => section.__component), dryRun: DRY_RUN }, null, 2))
  if (DRY_RUN) return
  if (removed === 0 && !sections.some((section) => section.__component === 'our-team.editorial-section')) {
    console.log('[our-team] Principles section is already absent; no data update required')
    return
  }
  await request('/api/our-team?status=draft', { method: 'PUT', body: JSON.stringify({ data: { sections: nextSections } }) })
  await request('/api/our-team?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  console.log('[our-team] removed THE PRINCIPLES BEHIND THE PRACTICE and migrated remaining editorial sections')
}

main().catch((error) => { console.error(`[our-team] failed: ${error.message}`); process.exitCode = 1 })
