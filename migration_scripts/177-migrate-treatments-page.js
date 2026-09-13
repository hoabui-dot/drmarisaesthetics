#!/usr/bin/env node

/* Migrate the editorial /treatments landing page into its dedicated Strapi single type. */
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

function withoutMeta(value) {
  if (Array.isArray(value)) return value.map(withoutMeta)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'localizations'].includes(key))
    .map(([key, item]) => [key, withoutMeta(item)]))
}

async function findImage(files, patterns) {
  const match = files.find((file) => patterns.some((pattern) => pattern.test(file.name)))
  if (!match) throw new Error(`Could not find required upload: ${patterns.map(String).join(', ')}`)
  return match.id
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')
  const files = await request('/api/upload/files?pagination[pageSize]=1000')
  const heroImage = await findImage(files, [/aec6099c/i, /rhinoplasty/i, /doctor.*updated/i])
  const consultationImage = await findImage(files, [/consultion/i, /consultation/i, /clinic.*consult/i])

  const sections = [
    {
      __component: 'treatments-page.hero-section',
      eyebrow: 'DR. MARIS AESTHETICS · FACIAL PROCEDURES',
      title: 'Rhinoplasty Surgery in Vietnam',
      description: 'At DR. MARIS AESTHETICS, we redefine nasal harmony through a meticulous structural approach that honors your unique facial architecture. Our surgical philosophy combines clinical precision with natural, balanced results that enhance your features without looking operated on, ensuring both aesthetic beauty and functional integrity.',
      review_label: 'Reviewed by Dr. Maris · Ho Chi Minh City, Vietnam',
      image: heroImage,
      image_alt: 'Rhinoplasty procedure at DR. MARIS AESTHETICS',
    },
    {
      __component: 'treatments-page.editorial-section',
      section_key: 'overview',
      eyebrow: 'OVERVIEW',
      title: 'What is Rhinoplasty?',
      paragraph_one: 'Rhinoplasty, commonly referred to as a nose job, is a highly refined surgical procedure designed to alter the shape, size, or proportions of the nose. At DR. MARIS AESTHETICS, we approach rhinoplasty not just as an aesthetic enhancement, but as a meticulous restructuring that honors your foundational facial architecture.',
      paragraph_two: 'Our philosophy is rooted in sterile warmth—combining surgical precision with a deep understanding of natural aesthetic harmony. Whether addressing cosmetic concerns or functional breathing issues, our goal is to create a result that looks entirely native to your face, enhancing your features without looking operated on.',
      image: consultationImage,
      image_alt: 'Patient consulting with a plastic surgeon in a premium medical consultation room',
    },
    {
      __component: 'treatments-page.editorial-section',
      section_key: 'concerns',
      eyebrow: 'PATIENT-CENTRED PLANNING',
      title: 'Designed Around Your Concerns',
      items: [
        { title: 'Dorsal Hump', description: 'Smoothing bumps on the bridge of the nose for a straighter, more refined profile.' },
        { title: 'Bulbous Tip', description: 'Refining a rounded or disproportionate nasal tip to create elegant definition.' },
        { title: 'Asymmetry', description: 'Correcting deviation or unevenness to achieve balanced facial proportions.' },
        { title: 'Breathing Issues', description: 'Addressing functional impairments, such as a deviated septum, to improve airflow.' },
      ],
    },
    {
      __component: 'treatments-page.editorial-section',
      section_key: 'methodology',
      eyebrow: 'SURGICAL METHODOLOGY',
      title: 'The Science of Rhinoplasty',
      lead: 'Understanding the structural approach is key to achieving optimal results. Depending on your specific anatomical needs, we employ either an open or closed technique.',
      image: consultationImage,
      image_alt: 'Clinical consultation supporting rhinoplasty structural planning',
      items: [
        { number: '01', title: 'Open Rhinoplasty', description: 'Involves a small incision across the columella, providing full visibility of the nasal framework for intricate restructuring and precise modifications.' },
        { number: '02', title: 'Closed Rhinoplasty', description: 'All incisions are hidden inside the nostrils, resulting in no visible scarring and generally a faster initial recovery time, ideal for minor refinements.' },
      ],
    },
  ]
  const payload = { seo: { meta_title: 'Treatments | Dr. Maris Aesthetics', meta_description: 'Explore surgeon-led rhinoplasty treatment planning at Dr. Maris Aesthetics in Vietnam.' }, sections }
  console.log(JSON.stringify({ heroImage, consultationImage, sections: sections.map((section) => section.section_key || section.__component) }, null, 2))
  if (DRY_RUN) return
  await request('/api/treatments-page?status=draft', { method: 'PUT', body: JSON.stringify({ data: payload }) })
  await request('/api/treatments-page?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  const verify = await request('/api/treatments-page?populate=*')
  const actual = verify.data?.sections || []
  if (actual.length !== sections.length) throw new Error(`Expected ${sections.length} sections, found ${actual.length}`)
  console.log(`[treatments] migrated ${actual.length} sections into api::treatments-page.treatments-page`)
}

main().catch((error) => { console.error(`[treatments] failed: ${error.message}`); process.exitCode = 1 })
