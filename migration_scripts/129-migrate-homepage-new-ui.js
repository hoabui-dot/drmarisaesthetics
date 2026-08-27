/** Force the homepage onto the canonical Figma content/action contract.
 * Default is dry-run. Use --write to PUT the payload.
 */
const { mkdir, writeFile, readFile } = require('node:fs/promises')
const path = require('node:path')

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')
const PUBLISH = process.argv.includes('--publish')
const TARGET_PATH = path.resolve(__dirname, '../docs/design-spec/contracts/homepage.target.json')
const VIDEO_SOURCE = 'https://assets.mixkit.co/videos/preview/mixkit-dentist-examining-a-patient-4235-large.mp4'
const HERO_AVATAR_IDS = (process.env.HERO_AVATAR_IDS || '97,98,99,100').split(',').map(Number).filter(Boolean)

if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')

async function request(path, method = 'GET', body) {
  const response = await fetch(`${STRAPI_URL}${path}`, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` }, body: body ? JSON.stringify(body) : undefined })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${JSON.stringify(payload)}`)
  return payload
}

function first(blocks, type) { return blocks.find((block) => block.__component === `homepage.${type}`) }

function prepare(value, key = '') {
  if (Array.isArray(value)) {
    if (key === 'user_avatars') return value.length ? { connect: value.map((item) => item.id).filter(Boolean) } : []
    if (key === 'posts') return value.length ? { connect: value.map((item) => item.id).filter(Boolean) } : []
    return value.map((item) => prepare(item, key))
  }
  if (!value || typeof value !== 'object') return value
  if (value.url && value.mime && value.id) return { connect: [value.id] }
  return Object.fromEntries(Object.entries(value).filter(([name]) => !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'related', 'localizations'].includes(name)).map(([name, item]) => [name, prepare(item, name)]))
}

function stripExpandedPayload(value) {
  if (Array.isArray(value)) return value.map(stripExpandedPayload).filter(Boolean)
  if (!value || typeof value !== 'object') return value
  if (value.url && value.mime) return value.id ? { connect: [value.id] } : undefined
  return Object.fromEntries(Object.entries(value).filter(([name]) => !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'related', 'localizations'].includes(name)).map(([name, item]) => [name, stripExpandedPayload(item)]).filter(([, item]) => item !== undefined))
}

function applyHero(existing) {
  const { image: legacyImage, user_avatars: legacyAvatars, ...existingHero } = existing || {}
  const hero = { ...existingHero, __component: 'homepage.hero' }
  const nextHero = {
    ...hero,
    eyebrow: 'PREMIUM DENTAL CARE & SERVICES',
    heading: 'Your Smile, Our Passion',
    heading_line_1: 'Your Smile,',
    heading_line_2: 'Our Passion',
    subheading: 'At Smilux Dental, we combine advanced technology, experienced professionals, and a patient-first approach to deliver safe, lasting, and beautiful smiles for you and your loved ones.',
    cta_label: 'BOOK APPOINTMENT',
    cta_link: '/booking',
    secondary_cta_label: 'WATCH VIDEO',
    secondary_cta_action: 'video-dialog',
    secondary_cta_video_url: existing?.secondary_cta_video_url || VIDEO_SOURCE,
    trust_label: 'Trusted by 10,000+ Patients',
    trust_value: '4.9/5',
    trust_rating: 4.9,
    background_image: existing?.background_image || legacyImage,
    patient_avatars: existing?.patient_avatars?.length
      ? existing.patient_avatars
      : legacyAvatars?.length
        ? legacyAvatars
        : { connect: HERO_AVATAR_IDS },
  }
  if (process.env.HERO_IMAGE_ID) nextHero.background_image = { connect: [Number(process.env.HERO_IMAGE_ID)] }
  return nextHero
}

