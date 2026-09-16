#!/usr/bin/env node

/**
 * Reconnects existing Homepage media relations only.
 * No files are downloaded, deleted, or re-uploaded by this migration.
 * Run without --write first to inspect the exact targeted mapping.
 */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: { ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}), ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

function stripMetadata(value) {
  if (Array.isArray(value)) return value.map(stripMetadata)
  if (!value || typeof value !== 'object') return value
  // The Strapi v5 REST document endpoint accepts the media id for media
  // fields inside dynamic-zone components. Preserve existing relations in
  // that form while rebuilding the section payload.
  if (value.id && value.url && value.mime) return value.id
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'localizations'].includes(key))
    .map(([key, item]) => [key, stripMetadata(item)]))
}

async function findMedia(files, predicate, label) {
  const match = files.find(predicate)
  if (!match) throw new Error(`Existing Upload Library asset not found: ${label}`)
  return match.id
}

async function main() {
  if (WRITE && !TOKEN) throw new Error('STRAPI_API_TOKEN is required with --write')
  const filesResponse = await request('/api/upload/files?pagination[pageSize]=1000&sort=createdAt:asc')
  const files = Array.isArray(filesResponse) ? filesResponse : filesResponse.data || []
  const media = {
    doctor: await findMedia(files, (file) => file.name.startsWith('homepage-AB6AXuCTeb4K7ic'), 'homepage doctor image'),
    technology: await findMedia(files, (file) => file.name === 'homepage-photo-1551076805-e1869033e561', 'homepage technology image'),
    journeyCase: await findMedia(files, (file) => file.name === 'homepage-photo-1556761175-b413da4baf72', 'journey case image'),
    journeyTravel: await findMedia(files, (file) => file.name === 'homepage-photo-1527631746610-bca00a040d60', 'journey travel image'),
    journeyExam: await findMedia(files, (file) => file.name === 'homepage-photo-1576091160399-112ba8d25d1d', 'journey exam image'),
    journeyRecovery: await findMedia(files, (file) => file.name === 'homepage-photo-1579684385127-1ef15d508118', 'journey recovery image'),
    clinic: await findMedia(files, (file) => file.name === 'clinic.jpg', 'homepage clinic image'),
  }

  const current = await request('/api/homepage?status=draft&populate=*')
  const sections = current.data?.sections || []
  let changed = 0
  const nextSections = sections.map((section) => {
    const next = stripMetadata(section)
    // Strapi's REST document endpoint expects the media id for component
    // media fields (using `{ connect: [...] }` here is silently ignored).
    const setImage = (target, key) => { if (target && !target.image) { target.image = media[key]; changed += 1 } }
    switch (section.__component) {
      case 'homepage.hero-section': setImage(next, 'doctor'); break
      case 'homepage.signature-procedures-section':
        ;(next.items || []).forEach((item, index) => setImage(item, index === 0 ? 'doctor' : index === 2 ? 'clinic' : 'technology'))
        break
      case 'homepage.maris-method-section': setImage(next, 'doctor'); break
      case 'homepage.revision-surgery-section': setImage(next, 'technology'); break
      case 'homepage.doctor-assessment-section': setImage(next, 'doctor'); break
      case 'homepage.hospital-based-surgery-section': setImage(next, 'clinic'); break
      case 'homepage.international-journey-section':
        ;(next.steps || []).forEach((step, index) => setImage(step, ['journeyCase', 'doctor', 'journeyTravel', 'journeyExam', 'technology', 'journeyRecovery'][index] || 'technology'))
        break
      default: break
    }
    return next
  })

  console.log(JSON.stringify({ mode: WRITE ? 'write' : 'dry-run', targetedRelations: changed, media }, null, 2))
  if (!WRITE) return
  await request('/api/homepage?status=draft', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: { sections: nextSections } }) })
  await request('/api/homepage?status=published', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  const verified = await request('/api/homepage?status=published&populate=*')
  const mediaSections = (verified.data?.sections || []).filter((section) => [
    'homepage.hero-section',
    'homepage.signature-procedures-section',
    'homepage.maris-method-section',
    'homepage.revision-surgery-section',
    'homepage.doctor-assessment-section',
    'homepage.hospital-based-surgery-section',
    'homepage.international-journey-section',
  ].includes(section.__component))
  const unresolved = mediaSections.flatMap((section) => {
    const values = []
    if (['homepage.hero-section', 'homepage.maris-method-section', 'homepage.revision-surgery-section', 'homepage.doctor-assessment-section', 'homepage.hospital-based-surgery-section'].includes(section.__component)) values.push(section.image)
    if (section.__component === 'homepage.signature-procedures-section' || section.__component === 'homepage.international-journey-section') values.push(...(section.items || []).map((item) => item.image), ...(section.steps || []).map((step) => step.image))
    return values
  }).filter((image) => !image || typeof image !== 'object')
  if (unresolved.length) throw new Error(`Homepage media verification failed: ${unresolved.length} unresolved references`)
  console.log('[homepage-media] Existing media relations reconnected and published')
}

main().catch((error) => { console.error(`[homepage-media] ${error.message}`); process.exitCode = 1 })
