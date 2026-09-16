#!/usr/bin/env node

/**
 * Cleanup migration for the About Us hero component.
 *
 * This is an explicit external migration. It is never imported by Strapi
 * bootstrap and never runs during Docker rebuilds or normal application start.
 * Preview is the default; pass --write to update the existing draft and
 * publish it after verification.
 */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      ...(options.headers || {}),
    },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

const mediaId = (media) => media?.id || media?.data?.id || null

async function findExistingHeroImage() {
  const response = await request('/api/upload/files?pagination[pageSize]=1000')
  const files = Array.isArray(response) ? response : response.data || []
  return files.find((file) => {
    const name = String(file.name || '').toLowerCase()
    const hash = String(file.hash || '').toLowerCase()
    return name === 'doctor-new (1).png' || hash === 'doctor_new_1_40c6d45995'
  }) || null
}

function serialize(value) {
  if (Array.isArray(value)) return value.map(serialize)
  if (!value || typeof value !== 'object') return value
  // Strapi v5 expects the media id directly when a dynamic-zone component is
  // replaced through the REST API. `{ connect: [...] }` is not retained for
  // these nested component relations.
  if (value.id && (value.url || value.mime || value.name)) return value.id
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'localizations'].includes(key))
      .map(([key, item]) => [key, serialize(item)]),
  )
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')

  const current = await request('/api/about-page?status=draft&populate=*')
  const sections = current.data?.sections || []
  const hero = sections.find((section) => section.__component === 'about.hero')
  if (!hero) throw new Error('about.hero is missing from the About Page dynamic zone')
  const uploadsResponse = await request('/api/upload/files?pagination[pageSize]=1000')
  const uploads = Array.isArray(uploadsResponse) ? uploadsResponse : uploadsResponse.data || []
  const findUpload = (patterns) => uploads.find((file) => patterns.some((pattern) => pattern.test(String(file.name || '')) || pattern.test(String(file.hash || '')))) || null
  const existingHeroImage = mediaId(hero.image || hero.backgroundImage) || mediaId(await findExistingHeroImage())
  const profileImage = findUpload([/^(bg-1 \(1\)\.png)$/i, /^bg_1_1_813ceba8c1$/i])
  const revisionImage = findUpload([/^why-preoperative-assessment-matters\.jpg$/i, /^Why_Preoperative_Assessment_Matters_c5830087c1$/i])
  const hospitalImage = findUpload([/^(bg-2 \(1\)\.png)$/i, /^bg_2_1_ab2f95d501$/i])

  const nextHero = {
    __component: 'about.hero',
    eyebrow: hero.eyebrow || 'SURGEON-LED COSMETIC SURGERY · HO CHI MINH CITY',
    title: hero.title || hero.headingPrimary || 'About Us',
    editorial_lead: hero.editorial_lead || hero.supportingParagraph || 'Cosmetic surgery should begin with a medical assessment, a clear surgical plan and confidence in the surgeon responsible for your care.',
    description: hero.description || 'DR. MARIS AESTHETICS is a surgeon-led cosmetic surgery practice in Ho Chi Minh City, providing personalized care for patients considering primary aesthetic procedures as well as complex revision surgery after previous operations.',
    secondary_description: hero.secondary_description || 'Dr. Maris is directly involved from consultation and examination through surgery and postoperative follow-up, while surgical procedures are performed at City International Hospital (CIH).',
    primary_button_label: hero.primary_button_label || 'MEET DR. MARIS',
    secondary_button_label: hero.secondary_button_label || 'REQUEST AN ONLINE CONSULTATION',
    secondary_button_link: hero.secondary_button_link || '/contact',
    image_alt: hero.image_alt || 'Dr. Maris, Lead Plastic Surgeon at Maris Aesthetics',
    ...(existingHeroImage ? { image: existingHeroImage } : {}),
  }

  const nextSections = sections
    .map((section) => {
      if (section.__component === 'about.hero') return nextHero
      if (section.__component === 'about.surgeon-profile' && !section.image && profileImage) return { ...section, image: profileImage.id }
      if (section.__component === 'about.revision' && !section.image && revisionImage) return { ...section, image: revisionImage.id }
      if (section.__component === 'about.hospital' && !section.image && hospitalImage) return { ...section, image: hospitalImage.id }
      return section
    })
    .map(serialize)
  console.log(JSON.stringify({
    write: WRITE,
    preservedSections: sections.map((section) => section.__component),
    removedHeroFields: ['headingSecondaryLine1', 'headingSecondaryLine2', 'statistics', 'headingPrimary', 'supportingParagraph', 'backgroundImage'].filter((field) => hero[field] !== undefined),
    nextHero: nextHero,
    resolvedExistingHeroImage: existingHeroImage,
    restoredImages: {
      surgeonProfile: profileImage?.id || null,
      revision: revisionImage?.id || null,
      hospital: hospitalImage?.id || null,
    },
  }, null, 2))

  if (!WRITE) {
    console.log('[201] Preview only. Re-run with --write to persist the existing About hero data.')
    return
  }

  await request('/api/about-page?status=draft', {
    method: 'PUT',
    body: JSON.stringify({ data: { sections: nextSections } }),
  })
  await request('/api/about-page?status=published', {
    method: 'PUT',
    body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
  })

  const verify = await request('/api/about-page?status=published&populate=*')
  const verifiedHero = (verify.data?.sections || []).find((section) => section.__component === 'about.hero')
  if (!verifiedHero?.title || !verifiedHero?.image) throw new Error('[201] Verification failed: hero title or image is missing')
  if (verifiedHero.headingSecondaryLine1 !== undefined || verifiedHero.headingSecondaryLine2 !== undefined || verifiedHero.backgroundImage !== undefined) {
    throw new Error('[201] Verification failed: legacy hero fields are still present')
  }
  console.log('[201] About hero fields cleaned, migrated, and published successfully.')
}

main().catch((error) => {
  console.error(`[201] ${error.message}`)
  process.exitCode = 1
})