function applyAboutTrust(existing) {
  return {
    ...(existing || {}),
    __component: 'homepage.proof-showcase',
    eyebrow: 'ABOUT SMILUX DENTAL',
    title: 'Trusted Care. Lasting Smiles.',
    heading_line_1: 'Trusted Care.',
    heading_line_2: 'Lasting Smiles.',
    description: 'At Smilux Dental, we are committed to providing world-class dental care in a comfortable and friendly environment. Every smile we create is built on trust, innovation, and personalized attention.',
    benefits: [
      { label: 'Experienced & Certified Dental Experts' },
      { label: 'State-of-the-Art Technology & Equipment' },
      { label: 'Painless & Patient-Friendly Procedures' },
      { label: 'Personalized Treatment Plans' },
    ],
    cta_label: 'LEARN MORE ABOUT US',
    cta_link: '/about-us',
    primary_team_image: { connect: [21] },
    experience_value: '15+',
    experience_label: 'Years of Experience',
    technology_image: { connect: [20] },
    patient_story_image: { connect: [24] },
    patient_stat_image: { connect: [23] },
    patient_stat_value: '10,000+',
    patient_stat_label: 'Happy Patients',
  }
}

function applyServices(existing) {
  return {
    ...(existing || {}),
    __component: 'homepage.services',
    eyebrow: 'OUR DENTAL SERVICES',
    title: 'Comprehensive Care For Your Perfect Smile',
    subtitle: undefined,
    description: undefined,
    view_more_label: 'VIEW ALL SERVICES',
    view_more_link: '/services',
    items: [
      { title: 'Dental Implants', description: 'Restore missing teeth with strong and natural-looking dental implants.', link: '/services/dental-implants', image: 286 },
      { title: 'Teeth Whitening', description: 'Brighten your smile with safe and effective whitening solutions.', link: '/services/dental-bleaching', image: 287 },
      { title: 'Orthodontics', description: 'Straighten your teeth braces or clear aligners for a perfect.', link: '/services/dental-braces', image: 288 },
      { title: 'Teeth Fillings', description: 'Safe and durable to restore and protect your natural teeth.', link: '/services/general-and-preventive-dentistry', image: 289 },
      { title: 'Root Canal Therapy', description: 'Relieve pain and save your natural teeth with precise root canal treatment.', link: '/services/general-and-preventive-dentistry', image: 290 },
    ],
  }
}

function applyTechnology(existing) {
  return {
    ...(existing || {}),
    __component: 'homepage.technology-feature',
    eyebrow: 'SMILUX ADVANCED TECHNOLOGY',
    title: 'Technology That Powers Precision Smiles',
    heading_line_1: 'Technology That',
    heading_line_2: 'Powers Precision',
    heading_accent: 'Smiles',
    description: 'At Smilux, advanced dental technology helps us deliver safer, more accurate, and more comfortable treatment experiences. From diagnosis to implant placement, every step is guided by precision, efficiency, and patient-centered care.',
    background_image: 283,
    image: 20,
    cta_label: 'Explore Our Technology',
    cta_link: '/services',
    features: [
      { title: '3D Imaging', description: 'Clear diagnostic imaging.' },
      { title: 'Guided Implant', description: 'Precise implant planning.' },
      { title: 'Digital Scan', description: 'Comfortable digital impressions.' },
      { title: 'Laser Support', description: 'Gentle precision treatment.' },
      { title: 'Comfort Care', description: 'Calm patient-first procedures.' },
      { title: 'Smart Appointment', description: 'Efficient care planning.' },
    ],
    technologies: [
      { index: 1, title: 'OTI® Guided Implant Technology', description: 'A screw-guided implant technique designed for precise placement, minimal tissue trauma, faster recovery, and stable long-term results.', image: 284 },
      { index: 2, title: 'Digital Smile Design', description: 'Plan a personalized smile with digital previews and precise clinical measurements before treatment begins.', image: 285 },
      { index: 3, title: '3D Diagnostic Imaging', description: 'Advanced imaging gives our clinical team a complete view for safer diagnosis and confident treatment planning.', image: 273 },
      { index: 4, title: 'Precision Laser Support', description: 'Modern laser-assisted care supports precise procedures and a more comfortable recovery experience.', image: 283 },
      { index: 5, title: 'Comfort-First Digital Care', description: 'Connected digital workflows help every appointment feel clearer, calmer, and more efficient for patients.', image: 284 },
    ],
  }
}

