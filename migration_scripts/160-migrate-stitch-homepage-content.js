#!/usr/bin/env node

/**
 * Migrate the content currently rendered by dental-frontend's Stitch homepage
 * into the Homepage single type.
 *
 * This migration intentionally excludes button labels. Those remain UI/action
 * labels owned by the frontend design system. Image references are retained as
 * source URLs in JSON because the current Stitch homepage uses remote images;
 * they can be replaced with Strapi media IDs in a later media migration.
 *
 * Usage:
 *   STRAPI_URL=http://127.0.0.1:22345 STRAPI_API_TOKEN=... \
 *     node migration_scripts/160-migrate-stitch-homepage-content.js
 *   ... node migration_scripts/160-migrate-stitch-homepage-content.js --write --publish
 */

const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')

const doctorImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTeb4K7icJOejOCNmhoM1L_97JimcI6Qtyot9YzMr51gD3_D096TT551datl7elzq4TGEQz-bEMf8KBAUaMGPSuRx-gXA7LQDE6AxQJeik8HAprXx5WLc0J8tMTKQRuN5tTfMsno6xTgx-ocAouFxiXWQRiCATFFvjwsLvpxprL1m7V9S-mUEXDc3L_aWSsmNthvE245NzLwUH0W-RYhnjXBO7LUB-OAqjk5SNLSZFeUzTH3V751D0'
const technologyImage = 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1800&q=85'
const clinicImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxLNXCFVyLcdlfs3uKkXCF1nWzjOTlVHjbpSP07wg76cD4otnSBnmCAAt1Q57Tyj15rO6f8Z6857zzPhjjWAmXaeErAAZnwu6mADqs3tc98ftky9z2AYeSGQb0fDf_TJgY_52sEsTvavziZQJlySwrko2v_jKxGIpfSjrhbY2TDZfq64krwVmF90rBv7n4UMWEk2pyh4qcEwDImDsvTDE0w7iLuJAeoRqbp3rlrmpdS1aQ7tLL7vbdw5g'

