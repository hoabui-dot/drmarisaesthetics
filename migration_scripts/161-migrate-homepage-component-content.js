#!/usr/bin/env node

/**
 * Moves the editorial homepage content into the named Homepage component
 * fields. It is idempotent and intentionally keeps the legacy JSON fields
 * during the rollout so older builds can be rolled back safely.
 *
 * Usage:
 * STRAPI_URL=http://127.0.0.1:22345 STRAPI_API_TOKEN=... \
 *   node migration_scripts/161-migrate-homepage-component-content.js --write --publish
 */
const { homepageContent } = require('./160-migrate-stitch-homepage-content')

const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')

const sectionOrder = [
  ['homepage.hero-section', 'hero_content'],
  ['homepage.signature-procedures-section', 'signature_procedures'],
  ['homepage.surgical-care-process-section', 'surgical_care_process'],
  ['homepage.maris-method-section', 'maris_method'],
  ['homepage.revision-surgery-section', 'revision_surgery'],
  ['homepage.doctor-assessment-section', 'doctor_assessment'],
  ['homepage.hospital-based-surgery-section', 'hospital_based_surgery'],
  ['homepage.international-patients-section', 'international_patients'],
  ['homepage.international-journey-section', 'international_journey'],
  ['homepage.patient-results-section', 'patient_results'],
  ['homepage.consultation-section', 'consultation'],
  ['homepage.frequently-asked-questions-section', 'frequently_asked_questions'],
]

const textItems = (items = []) => items.map((text) => ({ text: String(text) }))
// The structured Strapi components use media fields, not image_url fields.
// Keep remote image URLs available to the follow-up media migration (162), but
// never send those temporary keys to the Strapi API from this text migration.
const imageFields = (image = {}, includeImageSource = false) => ({
  ...(includeImageSource && image.src ? { image_url: image.src } : {}),
  ...(image.alt ? { image_alt: image.alt } : {}),
})
const processSteps = (items = []) => items.map((step, index) => ({ number: step.number || `0${index + 1}`, title: step.title || '', description: step.description || '' }))

function toStructuredSection(uid, sourceKey, options = {}) {
  const includeImageSources = options.includeImageSources === true
  const source = homepageContent[sourceKey] || {}
  if (sourceKey === 'hero_content') {
    return {
      __component: uid, eyebrow: source.eyebrow, title_line_1: source.title_lines?.[0] || source.title || '', title_line_2: source.title_lines?.[1] || '',
      editorial_lead: source.editorial_lead, paragraph_one: source.paragraphs?.[0] || source.description || '', paragraph_two: source.paragraphs?.[1] || source.secondary_description || '',
      ...imageFields(source.image || { src: source.doctor_image, alt: 'Dr. Maris in a clinical setting' }, includeImageSources), trust_labels: textItems(source.trust_labels),
    }
  }
  if (sourceKey === 'signature_procedures') {
    return { __component: uid, eyebrow: source.eyebrow, title_line_1: source.title_lines?.[0] || source.title || '', title_line_2: source.title_lines?.[1] || source.title_accent || '', description: source.description, items: (source.items || []).map((item, index) => ({ number: item.number || `0${index + 1}`, title: item.title || '', description: item.description || '', href: item.href || '', ...(includeImageSources && item.image ? { image_url: item.image } : {}), image_alt: item.image_alt || '' })) }
  }
  if (sourceKey === 'maris_method' || sourceKey === 'surgical_care_process') {
    return { __component: uid, eyebrow: source.eyebrow, title: source.title || '', description: source.description, quote: source.quote, ...((source.image && imageFields(source.image, includeImageSources)) || {}), stat_title: source.stat?.title, stat_description: source.stat?.description, steps: processSteps(source.process_steps || source.steps) }
  }
  if (sourceKey === 'revision_surgery') return { __component: uid, eyebrow: source.eyebrow, title: source.title || '', editorial_lead: source.editorial_lead || source.subtitle, description: source.description, ...imageFields(source.image, includeImageSources), concerns: textItems(source.concerns) }
  if (sourceKey === 'doctor_assessment') return { __component: uid, eyebrow: source.eyebrow, title: source.title || '', role: source.role, description: source.description, ...imageFields(source.image, includeImageSources), considerations: textItems(source.considerations) }
  if (sourceKey === 'hospital_based_surgery') return { __component: uid, eyebrow: source.eyebrow, title: source.title || '', editorial_lead: source.editorial_lead, description: source.description, disclaimer: source.disclaimer, ...imageFields(source.image, includeImageSources), proof_items: textItems(source.proof_items) }
  if (sourceKey === 'international_patients') return { __component: uid, eyebrow: source.eyebrow, title: source.title || '', description: source.description, note: source.note, review_items: textItems(source.review_items) }
  if (sourceKey === 'international_journey') return { __component: uid, eyebrow: source.eyebrow, title: source.title || '', description: source.description, steps: (source.steps || []).map((step, index) => ({ number: step.number || `0${index + 1}`, title: step.title || '', description: step.description || '', ...(includeImageSources && step.image ? { image_url: step.image } : {}), image_alt: step.image_alt || '' })) }
  if (sourceKey === 'patient_results') return { __component: uid, eyebrow: source.eyebrow, editorial_lead: source.editorial_lead, note: source.note, source: source.source }
  if (sourceKey === 'consultation') return { __component: uid, eyebrow: source.eyebrow, title: source.title || '', editorial_lead: source.editorial_lead, description: source.description }
  if (sourceKey === 'frequently_asked_questions') return { __component: uid, eyebrow: source.eyebrow, title: source.title || '', items: source.items || [] }
  return { __component: uid }
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}), ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

async function main() {
  const current = await request('/api/homepage?status=draft&populate=*')
  const data = current.data || {}
  const sections = sectionOrder.map(([uid, sourceKey]) => toStructuredSection(uid, sourceKey))
  const payload = { data: { sections } }
  console.log(JSON.stringify({ mode: WRITE ? 'write' : 'dry-run', endpoint: `${BASE}/api/homepage`, order: sectionOrder.map(([uid]) => uid), existingDocumentId: data.documentId || null }, null, 2))
  if (!WRITE) return
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required when using --write')
  await request('/api/homepage?status=draft', { method: 'PUT', body: JSON.stringify(payload) })
  if (PUBLISH) await request('/api/homepage?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  const verified = await request('/api/homepage?status=published&populate=*')
  const missing = sectionOrder.filter(([uid]) => !verified.data?.sections?.some((section) => section.__component === uid)).map(([uid]) => uid)
  if (missing.length) throw new Error(`Homepage dynamic-zone migration verification failed: ${missing.join(', ')}`)
  console.log(`Homepage component migration completed${PUBLISH ? ' and published' : ''}.`)
}

module.exports = { sectionOrder, toStructuredSection }

if (require.main === module) {
  main().catch((error) => { console.error(`[homepage-component-migration] ${error.message}`); process.exitCode = 1 })
}