function applyEquipment(existing) {
  return {
    ...(existing || {}),
    __component: 'homepage.equipment-showcase',
    eyebrow: 'SMILUX DENTAL DEVICES',
    title: 'Advanced Technology for Better Care',
    subtitle: 'Modern dental devices support precise diagnosis, comfortable treatment, and confident smiles.',
    items: [
      { title: '3D Cone Beam CT', description: 'Accurate 3D imaging for precise diagnosis', image: 286, image_alt: '3D dental imaging device' },
      { title: 'Intraoral Scanner', description: 'Digital impressions for better comfort', image: 287, image_alt: 'Digital intraoral scanner' },
      { title: 'CAD/CAM Technology', description: 'Precision smile design and restorations', image: 288, image_alt: 'CAD/CAM dental technology' },
      { title: 'Laser Dental Care', description: 'Treatments with advanced laser technology', image: 289, image_alt: 'Laser dental care device' },
    ],
  }
}

function applyDoctors(existing) {
  return {
    ...(existing || {}),
    __component: 'homepage.doctor',
    eyebrow: 'OUR DENTIST TEAM',
    title: 'Meet Our Expert Dentists',
    subtitle: undefined,
    view_all_label: 'VIEW ALL DOCTORS',
    view_all_link: '/doctors',
    doctors: [
      { name: 'DR. ETHAN SANTOS', specialization: 'Implantology & Surgery', bio: 'Specialized in advanced dental implants and surgical procedures with a focus on precision and longevity.', image: 274, image_alt: 'Dr. Ethan Santos', profile_link: '/doctors/ethan-santos', badges: [{ label: '10+ years of experience in implantology and oral surgery' }, { label: 'International Implant Association Member' }, { label: 'Certified in Advanced Bone Augmentation' }] },
      { name: 'DR. MICHELLE JIN', specialization: 'Cosmetic Dentistry', bio: 'Expert in smile design, veneers, and aesthetic makeovers.', image: 275, image_alt: 'Dr. Michelle Jin', profile_link: '/doctors/michelle-jin', badges: [{ label: 'Member of the American Dental Association' }, { label: 'Certified in Advanced Aesthetic Restorations' }] },
      { name: 'DR. NICHOLAS TAN', specialization: 'Orthodontics', bio: 'Expert in braces and clear aligners for all ages, creating healthy, confident smiles.', image: 276, image_alt: 'Dr. Nicholas Tan', profile_link: '/doctors/nicholas-tan', badges: [{ label: 'Member of the World Federation of Orthodontists' }, { label: 'Invisalign Certified Provider' }] },
      { name: 'DR. SOPHIA LIM', specialization: 'Pediatric Dentistry', bio: 'Making dental visits fun and stress-free for your little ones.', image: 277, image_alt: 'Dr. Sophia Lim', profile_link: '/doctors/sophia-lim', badges: [{ label: 'Certified in Pediatric Dentistry' }] },
    ],
  }
}

function applyResults(existing) {
  return {
    ...(existing || {}),
    __component: 'homepage.results-section',
    eyebrow: 'SMILE TRANSFORMATIONS',
    heading: 'Real Stories. Real Smiles.',
    intro: "Nothing speaks louder than the smiles of those we've experienced with, Here are some inspiring smile makeovers and real stories.",
    stories: [
      {
        title: 'Christina’s Smile. Transformed',
        description: "Christine wanted a brighter, balanced, natural smile aesthetic smile. We crafted a treatment plan tailored to her goals -- enhancing her teeth' white and giving her a confident smile.",
        treatments: ['Smile design planning with digital preview', 'Professional teeth whitening', 'Placement of composite veneers'],
        before_image: 202,
        after_image: 203,
        patient_portrait: 274,
        portrait_alt: 'Christina smiling after her smile transformation',
        quote: 'Christine’s smile, before and after – confident, complete, and truly hers.',
      },
      {
        title: 'Sarah’s Smile. Transformed',
        description: 'A carefully planned transformation created a brighter, balanced smile while preserving a natural look and comfortable bite.',
        treatments: ['Digital smile design planning', 'Professional teeth whitening', 'Personalized restorative treatment'],
        before_image: 204,
        after_image: 205,
        patient_portrait: 275,
        portrait_alt: 'Sarah smiling after her smile transformation',
        quote: 'A brighter smile, a calmer experience, and confidence that feels completely natural.',
      },
      {
        title: 'Mia’s Smile. Transformed',
        description: 'Mia’s treatment combined precise planning and aesthetic care to create a confident smile designed around her features.',
        treatments: ['Smile design planning with digital preview', 'Aesthetic restorative treatment', 'Final bite and shade refinement'],
        before_image: 206,
        after_image: 207,
        patient_portrait: 276,
        portrait_alt: 'Mia smiling after her smile transformation',
        quote: 'A thoughtful transformation that feels confident, complete, and truly hers.',
      },
      {
        title: 'Olivia’s Smile. Transformed',
        description: 'A patient-first plan brought together functional improvement and a natural-looking aesthetic result for a lasting smile.',
        treatments: ['Digital treatment planning', 'Conservative smile enhancement', 'Personalized finishing and review'],
        before_image: 208,
        after_image: 209,
        patient_portrait: 277,
        portrait_alt: 'Olivia smiling after her smile transformation',
        quote: 'A complete smile transformation with a result that feels personal and effortless.',
      },
    ],
  }
}