const homepageContent = {
  title: 'Dr. Maris Aesthetics',
  metadata_title: 'Plastic Surgery in Vietnam for International Patients | Dr. Maris Aesthetics',
  metadata_description: 'Surgeon-led cosmetic surgery in Ho Chi Minh City, with direct surgeon care, hospital-based procedures, and personalized revision assessment.',
  hero_content: {
    eyebrow: 'HOSPITAL-BASED COSMETIC SURGERY · HO CHI MINH CITY',
    title_lines: ['Plastic Surgery in', 'Vietnam for International Patients'],
    editorial_lead: 'Cosmetic surgery is a medical decision before it is an aesthetic one.',
    paragraphs: [
      'At DR. MARIS AESTHETICS, your case is personally assessed and managed by Dr. Maris, with surgery performed at City International Hospital (CIH) in Ho Chi Minh City.',
      'From primary cosmetic procedures to complex revision surgery, every surgical plan begins with your anatomy, medical history, previous procedures and individual goals.',
    ],
    image: { src: doctorImage, alt: 'Dr. Maris in a clinical setting' },
    trust_labels: ['Direct Surgeon Care', 'Hospital-Based Surgery', 'International Patients', 'Revision Surgery'],
  },
  signature_procedures: {
    eyebrow: 'SIGNATURE PROCEDURES',
    title_lines: ['Designed around anatomy, not', 'trends.'],
    description: 'Explore the procedures Dr. Maris performs with the same clinical discipline: careful assessment, transparent planning and a recovery strategy that respects the individual.',
    items: [
      { number: '01', title: 'Rhinoplasty', description: 'Refined facial balance with a plan built around your anatomy.', href: '/face/rhinoplasty', image: doctorImage, image_alt: 'Dr. Maris planning facial surgery with a patient' },
      { number: '02', title: 'Breast Surgery', description: 'Personalized proportion, implant planning and long-term support.', href: '/treatments#breast-surgery', image: technologyImage, image_alt: 'Premium clinical consultation environment' },
      { number: '03', title: 'Body Contouring', description: 'Thoughtful contouring designed for natural movement and recovery.', href: '/treatments#body-contouring', image: clinicImage, image_alt: 'City International Hospital facility' },
      { number: '04', title: 'Revision Surgery', description: 'Complex correction begins with understanding what came before.', href: '/treatments#revision-surgery', image: technologyImage, image_alt: 'Clinical planning environment for revision surgery' },
    ],
  },
  maris_method: {
    eyebrow: 'THE MARIS METHOD',
    title: 'Every case begins with the surgeon, not a procedure menu.',
    description: 'Dr. Maris brings 6+ years of specialized cosmetic surgery experience to every case. Unlike high-volume clinics, we strictly limit our surgical schedule so that the surgeon responsible for your plan remains involved throughout your care.',
    quote: '“Good surgery begins with listening, examination and a clear plan—not with a package or a promise.”',
    process_steps: [
      { number: '01', title: 'Consultation' },
      { number: '02', title: 'Examination' },
      { number: '03', title: 'Surgical Planning' },
      { number: '04', title: 'Surgery' },
      { number: '05', title: 'Follow-Up' },
    ],
    image: { src: doctorImage, alt: 'Dr. Maris, lead surgeon' },
    stat: { title: 'Direct care', description: 'From assessment through follow-up' },
  },
  surgical_care_process: {
    eyebrow: 'THE MARIS METHOD',
    title: 'Every case begins with the surgeon, not a procedure menu.',
    description: 'Dr. Maris brings 6+ years of specialized cosmetic surgery experience to every case. Unlike high-volume clinics, we strictly limit our surgical schedule so that the surgeon responsible for your plan remains involved throughout your care.',
    quote: '“Good surgery begins with listening, examination and a clear plan—not with a package or a promise.”',
    steps: [
      { number: '01', title: 'Consultation' }, { number: '02', title: 'Examination' }, { number: '03', title: 'Surgical Planning' }, { number: '04', title: 'Surgery' }, { number: '05', title: 'Follow-Up' },
    ],
  },
  doctor_assessment: {
    eyebrow: 'DIRECT SURGEON ASSESSMENT',
    title: 'Your Case Is Personally Assessed by Dr. Maris',
    role: 'Dr. Maris / Dr. Tran Minh Huy · Cosmetic & Plastic Surgeon',
    description: 'A thorough assessment considers anatomy, previous procedures, implant history, surgical goals, limitations and recovery expectations before any recommendation is made.',
    considerations: ['Anatomy assessment', 'Previous procedures', 'Implant history', 'Surgical goals', 'Limitations', 'Recovery expectations', 'Revision considerations'],
    image: { src: doctorImage, alt: 'Dr. Maris, lead surgeon' },
  },
  revision_surgery: {
    eyebrow: 'SPECIALIZED CARE',
    title: 'Revision Cosmetic Surgery Vietnam',
    editorial_lead: 'When your first surgery did not go as planned.',
    description: 'Revision surgery is not simply doing the procedure again. It requires a careful assessment of what was performed, the tissue that remains and what can be safely improved.',
    callout_title: 'Can my previous cosmetic surgery be corrected?',
    callout_description: 'Many issues can be significantly improved, but realistic outcomes depend on each individual case.',
    concerns_title: 'Common Revision Concerns We Address',
    concerns: ['Capsular Contracture', 'Asymmetry Correction', 'Excessive Scar Tissue', 'Implant Malposition', 'Over-resected Rhinoplasty', 'Contour Irregularities', 'Unsatisfactory Functional Outcomes'],
    image: { src: technologyImage, alt: 'Clinical technology used for revision surgery planning' },
  },
  hospital_based_surgery: {
    eyebrow: 'HOSPITAL-BASED SURGERY',
    title: 'Surgery performed at City International Hospital.',
    editorial_lead: 'Major cosmetic surgery requires more than a surgical suite.',
    description: 'Hospital-based surgery provides the medical infrastructure, safety systems and specialist support required for complex aesthetic procedures.',
    proof_items: ['24/7 medical infrastructure', 'Professional nursing care', 'Advanced surgical support', 'Post-operative monitoring'],
    disclaimer: 'Disclaimer: DR. MARIS AESTHETICS and City International Hospital are separate entities. CIH is the hospital where surgical procedures are performed.',
    image: { src: clinicImage, alt: 'City International Hospital clinical facility' },
  },
  international_journey: {
    eyebrow: 'THE PROCESS',
    title: 'Your International Patient Journey',
    description: 'A seamless, medically-supervised experience from your first inquiry to your final recovery.',
    steps: [
      { number: '01', title: 'Send Your Case', description: 'Submit your medical history, goals, and high-resolution photos for a preliminary clinical review.', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85', image_alt: 'International patient preparing medical information for remote surgical review' },
      { number: '02', title: 'Video Consultation', description: 'A direct 1-on-1 video call with Dr. Maris to discuss your surgical plan, expectations, and safety.', image: doctorImage, image_alt: 'Video consultation with Dr. Maris in a private clinical setting' },
      { number: '03', title: 'Travel Planning', description: 'Receive a detailed itinerary, including hospital booking and recommended recovery accommodation.', image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=85', image_alt: 'International patient preparing for planned medical travel to Vietnam' },
      { number: '04', title: 'In-Person Exam', description: 'Final clinical examination and pre-operative testing at City International Hospital (CIH).', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85', image_alt: 'Plastic surgeon conducting an in-person clinical examination' },
      { number: '05', title: 'Your Procedure', description: 'Surgery performed by Dr. Maris in a fully accredited international hospital setting.', image: technologyImage, image_alt: 'Plastic surgery team inside a modern operating theatre' },
      { number: '06', title: 'Recovery & Follow-Up', description: 'Post-operative care and long-term follow-up schedule to ensure optimal healing results.', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85', image_alt: 'Patient receiving calm post-operative follow-up care' },
    ],
  },
  international_patients: {
    eyebrow: 'INTERNATIONAL PATIENTS',
    title: 'Consult Dr. Maris Before Travelling to Vietnam',
    description: 'Patients from Australia, New Zealand, the United States, Europe and other international markets can begin discussing their case before travelling to Ho Chi Minh City.',
    review_items: ['Medical history and previous procedures', 'Clear photographs of the area of concern', 'Surgical goals and recovery expectations'],
    note: 'Remote consultation supports preliminary planning but does not replace the in-person examination required before a final surgical decision.',
  },
  patient_results: {
    eyebrow: 'PATIENT RESULTS',
    editorial_lead: 'Results are individual. Planning is personal.',
    source: 'resultsMockData',
    note: 'Individual results vary. Patient images are presented for educational context and do not guarantee a specific outcome.',
  },
  frequently_asked_questions: {
    eyebrow: 'SURGICAL PLANNING',
    title: 'Frequently asked questions about plastic surgery in Vietnam.',
    items: [
      { question: 'Is DR. MARIS AESTHETICS a spa or cosmetic surgery provider?', answer: 'We are a specialized cosmetic surgery provider. All surgical procedures are performed in a fully accredited international hospital with comprehensive medical infrastructure.' },
      { question: 'Who performs my cosmetic surgery?', answer: 'Every surgery is personally performed by Dr. Maris. Your care is managed directly by the lead surgeon from planning through follow-up.' },
      { question: 'Can I speak with Dr. Maris before travelling to Vietnam?', answer: 'Yes. We require an online video consultation to review your medical history, photographs, and surgical goals before travel arrangements are finalized.' },
      { question: 'Does Dr. Maris perform revision plastic surgery?', answer: 'Dr. Maris specializes in complex revision cases, including corrective rhinoplasty, breast implant revision, and scar management.' },
      { question: 'Can failed cosmetic surgery always be corrected?', answer: 'Many issues can be improved, but correction depends on the healthy tissue remaining and the nature of the previous surgery.' },
      { question: 'How long should I stay in Vietnam after plastic surgery?', answer: 'Stay duration varies by procedure, typically ranging from 7 to 14 days to allow initial follow-up examinations before flying.' },
      { question: 'How much does plastic surgery cost in Vietnam?', answer: 'Quotes are provided after clinical assessment. We prioritize safety and hospital-based care over budget pricing.' },
      { question: 'What should I send if I need revision surgery?', answer: 'Please provide previous operative reports, the date of your last surgery, high-resolution photos, and a description of your concerns.' },
    ],
  },
  consultation: {
    eyebrow: 'BEGIN YOUR JOURNEY',
    title: 'Your case deserves a surgical plan built around you.',
    editorial_lead: 'Your case begins with understanding your actual condition.',
    description: 'Send your case for a preliminary clinical review and begin a direct conversation with Dr. Maris.',
  },
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

module.exports = { homepageContent }

async function main() {
  const current = await request('/api/homepage?status=draft')
  const existing = current.data || {}
  const payload = { data: { ...homepageContent, ...(existing.metadata_image ? { metadata_image: existing.metadata_image.id || existing.metadata_image } : {}) } }
  console.log(JSON.stringify({ mode: WRITE ? 'write' : 'dry-run', endpoint: `${BASE}/api/homepage`, fields: Object.keys(homepageContent), existingDocumentId: existing.documentId || null }, null, 2))
  if (!WRITE) return
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required when using --write')
  await request('/api/homepage?status=draft', { method: 'PUT', body: JSON.stringify(payload) })
  if (PUBLISH) await request('/api/homepage', { method: 'PUT', body: JSON.stringify({ data: { publishedAt: new Date().toISOString() }, status: 'published' }) })
  const verified = await request('/api/homepage?status=published')
  const missing = Object.keys(homepageContent).filter((key) => verified.data?.[key] === undefined)
  if (missing.length) throw new Error(`Migration verification failed; missing fields: ${missing.join(', ')}`)
  console.log(`Homepage content migration completed${PUBLISH ? ' and published' : ''}.`)
}

if (require.main === module) {
  main().catch((error) => { console.error(`[homepage-migration] ${error.message}`); process.exitCode = 1 })
}
