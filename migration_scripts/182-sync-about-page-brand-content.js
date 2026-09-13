#!/usr/bin/env node

/** Sync the About hero in Strapi with the current DR. MARIS AESTHETICS route. */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')
  const current = await request('/api/about-page?status=draft&populate=*')
  const sections = current.data?.sections || []
  const hero = sections.find((section) => section.__component === 'about.hero')
  if (!hero) throw new Error('about.hero is missing from the About Page dynamic zone')

  const updatedHero = {
    __component: 'about.hero',
    eyebrow: 'SURGEON-LED COSMETIC SURGERY · HO CHI MINH CITY',
    headingPrimary: 'About Us',
    headingSecondaryLine1: '',
    headingSecondaryLine2: '',
    supportingParagraph: 'Cosmetic surgery should begin with a medical assessment, a clear surgical plan and confidence in the surgeon responsible for your care.',
    ...(hero.backgroundImage?.id ? { backgroundImage: hero.backgroundImage.id } : {}),
    ...(hero.statistics?.length ? { statistics: hero.statistics.map(({ value, label, icon, icon_image }) => ({ value, label, icon, ...(icon_image?.id ? { icon_image: icon_image.id } : {}) })) } : {}),
  }
  const nextSections = sections.map((section) => section.__component === 'about.hero' ? updatedHero : section)
  console.log(JSON.stringify({ currentSections: sections.map((item) => item.__component), nextHero: updatedHero }, null, 2))
  if (!WRITE) return console.log('[182] Preview only. Re-run with --write to persist.')

  const id = current.data.documentId || current.data.id
  await request(`/api/about-page?status=draft`, { method: 'PUT', body: JSON.stringify({ data: { sections: nextSections } }) })
  await request(`/api/about-page?status=published`, { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  console.log('[182] About hero synchronized and published.')
}

main().catch((error) => { console.error(`[182] ${error.message}`); process.exitCode = 1 })