function applyTestimonials(existing) {
  return {
    ...(existing || {}),
    __component: 'homepage.testimonials-section',
    eyebrow: 'PATIENTS LOVE SMILUX',
    heading: 'What Our Patients Say',
    section_image: 282,
    section_image_alt: 'Smiling Smilux Dental patient',
    testimonials: [
      { rating: 5, quote: "The doctors and staff are very professional and caring. I'm so happy with my new smile!", patient_name: 'Jennifer L.', patient_location: 'Vietnam', patient_avatar: 274, patient_avatar_alt: 'Jennifer L.' },
      { rating: 5, quote: 'The clinic is modern, clean and very comfortable. Highly recommended!', patient_name: 'David M.', patient_location: 'Australia', patient_avatar: 275, patient_avatar_alt: 'David M.' },
      { rating: 5, quote: 'I had my implant done here and the result is beyond my expectations.', patient_name: 'Sophie K.', patient_location: 'Korea', patient_avatar: 276, patient_avatar_alt: 'Sophie K.' },
      { rating: 5, quote: 'The team listened carefully to my goals and made every appointment feel comfortable.', patient_name: 'Maria T.', patient_location: 'Singapore', patient_avatar: 277, patient_avatar_alt: 'Maria T.' },
      { rating: 5, quote: 'From consultation to final result, the care was clear, precise and reassuring.', patient_name: 'Alex R.', patient_location: 'United Kingdom', patient_avatar: 274, patient_avatar_alt: 'Alex R.' },
      { rating: 5, quote: 'My smile feels natural and confident. I would absolutely recommend Smilux Dental.', patient_name: 'Emma P.', patient_location: 'Canada', patient_avatar: 275, patient_avatar_alt: 'Emma P.' },
      { rating: 5, quote: 'The technology and attention to detail gave me complete confidence in my treatment.', patient_name: 'Daniel K.', patient_location: 'South Korea', patient_avatar: 276, patient_avatar_alt: 'Daniel K.' },
      { rating: 5, quote: 'Everyone was kind, professional and focused on making the experience easy for me.', patient_name: 'Linh N.', patient_location: 'Vietnam', patient_avatar: 277, patient_avatar_alt: 'Linh N.' },
      { rating: 5, quote: 'I am delighted with the result and grateful for the thoughtful patient-first care.', patient_name: 'Olivia S.', patient_location: 'Australia', patient_avatar: 274, patient_avatar_alt: 'Olivia S.' },
    ],
  }
}

function applyPress(existing) {
  return {
    ...(existing || {}),
    __component: 'homepage.press-section',
    eyebrow: 'AS FEATURED IN',
    heading: 'Smilux Dental In The Press',
    logos: [244, 245, 246, 247, 248, 249],
  }
}

function applyConsultation(existing) {
  return {
    __component: 'homepage.consultation',
    ...(existing?.id ? { id: existing.id } : {}),
    title: 'Book a Consultation',
    form_heading: 'Book a Consultation',
    clinic_eyebrow: 'SMILUX DENTAL CLINIC',
    contact_heading: 'Consult With Our Experts',
    description: 'Our team of experienced dentists uses advanced technology and a personalized approach to deliver safe, effective, and beautiful results for every patient.',
    address: '233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam',
    phone: '0866 251 379',
    opening_hours: 'Mon - Sat: 8:00 AM - 7:00 PM',
    international_patients: 'We provide consultation support in English and flexible scheduling for overseas patients.',
    submit_label: 'REQUEST CONSULTATION',
    help_text: existing?.help_text,
  }
}

