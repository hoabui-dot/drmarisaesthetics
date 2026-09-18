#!/usr/bin/env node

/**
 * Idempotent seed for the Deep Plane Facelift Specialist single type.
 *
 * Run from the repository root with Node 22:
 * STRAPI_URL=http://localhost:1337 STRAPI_API_TOKEN=... \
 * node --experimental-strip-types migration_scripts/206-seed-deep-plane-facelift-specialist.js
 *
 * Button labels intentionally remain in the frontend. This seed owns editable
 * page copy, section structure and media references only.
 */
const path = await import('node:path')
const fs = await import('node:fs/promises')
const { DEEP_PLANE_FACELIFT_SPECIALIST } = await import('../dental-frontend/src/lib/constants/deep-plane-facelift-specialist.ts')

const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')

async function request(endpoint, method = 'GET', body, headers = {}) {
  const response = await fetch(`${STRAPI_URL}${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, ...headers },
    body,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${method} ${endpoint}: ${response.status} ${JSON.stringify(payload)}`)
  return payload
}

function mediaFileName(source, name) {
  const extension = path.extname(new URL(source, 'https://localhost').pathname) || '.jpg'
  return `deep-plane-${name}${extension}`
}

async function uploadImage(source, name) {
  const fileName = mediaFileName(source, name)
  const existing = await request(`/api/upload/files?filters[name][$eq]=${encodeURIComponent(fileName)}&pagination[pageSize]=1`)
  if (existing?.[0]?.url) return { id: existing[0].id, url: existing[0].url }

  let buffer
  let contentType = 'image/jpeg'
  if (source.startsWith('/')) {
    buffer = await fs.readFile(path.resolve('dental-frontend/public', `.${source}`))
  } else {
    const response = await fetch(source)
    if (!response.ok) throw new Error(`Unable to download ${source}: ${response.status}`)
    contentType = response.headers.get('content-type') || contentType
    buffer = Buffer.from(await response.arrayBuffer())
  }
  const form = new FormData()
  form.append('files', new Blob([buffer], { type: contentType }), fileName)
  const uploaded = await request('/api/upload', 'POST', form)
  if (!uploaded?.[0]?.url) throw new Error(`Upload returned no media URL for ${fileName}`)
  return { id: uploaded[0].id, url: uploaded[0].url }
}

async function mediaOrOriginal(source, name) {
  try {
    return await uploadImage(source, name)
  } catch (error) {
    console.warn(`[deep-plane] media fallback for ${name}: ${error.message}`)
    return { id: undefined, url: source }
  }
}

const source = DEEP_PLANE_FACELIFT_SPECIALIST
const heroImage = await mediaOrOriginal(source.hero.image, 'hero')
const credentialsImage = await mediaOrOriginal(source.credentials.image, 'credentials')
const consultationImage = await mediaOrOriginal(source.consultation.image, 'consultation')
const certificationCards = await Promise.all(source.certifications.cards.map(async (card, index) => ({
  image: (await mediaOrOriginal(card.image, `certification-${index + 1}`)).url,
  image_alt: card.imageAlt,
})))
const safetyCards = await Promise.all(source.safety.cards.map(async (card, index) => ({
  ...card,
  image: (await mediaOrOriginal(card.image, `safety-${index + 1}`)).url,
})))
const recoverySteps = await Promise.all(source.recovery.steps.map(async (step) => ({
  number: step.number,
  title: step.title,
  description: step.description,
  items: [...step.items],
  image: (await mediaOrOriginal(step.image, `recovery-${step.number}`)).id,
  image_alt: step.imageAlt,
})))

const data = {
  seo_title: source.seo.title,
  seo_description: source.seo.description,
  hero: {
    eyebrow: source.hero.eyebrow,
    title: source.hero.title,
    description: source.hero.description,
    image: heroImage.id,
    image_alt: source.hero.imageAlt,
    verified_label: source.hero.verifiedLabel,
    verified_title: source.hero.verifiedTitle,
    verified_meta: source.hero.verifiedMeta,
    checklist: [...source.hero.checklist],
    metrics: source.hero.metrics.map(([value, label]) => [value, label]),
  },
  journey: {
    section_id: source.journey.id,
    eyebrow: source.journey.eyebrow,
    title: source.journey.title,
    description: source.journey.description,
    steps: source.journey.steps.map((step) => [...step]),
  },
  recovery: {
    section_id: source.recovery.id,
    eyebrow: source.recovery.eyebrow,
    title: source.recovery.title,
    description: source.recovery.description,
    stages: source.recovery.stages.map((stage) => [...stage]),
    steps: recoverySteps,
    note: source.recovery.note,
  },
  certifications: {
    section_id: source.certifications.id,
    eyebrow: source.certifications.eyebrow,
    title: source.certifications.title,
    description: source.certifications.description,
    cards: certificationCards,
  },
  safety: {
    section_id: source.safety.id,
    eyebrow: source.safety.eyebrow,
    title: source.safety.title,
    description: source.safety.description,
    cards: safetyCards,
    note: source.safety.note,
  },
  credentials: {
    section_id: source.credentials.id,
    eyebrow: source.credentials.eyebrow,
    title: source.credentials.title,
    image: credentialsImage.id,
    image_alt: source.credentials.imageAlt,
    paragraphs: [...source.credentials.paragraphs],
    cards: source.credentials.cards.map(([title, description]) => [title, description]),
  },
  faq: {
    section_id: source.faq.id,
    eyebrow: source.faq.eyebrow,
    title: source.faq.title,
    description: source.faq.description,
    items: source.faq.items.map(([question, answer]) => [question, answer]),
  },
  consultation: {
    section_id: source.consultation.id,
    eyebrow: source.consultation.eyebrow,
    title: source.consultation.title,
    image: consultationImage.id,
    image_alt: source.consultation.imageAlt,
    address: source.consultation.address,
    hours: source.consultation.hours,
    phone: source.consultation.phone,
    form_title: source.consultation.formTitle,
    form_description: source.consultation.formDescription,
    map_address: source.consultation.mapAddress,
  },
}

await request('/api/deep-plane-facelift-specialist', 'PUT', JSON.stringify({ data }), { 'Content-Type': 'application/json' })
console.log(JSON.stringify({ seeded: true, model: 'deep-plane-facelift-specialist', media: { hero: heroImage.url, credentials: credentialsImage.url, consultation: consultationImage.url, certificationCards: certificationCards.length, safetyCards: safetyCards.length } }, null, 2))
