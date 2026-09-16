#!/usr/bin/env node

/** Consolidate Signature Procedures title_line_1/title_line_2 into title. */
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
  const nextSections = sections.map((section) => {
    if (section.__component === 'homepage.hero-section') {
      const hero = strip(section)
      return {
        ...hero,
        title_line_1: hero.title_line_1 || 'Plastic Surgery in Vietnam for',
        title_line_2: hero.title_line_2 || 'International Patients',
      }
    }
    if (section.__component !== 'homepage.signature-procedures-section') return strip(section)
    const title = [section.title, section.title_line_1, section.title_line_2]
      .filter((value) => typeof value === 'string' && value.trim())
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim() || 'Designed around anatomy, not trends.'
    const signature = strip(section)
    delete signature.title_line_1
    delete signature.title_line_2
    delete signature.title_lines
    delete signature.title_accent
    if (Array.isArray(signature.items)) {
      signature.items = signature.items.map((item) => item.title === 'Rhinoplasty'
        ? { ...item, href: '/services/rhinoplasty' }
        : item)
    }
    return { ...signature, title }
  })
  const signature = nextSections.find((section) => section.__component === 'homepage.signature-procedures-section')
  console.log(JSON.stringify({ title: signature?.title || null, dryRun: DRY_RUN }, null, 2))
  if (DRY_RUN) return
  await request('/api/homepage?status=draft', { method: 'PUT', body: JSON.stringify({ data: { sections: nextSections } }) })
  await request('/api/homepage?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  console.log('[homepage] Signature Procedures title migrated and published')
}

main().catch((error) => { console.error(`[homepage] failed: ${error.message}`); process.exitCode = 1 })