function applyCertification(existing) {
  return {
    ...(existing || {}),
    __component: 'homepage.certification',
    eyebrow: 'CERTIFICATES & ACCREDITATIONS',
    heading: 'Certified. Recognized. Trusted.',
    bundles: [
      { organization_logo: 278, organization_name: 'ADA', summary: 'American Dental Association', certificate_image: 251, certificate_alt: 'ADA American Dental Association Member certificate' },
      { organization_logo: 279, organization_name: 'ISO', summary: 'ISO 9001 Certification for Standardization', certificate_image: 252, certificate_alt: 'ISO 9001:2015 Quality Management Certified certificate' },
      { organization_logo: 280, organization_name: 'ICOI', summary: 'International Congress of Oral Implantologists', certificate_image: 253, certificate_alt: 'ICOI International Congress of Oral Implantologists Fellow certificate' },
      { organization_logo: 281, organization_name: 'AAO', summary: 'American Association of Orthodontists', certificate_image: 254, certificate_alt: 'AAO American Association of Orthodontists Member certificate' },
    ],
  }
}

async function main() {
  const target = JSON.parse(await readFile(TARGET_PATH, 'utf8'))
  const current = await request('/api/homepage?status=draft&populate[layout][populate]=*')
  const currentBlocks = current.data?.layout || []
  const existingHero = first(currentBlocks, 'hero') || first(currentBlocks, 'video-hero')
  const layout = currentBlocks.map((block) => ({ id: block.id, ...stripExpandedPayload(block) }))
  const hero = applyHero(existingHero)
  const byType = (type) => layout.find((block) => block.__component === `homepage.${type}`)
  const articles = byType('blog-collection-section') ? { __component: 'homepage.blog-collection-section', title: 'Featured Articles', subtitle: byType('blog-collection-section').subtitle, showFeatured: true, isActive: true } : undefined
  const ordered = [
    hero,
    applyAboutTrust(byType('proof-showcase')), applyServices(byType('services')), applyTechnology(byType('technology-feature')), applyEquipment(byType('equipment-showcase')),
    applyDoctors(byType('doctor')), applyCertification(byType('certification')), applyResults(byType('results-section')), applyTestimonials(byType('testimonials-section')), applyPress(byType('press-section')),
    articles, applyConsultation(byType('consultation')),
  ].filter(Boolean)
  const payload = { data: { title: current.data?.title || 'SmileLux Dental', layout: ordered } }
  const diff = {
    eyebrow: [existingHero?.eyebrow, target.hero.eyebrow], heading: [existingHero?.heading, target.hero.heading],
    subheading: [existingHero?.subheading, target.hero.subheading], cta_label: [existingHero?.cta_label, target.hero.primaryAction.label],
    secondary_cta_label: [existingHero?.secondary_cta_label, target.hero.secondaryAction.label], trust_label: [existingHero?.trust_label, target.hero.trust.label],
    trust_value: [existingHero?.trust_value, target.hero.trust.ratingLabel], trust_rating: [existingHero?.trust_rating, target.hero.trust.rating],
  }
  console.log(JSON.stringify({ mode: WRITE ? 'write' : 'dry-run', diff, order: ordered.map((block) => [block.__component, block.id || null]) }, null, 2))
  if (!WRITE) return
  const reportDir = path.resolve(__dirname, '../ai-report')
  await mkdir(reportDir, { recursive: true })
  await writeFile(path.join(reportDir, 'homepage-before-129.json'), JSON.stringify(stripExpandedPayload(current), null, 2))
  await request('/api/homepage?status=draft', 'PUT', payload)
  if (PUBLISH) await request('/api/homepage', 'PUT', { data: { publishedAt: new Date().toISOString() } })
  console.log(`Homepage parity migration written${PUBLISH ? ' and published' : ''}; backup saved to ai-report/homepage-before-129.json`)
}

main().catch((error) => { console.error(error.message); process.exit(1) })
