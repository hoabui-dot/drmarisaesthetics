#!/usr/bin/env node

/**
 * Move the rendered About Us editorial sections into the About Page dynamic
 * zone. This is an explicit, idempotent migration; it is never imported by
 * Strapi bootstrap and never runs during a rebuild.
 */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const DRY_RUN = !process.argv.includes('--write')

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

const mediaId = (media) => media?.id || media?.data?.id || null
const withoutCmsFields = (value) => {
  if (Array.isArray(value)) return value.map(withoutCmsFields)
  if (!value || typeof value !== 'object') return value
  if (value.id && (value.url || value.mime || value.name)) return { connect: [value.id] }
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy'].includes(key))
    .map(([key, item]) => [key, withoutCmsFields(item)]))
}
const findUpload = (files, patterns) => files.find((file) => patterns.some((pattern) => pattern.test(file.name || '')))
const sectionOf = (sections, component) => sections.find((section) => section.__component === component)

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')
  const current = await request('/api/about-page?status=draft&populate=*')
  const existing = current.data?.sections || []
  const uploadsResponse = await request('/api/upload/files?pagination[pageSize]=1000')
  const uploads = Array.isArray(uploadsResponse) ? uploadsResponse : uploadsResponse.data || []

  const hero = sectionOf(existing, 'about.hero')
  const existingByComponent = (component) => sectionOf(existing, component)
  const doctorImage = findUpload(uploads, [/doctor/i, /surgeon/i])
  const hospitalImage = findUpload(uploads, [/hospital/i, /operating/i, /theatre/i, /clinic/i])

  const sections = [
    hero || {
      __component: 'about.hero',
      eyebrow: 'SURGEON-LED COSMETIC SURGERY · HO CHI MINH CITY',
      headingPrimary: 'About Us',
      headingSecondaryLine1: '',
      headingSecondaryLine2: '',
      supportingParagraph: 'Cosmetic surgery should begin with a medical assessment, a clear surgical plan and confidence in the surgeon responsible for your care.',
    },
    existingByComponent('about.surgeon-process') || {
      __component: 'about.surgeon-process',
      eyebrow: 'DIRECT SURGEON CARE',
      title: 'Cosmetic Surgery Built Around Direct Surgeon Involvement',
      description: 'At Maris Aesthetics, the surgeon who consults with you should be the one who operates on you and oversees your recovery. Every stage is planned around the patient, not a procedure menu.',
      steps: [
        ['01', 'Consultation', 'Discuss concerns, goals, medical history and previous procedures directly with the surgeon.'],
        ['02', 'Examination', 'Assess anatomy, tissue condition and individual suitability before discussing a procedure.'],
        ['03', 'Surgical Planning', 'Develop a plan around the patient rather than a standard package or procedure menu.'],
        ['04', 'Surgery', 'Dr. Maris personally performs the procedure in an accredited hospital environment.'],
        ['05', 'Recovery & Follow-Up', 'Recovery and postoperative progress remain part of the surgeon-led process.'],
        ['06', 'Long-Term Care', 'Follow-up remains available as your result settles and your long-term goals evolve.'],
      ].map(([number, title, description]) => ({ number, title, description })),
    },
    existingByComponent('about.assessment') || {
      __component: 'about.assessment',
      eyebrow: 'OUR APPROACH',
      title: 'Assessment Before Procedure',
      quote: 'Patients often arrive with a procedure already in mind. But the procedure someone initially requests is not automatically the procedure that should be recommended.',
      objective: 'The objective is not simply to confirm what a patient requests. It is to understand the actual condition first.',
      factors: ['Anatomy', 'Skin and tissue condition', 'Medical history', 'Previous operations', 'Existing implants', 'Scar tissue', 'Body proportions', 'Current symptoms', 'Aesthetic goals', 'Recovery expectations', 'Limitations of surgery'].map((title) => ({ title })),
    },
    existingByComponent('about.surgeon-profile') || {
      __component: 'about.surgeon-profile',
      eyebrow: 'DR. MARIS',
      title: 'Dr. A. Maris, MD',
      role: 'Cosmetic & Plastic Surgeon | 6+ Years of Cosmetic Surgery Experience',
      description: 'Dr. Maris focuses on personalized surgical planning across breast, body and facial procedures, with particular attention to patients requiring revision or corrective surgery. He remains directly involved in every step of the journey: consultation, assessment, surgical planning, surgery, and postoperative follow-up.',
      philosophy_title: 'His Consultation Philosophy',
      philosophy_description: 'Consultation should provide clarity rather than pressure. We meticulously cover patient concerns, previous surgery, realistic possibilities, surgical suitability, potential limitations, relevant risks, recovery expectations, and international travel considerations.',
      ...(mediaId(doctorImage) ? { image: mediaId(doctorImage) } : {}),
      image_alt: 'Dr. A. Maris, MD',
    },
    existingByComponent('about.revision') || {
      __component: 'about.revision',
      eyebrow: 'REVISION & COMPLEX SURGERY',
      title: 'For Patients Whose Previous Surgery Did Not Go as Planned',
      description: 'Revision patients often face a unique set of challenges. Beyond the physical complications—such as compromised anatomy or excessive scar tissue—there is often a significant emotional burden of anxiety and lost confidence. We approach these cases with the specialized care they require.',
      lead: 'Revision Surgery Is Not Simply “Doing the Procedure Again”',
      lead_description: 'It requires navigating altered tissue planes, managing compromised skin and muscle pockets, and meticulously addressing internal scar tissue to restore support and symmetry. Every revision plan is unique to the patient\'s specific anatomical history.',
      ...(mediaId(hospitalImage) ? { image: mediaId(hospitalImage) } : {}),
      image_alt: 'Surgeon examining a 3D medical scan for a complex revision case',
      concerns: ['Capsular Contracture', 'Breast Implant Rupture', 'Implant Displacement', 'Breast Asymmetry', 'Implant Removal', 'Excessive Scar Tissue', 'Free Silicone', 'Silicone Migration or Leakage', 'Cosmetic Correction'].map((title) => ({ title })),
    },
    existingByComponent('about.international') || {
      __component: 'about.international',
      eyebrow: 'INTERNATIONAL PATIENT STANDARDS',
      title: 'Personalized Care Across Every Border',
      description: 'We welcome patients from across the globe, providing comprehensive planning and transparent consultation for a seamless overseas medical journey.',
      items: [
        ['01', 'Virtual Consultations', 'Begin your journey from home with an in-depth, secure video consultation with Dr. Maris to discuss your goals and assess initial suitability.'],
        ['02', 'Concierge Planning', 'Our dedicated international patient coordinator will assist with scheduling, accommodation recommendations, and local logistics for a stress-free stay.'],
        ['03', 'Transparent Care', 'Clear, upfront detailing of all costs, expected recovery timelines, and required stay durations, ensuring you can plan your trip with complete confidence.'],
      ].map(([number, title, description]) => ({ number, title, description })),
    },
    existingByComponent('about.consultation') || {
      __component: 'about.consultation',
      eyebrow: 'TAKE THE FIRST STEP',
      title: 'Begin Your Personalized Aesthetic Journey',
      button_label: 'BOOK A CONSULTATION',
      secondary_label: 'EXPLORE OUR SERVICES',
      secondary_link: '/services',
    },
    existingByComponent('about.hospital') || {
      __component: 'about.hospital',
      eyebrow: 'HOSPITAL-BASED SURGERY',
      title: 'Surgery Performed at City International Hospital (CIH)',
      statement: 'DR. MARIS AESTHETICS is a cosmetic surgery practice, not a spa or beauty center.',
      description: 'Surgical procedures are performed at City International Hospital (CIH), Ho Chi Minh City. A hospital environment provides access to broader medical infrastructure and supporting services surrounding surgery.',
      ...(mediaId(hospitalImage) ? { image: mediaId(hospitalImage) } : {}),
      image_alt: 'City International Hospital exterior',
      scope: ['Major body contouring', 'Breast surgery', 'Anesthesia procedures', 'Combined procedures', 'Revision surgery', 'Complex secondary operations'].map((title) => ({ title })),
      disclaimer: 'DR. MARIS AESTHETICS and City International Hospital are separate entities. CIH is the hospital environment where surgical procedures are performed.',
    },
  ].map(withoutCmsFields)

  console.log(JSON.stringify({ dryRun: DRY_RUN, before: existing.map((item) => item.__component), after: sections.map((item) => item.__component), uploadCount: uploads.length }, null, 2))
  if (DRY_RUN) return

  await request('/api/about-page?status=draft', { method: 'PUT', body: JSON.stringify({ data: { sections } }) })
  await request('/api/about-page?status=published', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }) })
  const verify = await request('/api/about-page?populate=sections')
  const actual = verify.data?.sections || []
  if (actual.length < 8) throw new Error(`About migration verification failed: expected 8 sections, received ${actual.length}`)
  console.log(`[about-page] migrated and published ${actual.length} sections`)
}

main().catch((error) => { console.error(`[about-page] migration failed: ${error.message}`); process.exitCode = 1 })
