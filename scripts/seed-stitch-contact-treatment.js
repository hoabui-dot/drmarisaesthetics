#!/usr/bin/env node

/**
 * Idempotent content seed for the Contact and Rhinoplasty Stitch pages.
 * Uses Strapi's REST API so Draft & Publish/documentId data remains intact.
 */
const BASE = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_API_TOKEN;

function stripComponentIds(value, key = '') {
  if (Array.isArray(value)) return value.map((item) => stripComponentIds(item));
  if (!value || typeof value !== 'object') return value;
  if (value.id && (value.url || value.mime || value.hash)) return value.id;
  return Object.fromEntries(Object.entries(value)
    .filter(([name]) => !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt'].includes(name))
    .map(([name, item]) => [name, stripComponentIds(item, name)]));
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function seedContact() {
  const current = await request('/api/contact-page?populate[layout][populate]=*');
  const page = current.data;
  if (!page) throw new Error('Contact page is missing in Strapi');
  const layout = Array.isArray(page.layout) ? page.layout : [];
  const withoutSeeded = layout.filter((block) => !['contact.expectation', 'contact.faq'].includes(block.__component));
  const hero = withoutSeeded.find((block) => block.__component === 'contact.hero');
  if (hero) {
    hero.title = 'Start With a Conversation About Your Case';
    hero.subtitle = 'PRIVATE CONSULTATION · HO CHI MINH CITY';
    hero.description = 'Considering cosmetic surgery abroad often begins with questions, not decisions. Contact DR. MARIS AESTHETICS to discuss your concerns, previous procedures and surgical goals before planning your next step.\n\nInternational patients can begin with an online consultation before travelling to Ho Chi Minh City.';
  }
  const map = withoutSeeded.find((block) => block.__component === 'contact.map-section');
  if (map) {
    map.address = map.address || '233 Nguyễn Trọng Tuyển, Ho Chi Minh City, Vietnam';
    map.clinic_name = map.clinic_name || 'Maris Aesthetics';
    map.map_address = map.map_address || map.address;
    map.map_latitude = Number.isFinite(Number(map.map_latitude)) ? Number(map.map_latitude) : 10.775413839246676;
    map.map_longitude = Number.isFinite(Number(map.map_longitude)) ? Number(map.map_longitude) : 106.67969229159051;
    map.map_zoom = Number.isFinite(Number(map.map_zoom)) ? Number(map.map_zoom) : 16;
    map.directions_label = map.directions_label || 'OPEN IN GOOGLE MAPS';
    map.directions_url = map.directions_url || 'https://www.google.com/maps';
  }
  if (!withoutSeeded.some((block) => block.__component === 'contact.consultation-section')) {
    withoutSeeded.splice(1, 0, {
      __component: 'contact.consultation-section', form_title: 'Request a Consultation',
      form_intro: 'Please fill out the form below and our patient coordinator will contact you within 24 hours to schedule your private consultation.',
      location_options: [{ label: 'Ho Chi Minh City Clinic', value: 'ho-chi-minh-city' }],
      privacy_policy_label: 'Privacy Policy', privacy_policy_href: '/privacy-policy', submit_label: 'Send Request',
      info_title: 'Contact Information', info_description: 'Our patient coordinator is available to answer questions about your case and next steps.',
      advisor_title: 'Patient Coordinator', advisor_description: 'We will help you prepare for a clear, comfortable consultation.',
      contacts: [
        { type: 'hotline', label: 'Phone', value: '+84 396 877 518', href: 'tel:+84396877518' },
        { type: 'email', label: 'Email', value: 'sgnhakhoaquocte@gmail.com', href: 'mailto:sgnhakhoaquocte@gmail.com' },
        { type: 'hotline', label: 'Location', value: '233 Nguyễn Trọng Tuyển, Ho Chi Minh City', href: 'https://www.google.com/maps' },
      ],
      trust_title: 'Private & confidential', trust_description: 'Your information is handled with care by our clinical team.',
    });
  }
  withoutSeeded.push({
    __component: 'contact.expectation', title: 'What to Expect', items: [
      { step: '01', title: 'Send Your Request', description: 'Fill out our detailed form to help us understand your unique aesthetic goals and concerns.' },
      { step: '02', title: 'Speak With Our Team', description: 'Our patient coordinator will contact you to review your request and arrange an appointment.' },
      { step: '03', title: 'Meet Your Doctor', description: 'Enjoy a comprehensive, private consultation with our medical specialists to design your roadmap.' },
    ],
  });
  withoutSeeded.push({
    __component: 'contact.faq', title: 'Frequently Asked Questions', questions: [
      { question: 'Is there a fee for the initial consultation?', answer: "Yes, we charge a nominal fee for the specialist's time, which is fully credited toward any treatment you choose to proceed with." },
      { question: 'How soon can I get an appointment?', answer: 'Typically, we can accommodate new patient consultations within 3–5 business days depending on physician availability.' },
      { question: 'Do you offer virtual consultations?', answer: 'For international patients or initial assessments, we offer secure video consultations via our patient portal.' },
      { question: 'How should I prepare for my consultation?', answer: 'Please bring a list of your current medications and any medical history relevant to your visit.' },
    ],
  });
  await request('/api/contact-page', { method: 'PUT', body: JSON.stringify({ data: { layout: stripComponentIds(withoutSeeded) } }) });
  await request('/api/contact-page', { method: 'PUT', body: JSON.stringify({ data: {}, status: 'published' }) });
  console.log(`[contact] seeded ${withoutSeeded.length} layout blocks`);
}

async function seedTreatment() {
  const result = await request('/api/service-details?filters[slug][$eq]=rhinoplasty&populate[sections][populate]=*');
  const page = result.data?.[0];
  if (!page) {
    const media = await request('/api/upload/files?pagination[pageSize]=100');
    const image = (media || []).find((file) => /patient_consultation|clinic_interior/i.test(file.name || ''));
    if (!image) throw new Error('No existing consultation/clinic image is available for treatment seed');
    const sections = [
      {
        __component: 'service-detail.overview', anchor_label: 'Overview', title: 'What is Rhinoplasty?',
        description: 'Rhinoplasty, commonly referred to as a nose job, is a highly refined surgical procedure designed to alter the shape, size, or proportions of the nose. At Maris Aesthetics, we approach rhinoplasty as a meticulous restructuring that honors your foundational facial architecture.',
        image: image.id, features: [
          { icon: 'ShieldCheck', title: 'Natural harmony', description: 'A result designed around your facial architecture.' },
          { icon: 'HeartPulse', title: 'Aesthetic and function', description: 'Cosmetic refinement with careful attention to breathing.' },
        ],
      },
      {
        __component: 'service-detail.candidates', anchor_label: 'Who Is This Procedure For?', title: 'Designed Around Your Concerns',
        items: [
          { text: 'Dorsal hump or an uneven bridge' }, { text: 'Bulbous or disproportionate nasal tip' },
          { text: 'Asymmetry or a deviated septum' }, { text: 'Breathing concerns requiring functional review' },
        ], image: image.id,
      },
      {
        __component: 'service-detail.faq', anchor_label: 'Frequently Asked Questions', title: 'Frequently Asked Questions', items: [
          { question: 'What is the recovery time?', answer: 'Most patients return to light activity within 7–10 days. Your surgeon will provide an individual aftercare plan.' },
          { question: 'Will my result look natural?', answer: 'Treatment planning is tailored to your facial proportions and aims for balanced, natural-looking results.' },
        ],
      },
      {
        __component: 'service-detail.consultation', anchor_label: 'Consultation', step_number: '01', title: 'Request a Private Consultation', subtitle: 'Begin with a conversation about your goals.',
        address: 'Ho Chi Minh City, Vietnam', hotline: '+84 396 877 518', email: 'sgnhakhoaquocte@gmail.com', working_hours: 'Monday – Sunday · 08:00 – 19:00', map_embed_url: 'https://www.google.com/maps?q=10.775413839246676,106.67969229159051&z=16&output=embed',
      },
    ];
    const created = await request('/api/service-details', { method: 'POST', body: JSON.stringify({ data: {
      slug: 'rhinoplasty', title: 'Rhinoplasty Surgery in Vietnam', breadcrumb_label: 'Rhinoplasty',
      description: 'At Maris Aesthetics, we redefine nasal harmony through a meticulous structural approach that honors your unique facial architecture.', hero_image: image.id,
      primary_cta_label: 'Request a Consultation', primary_cta_link: '/contact', secondary_cta_label: 'View the Guide', secondary_cta_link: '#service-detail-overview', trust_label: 'Reviewed by Dr. Maris · Ho Chi Minh City, Vietnam', trust_rating: '5.0/5', sections,
    }, status: 'published' }) });
    console.log(`[treatment] created ${created.data?.documentId || created.data?.id} with media ${image.id}`);
    return;
  }
  const sections = (page.sections || []).map((section) => {
    if (section.__component === 'service-detail.overview') return { ...section, title: 'What is Rhinoplasty?', description: 'Rhinoplasty, commonly referred to as a nose job, is a highly refined surgical procedure designed to alter the shape, size, or proportions of the nose. At Maris Aesthetics, we approach rhinoplasty as a meticulous restructuring that honors your foundational facial architecture.' };
    if (section.__component === 'service-detail.candidates') return { ...section, title: 'Designed Around Your Concerns' };
    return section;
  });
  const endpoint = `/api/service-details/${page.documentId || page.id}`;
  await request(endpoint, { method: 'PUT', body: JSON.stringify({ data: { title: 'Rhinoplasty Surgery in Vietnam', description: 'At Maris Aesthetics, we redefine nasal harmony through a meticulous structural approach that honors your unique facial architecture.', sections: stripComponentIds(sections) } }) });
  await request(endpoint, { method: 'PUT', body: JSON.stringify({ data: {}, status: 'published' }) });
  console.log(`[treatment] updated ${page.documentId || page.id}`);
}

async function main() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  await seedContact();
  await seedTreatment();
}

main().catch((error) => { console.error(`[stitch-seed] ${error.message}`); process.exitCode = 1; });
