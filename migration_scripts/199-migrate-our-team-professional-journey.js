#!/usr/bin/env node

/**
 * Adds the missing Professional Journey component to the Our Team dynamic zone.
 * The migration is intentionally idempotent and preserves every existing
 * section and media relation.
 */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: {
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

const professionalSection = {
  __component: 'our-team.professional-section',
  eyebrow: 'PROFESSIONAL JOURNEY',
  title: 'Experience Across Cosmetic Surgery & Hospital Environments',
  lead: "A surgeon's professional journey is built through disciplined training, hospital experience and responsibility for every patient.",
  description: "Dr. Maris's professional background includes experience across cosmetic surgery institutions and a hospital environment in Ho Chi Minh City.",
  image_alt: 'Modern premium clinic hallway in Ho Chi Minh City',
  steps: [
    { number: '01', title: 'Koren Star Cosmetic Hospital', description: 'Early clinical experience in a hospital-based cosmetic surgery environment.' },
    { number: '02', title: 'Asia International Cosmetic Hospital', description: 'Continued development across aesthetic surgery consultations and procedures.' },
    { number: '03', title: 'Medika Cosmetic Hospital', description: 'Further experience with individualized cosmetic surgery planning and patient care.' },
    { number: '04', title: 'City International Hospital (CIH)', description: 'Major procedures performed with hospital infrastructure and specialist support.' },
  ],
}

function stripMetadata(value) {
  if (Array.isArray(value)) return value.map(stripMetadata)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'localizations'].includes(key))
    .map(([key, item]) => [key, stripMetadata(item)]))
}

async function main() {
  if (WRITE && !TOKEN) throw new Error('STRAPI_API_TOKEN is required with --write')
  const current = await request('/api/our-team?status=draft&populate=*')
  const value = current.data
  if (!value?.documentId) throw new Error('Our Team single type was not found')
  const sections = Array.isArray(value.sections) ? value.sections : []
  if (sections.some((section) => section.__component === 'our-team.professional-section')) {
    console.log(JSON.stringify({ mode: WRITE ? 'write' : 'dry-run', changed: false, reason: 'professional-section-already-exists' }, null, 2))
    return
  }

  const nextSections = sections.map(stripMetadata)
  const credentialsIndex = nextSections.findIndex((section) => section.__component === 'our-team.credentials-section')
  const insertionIndex = credentialsIndex >= 0 ? credentialsIndex : Math.min(2, nextSections.length)
  nextSections.splice(insertionIndex, 0, professionalSection)

  console.log(JSON.stringify({ mode: WRITE ? 'write' : 'dry-run', changed: true, insertionIndex, sectionCount: nextSections.length }, null, 2))
  if (!WRITE) return

  await request('/api/our-team?status=draft', {
    method: 'PUT',
    body: JSON.stringify({ data: { sections: nextSections } }),
  })
  await request('/api/our-team?status=published', {
    method: 'PUT',
    body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
  })
  console.log('[our-team-professional] Professional Journey section migrated and published')
}

main().catch((error) => {
  console.error(`[our-team-professional] failed: ${error.message}`)
  process.exitCode = 1
})
