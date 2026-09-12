#!/usr/bin/env node

/** Replace the legacy contact layout with the structured Dr. Maris sections. */
const BASE = (process.env.STRAPI_URL || 'http://127.0.0.1:22345').replace(/\/$/, '')
const TOKEN = process.env.STRAPI_API_TOKEN
const WRITE = process.argv.includes('--write')

const layout = [
  {
    __component: 'contact.hero',
    title: 'Start With a Conversation About Your Case',
    subtitle: 'PRIVATE CONSULTATION · HO CHI MINH CITY',
    description: 'Considering cosmetic surgery abroad often begins with questions, not decisions. Contact DR. MARIS AESTHETICS to discuss your concerns, previous procedures and surgical goals before planning your next step.\n\nInternational patients can begin with an online consultation before travelling to Ho Chi Minh City.',
    hero_image: 369,
    contact_cards: [
      { label: 'Private consultation', value: 'Direct surgeon-led assessment', supporting_text: 'A clear first step before travel or treatment planning.', icon: 'phone', href: '/contact#form-section' },
      { label: 'Hospital-based care', value: 'City International Hospital', supporting_text: 'Procedures planned around safety, anatomy and recovery.', icon: 'location', href: 'https://maps.google.com/?q=City+International+Hospital+Ho+Chi+Minh+City' },
    ],
  },
  {
    __component: 'contact.consultation-section',
    form_title: 'Request a Consultation',
    form_intro: 'Please fill out the form below and our patient coordinator will contact you within 24 hours to schedule your private consultation.',
    location_options: [{ label: 'Ho Chi Minh City · City International Hospital', value: 'city-international-hospital' }],
    privacy_policy_label: 'Privacy Policy', privacy_policy_href: '/privacy-policy', submit_label: 'Send Request',
    info_title: 'Contact Information', info_description: 'Our international patient coordinator will guide you through the next step.',
    advisor_title: 'International Patient Coordination', advisor_description: 'Private, direct and medically focused communication before you travel.',
    contacts: [
      { type: 'hotline', label: 'Phone', value: '+84 28 1234 5678', href: 'tel:+842812345678' },
      { type: 'email', label: 'Email', value: 'concierge@drmarisaesthetics.com', href: 'mailto:concierge@drmarisaesthetics.com' },
      { type: 'whatsapp', label: 'WhatsApp', value: 'Message our team', href: 'https://wa.me/842812345678' },
    ],
    trust_title: 'Hospital-Based Care', trust_description: 'Every surgical plan is assessed with safety, anatomy and recovery in mind.',
  },
  {
    __component: 'contact.map-section', title: 'Visit City International Hospital', address: 'City International Hospital, Ho Chi Minh City, Vietnam',
    clinic_name: 'City International Hospital', map_address: 'City International Hospital Ho Chi Minh City', map_latitude: 10.8015, map_longitude: 106.6928, map_zoom: 16,
    directions_label: 'Get Directions', directions_url: 'https://maps.google.com/?q=City+International+Hospital+Ho+Chi+Minh+City',
    benefits: [
      { icon: 'location', text: 'Hospital-based surgical facility' },
      { icon: 'landmark', text: 'International patient support' },
      { icon: 'parking', text: 'Convenient city access' },
    ],
  },
  {
    __component: 'contact.expectation', title: 'What to Expect', items: [
      { step: '01', title: 'Send Your Request', description: 'Fill out our detailed form to help us understand your aesthetic goals and concerns.' },
      { step: '02', title: 'Speak With Our Team', description: 'Our patient coordinator will contact you to review your request and arrange an appointment.' },
      { step: '03', title: 'Meet Your Doctor', description: 'Enjoy a comprehensive, private consultation with our medical specialists to design your roadmap.' },
    ],
  },
  {
    __component: 'contact.faq', title: 'Frequently Asked Questions', subtitle: 'Clear information before your consultation.', questions: [
      { question: 'Is there a fee for the initial consultation?', answer: "Yes, we charge a consultation fee for the specialist's time. The coordinator will confirm the current fee before booking." },
      { question: 'How soon can I get an appointment?', answer: 'Our coordinator will offer the earliest suitable appointment based on the doctor’s schedule and your preferred format.' },
      { question: 'Do you offer virtual consultations?', answer: 'Yes. International patients can begin with a secure video consultation before travelling to Vietnam.' },
      { question: 'How should I prepare for my consultation?', answer: 'Please prepare your medical history, current medications, previous operative reports and clear photographs where relevant.' },
    ],
  },
]

async function request(pathname, options = {}) {
  const response = await fetch(`${BASE}${pathname}`, { ...options, headers: { 'Content-Type': 'application/json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}), ...(options.headers || {}) } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${pathname}: ${response.status} ${JSON.stringify(body)}`)
  return body
}

async function main() {
  if (!WRITE) return console.log(JSON.stringify({ layout }, null, 2))
  await request('/api/contact-page', { method: 'PUT', body: JSON.stringify({ data: { title: 'Contact Dr. Maris Aesthetics', description: 'Begin a private consultation with Dr. Maris Aesthetics in Ho Chi Minh City.', layout } }) })
  console.log('[contact-page] structured editorial layout seeded')
}

main().catch((error) => { console.error('[contact-page] failed:', error.message); process.exitCode = 1 })
