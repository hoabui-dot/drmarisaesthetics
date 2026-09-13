#!/usr/bin/env node

/*
 * Align the Our Team single type with the sections actually rendered by the
 * frontend. The old CONSULTATION editorial block was never rendered, while
 * Authority, Credentials and Hospital were hardcoded in React. This migration
 * makes those three sections CMS-owned and removes the unused block.
 */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const DRY_RUN = process.argv.includes('--dry-run')

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

const byComponent = (sections, component) => sections.find((section) => section.__component === component)
const text = (value, fallback = '') => value || fallback
const itemLabel = (item) => item?.label || item?.title || ''

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')
  const current = await request('/api/our-team?populate=*')
  const value = current.data
  if (!value?.documentId) throw new Error('Published Our Team single type was not found')
  const sections = value.sections || []
  const hero = byComponent(sections, 'our-team.hero-section')
  const principles = sections.filter((s) => s.__component === 'our-team.editorial-section')[0]
  const professional = sections.filter((s) => s.__component === 'our-team.editorial-section')[1]
  const international = sections.filter((s) => s.__component === 'our-team.editorial-section').find((s) => /international/i.test(s.eyebrow || s.title || ''))
  const journey = sections.filter((s) => s.__component === 'our-team.editorial-section').find((s) => /^(the process)$/i.test(s.eyebrow || '') || /international patient journey/i.test(s.title || ''))
  const revision = byComponent(sections, 'our-team.revision-section')
  const faq = byComponent(sections, 'our-team.faq-section')
  const uploads = await request('/api/upload/files?pagination[pageSize]=1000')
  const hospitalImage = (uploads || []).find((file) => file.name === 'buttock-bbl-hospital-safety.jpg') || (uploads || []).find((file) => /hospital|operating|surgery|theatre/i.test(file.name || ''))
  const doctorImage = (uploads || []).find((file) => file.name === 'doctor-updated.png') || (uploads || []).find((file) => /doctor|surgeon/i.test(file.name || ''))
  const clinicImage = (uploads || []).find((file) => file.name === 'consultion (1).png') || (uploads || []).find((file) => /consultion|consultation|clinic/i.test(file.name || ''))
  const patientImage = (uploads || []).find((file) => file.name === 'customer-result (1).png') || (uploads || []).find((file) => /customer-result|patient|revision/i.test(file.name || ''))
  const faqImage = (uploads || []).find((file) => file.name === 'about-clinic-reception.jpg') || (uploads || []).find((file) => /clinic|reception|hospital/i.test(file.name || ''))

  const authority = {
    __component: 'our-team.authority-section',
    eyebrow: 'MEDICAL AUTHORITY',
    title: 'Medical Authority & Expertise',
    description: 'Combining rigorous medical training with over 6 years of specialized surgical experience.',
    cards: [
      { title: 'Education & Degrees', items: [{ label: '[INFORMATION TO VERIFY] Medical Degree' }, { label: '[INFORMATION TO VERIFY] Residency Training' }] },
      { title: 'Certifications', items: [{ label: 'Board Certified Plastic Surgeon' }, { label: '[INFORMATION TO VERIFY] Advanced Surgical License' }] },
      { title: 'Memberships', items: [{ label: '[INFORMATION TO VERIFY] Plastic Surgery Society' }, { label: '[INFORMATION TO VERIFY] International Medical Association' }] },
    ],
  }
  const credentials = {
    __component: 'our-team.credentials-section',
    eyebrow: 'QUALIFICATIONS',
    title: 'Medical Training & Professional Credentials',
    description: 'Dr. Tran Minh Huy maintains a rigorous commitment to verified medical standards and continuous professional development. His credentials represent a foundation of academic excellence and clinical certification recognized by the Vietnam Ministry of Health.',
    rows: [
      { label: 'SPECIALTY', value: 'Specialist Level I in Aesthetic Surgery (Vietnam)' },
      { label: 'TRAINING', value: 'University of Medicine and Pharmacy at Ho Chi Minh City' },
      { label: 'PRACTICE CERTIFICATE', value: '0011736/BYT-CCHN' },
      { label: 'ISSUED', value: '26.12.2013' },
      { label: 'ISSUING AUTHORITY', value: 'Vietnam Ministry of Health' },
    ],
  }
  const hospital = {
    __component: 'our-team.hospital-section',
    eyebrow: 'HOSPITAL-BASED SURGERY',
    title: 'Surgery at City International Hospital (CIH)',
    description: 'Patient safety is paramount. All major surgical procedures are performed within the state-of-the-art operating theaters at City International Hospital. This ensures access to comprehensive medical infrastructure, specialized anesthesiology teams, and rigorous sterilization protocols that only a full-scale hospital can provide.',
    ...(hospitalImage ? { image: hospitalImage.id } : {}),
    image_alt: 'Modern surgical theater at City International Hospital',
    proof_items: [{ label: 'JCI Accredited Standards' }, { label: '24/7 Intensive Care Support' }],
  }

  const professionalSteps = professional?.steps?.length ? professional.steps : [
    'Koren Star Cosmetic Hospital',
    'Asia International Cosmetic Hospital',
    'Medika Cosmetic Hospital',
    'City International Hospital (CIH)',
  ].map((title, index) => ({ number: `0${index + 1}`, title, description: '' }))

  const nextSections = [
    hero && { ...hero, __component: 'our-team.hero-section', ...(doctorImage ? { image: doctorImage.id } : {}) },
    principles && { ...principles, __component: 'our-team.editorial-section' },
    authority,
    professional && { ...professional, __component: 'our-team.editorial-section', steps: professionalSteps, ...(clinicImage ? { image: clinicImage.id } : {}) },
    credentials,
    revision && { ...revision, __component: 'our-team.revision-section', ...(patientImage ? { image: patientImage.id } : {}) },
    hospital,
    international && { ...international, __component: 'our-team.editorial-section', ...(patientImage ? { image: patientImage.id } : {}) },
    journey ? { ...journey, __component: 'our-team.editorial-section' } : {
      __component: 'our-team.editorial-section',
      eyebrow: 'The Process',
      title: 'Your International Patient Journey',
      description: 'A seamless, medically-supervised experience from your first inquiry to your final recovery.',
      steps: [
        { number: '01', title: 'Send Your Case', description: 'Submit your medical history, goals, and high-resolution photos for a preliminary clinical review.' },
        { number: '02', title: 'Video Consultation', description: 'A direct 1-on-1 video call with Dr. Maris to discuss your surgical plan, expectations, and safety.' },
        { number: '03', title: 'Travel Planning', description: 'Receive a detailed itinerary, including hospital booking and recommended recovery accommodation.' },
        { number: '04', title: 'In-Person Exam', description: 'Final clinical examination and pre-operative testing at City International Hospital (CIH).' },
        { number: '05', title: 'Your Procedure', description: 'Surgery performed by Dr. Maris in a fully accredited international hospital setting.' },
        { number: '06', title: 'Recovery & Follow-Up', description: 'Post-operative care and long-term follow-up schedule to ensure optimal healing results.' },
      ],
    },
    faq && { ...faq, __component: 'our-team.faq-section', ...(faqImage ? { background_image: faqImage.id } : {}) },
  ].filter(Boolean).map((section) => {
    const copy = { ...section }
    delete copy.id
    return copy
  })

  const payload = { data: { sections: nextSections }, status: 'published' }
  console.log(JSON.stringify({ documentId: value.documentId, before: sections.map((s) => s.__component), after: nextSections.map((s) => s.__component), hospitalImage: hospitalImage?.id || null, faqImage: faqImage?.id || null }, null, 2))
  if (!DRY_RUN) {
    await request('/api/our-team', { method: 'PUT', body: JSON.stringify(payload) })
    const verify = await request('/api/our-team?populate=*')
    const verified = verify.data?.sections || []
    if (verified.some((section) => section.eyebrow === 'CONSULTATION')) throw new Error('Unused CONSULTATION section is still present')
    if (!verified.some((section) => section.__component === 'our-team.hospital-section')) throw new Error('Hospital section migration failed')
    console.log(`[our-team] migrated ${verified.length} CMS sections and removed unused CONSULTATION block`)
  }
}

main().catch((error) => { console.error(`[our-team] failed: ${error.message}`); process.exitCode = 1 })
