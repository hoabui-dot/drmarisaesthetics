#!/usr/bin/env node

/** Seed the shared new service-detail template for every service in Services Overview. */
const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_API_TOKEN;

async function api(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}${path}`, { ...options, headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

function mediaId(media) { return media?.id || media?.data?.id; }

const implant = {
  description: 'Replace missing teeth with strong, natural-looking dental implants that restore your smile, confidence, and quality of life. Precision care using advanced technology for predictable, lasting results.',
  overviewTitle: 'What Are Dental Implants?',
  overviewDescription: 'Dental implants are titanium posts placed in the jawbone to replace missing teeth roots. They provide a stable foundation for crowns, bridges, or full-arch restorations that look, feel, and function like natural teeth.',
  candidatesTitle: 'Who Should Consider Dental Implants?',
};

const SERVICE_PROFILES = {
  'dental-implants': { ...implant, category: 'Implants', variantsTitle: 'Dental Implant Services', price: '$1,450', features: featureData },
  'dental-veneers-cost': { description: 'Restore damaged teeth with custom cosmetic crowns that strengthen function while preserving a natural, balanced smile.', overviewTitle: 'What Are Cosmetic Crowns?', overviewDescription: 'Cosmetic crowns are custom-made restorations that cover and protect a weakened or discolored tooth. Smilux plans each crown for a natural fit, comfortable bite, and harmonious shade.', candidatesTitle: 'Who Should Consider Cosmetic Crowns?', variantsTitle: 'Cosmetic Crown Services', category: 'Cosmetic', price: '$650', features: [{ icon: 'Sparkles', title: 'Natural Aesthetics', description: 'Layered shades and contours are matched to your smile.' }, { icon: 'ShieldCheck', title: 'Stronger Teeth', description: 'Protect weakened teeth and restore everyday function.' }, { icon: 'Heart', title: 'Comfortable Fit', description: 'Digitally planned restorations are designed for a precise bite.' }] },
  'dental-braces': { description: 'Improve alignment, bite function, and confidence with a personalized orthodontic plan using braces or clear aligners.', overviewTitle: 'What Is Orthodontic Treatment?', overviewDescription: 'Orthodontic treatment gradually guides teeth and jaws into a healthier alignment. Your plan may include fixed braces or clear aligners selected around your clinical needs and lifestyle.', candidatesTitle: 'Who Should Consider Orthodontic Treatment?', variantsTitle: 'Orthodontic Services', category: 'Orthodontics', price: '$2,900', features: [{ icon: 'ShieldCheck', title: 'Healthier Alignment', description: 'Improve cleaning access and support a balanced bite.' }, { icon: 'Sparkles', title: 'Clearer Smile', description: 'Create a straighter smile with carefully controlled movement.' }, { icon: 'Users', title: 'Guided Support', description: 'Regular reviews keep your progress on track.' }] },
  'teeth-cleaning': { description: 'Protect your gums and brighten your smile with professional cleaning, preventive screening, and personalized oral-hygiene guidance.', overviewTitle: 'What Happens During Teeth Cleaning?', overviewDescription: 'Professional teeth cleaning removes plaque and tartar that brushing cannot reach. We also check your gums and provide practical guidance to help maintain a healthier mouth between visits.', candidatesTitle: 'Who Should Have Regular Teeth Cleaning?', variantsTitle: 'Preventive Cleaning Services', category: 'General', price: '$65', features: [{ icon: 'Sparkles', title: 'Fresh Smile', description: 'Remove surface stains and buildup for a cleaner smile.' }, { icon: 'ShieldCheck', title: 'Gum Protection', description: 'Reduce plaque-related irritation and support gum health.' }, { icon: 'Heart', title: 'Preventive Care', description: 'Spot concerns early with routine professional reviews.' }] },
  'tooth-extraction': { description: 'Receive safe, carefully planned tooth removal with comfort-focused care and clear aftercare guidance for recovery.', overviewTitle: 'What Is Tooth Extraction?', overviewDescription: 'Tooth extraction removes a tooth that cannot be predictably restored or is affecting your oral health. We assess the tooth, explain options, and plan a comfortable procedure with follow-up support.', candidatesTitle: 'Who May Need Tooth Extraction?', variantsTitle: 'Tooth Extraction Services', category: 'General', price: '$120', features: [{ icon: 'ShieldCheck', title: 'Comfort-Focused', description: 'Local anesthesia and careful technique support a calm visit.' }, { icon: 'Heart', title: 'Clear Aftercare', description: 'Receive practical instructions for a smooth recovery.' }, { icon: 'Users', title: 'Replacement Planning', description: 'Discuss future options when a missing tooth needs replacing.' }] },
  'root-canal-treatment': { description: 'Relieve infection-related tooth pain and preserve your natural tooth with precise, gentle root canal treatment.', overviewTitle: 'What Is Root Canal Treatment?', overviewDescription: 'Root canal treatment removes infected or inflamed tissue from inside a tooth, cleans the canals, and seals them before the tooth is restored for continued function.', candidatesTitle: 'Who Should Consider Root Canal Treatment?', variantsTitle: 'Root Canal Services', category: 'General', price: '$450', features: [{ icon: 'Heart', title: 'Pain Relief', description: 'Address the source of infection-related discomfort.' }, { icon: 'ShieldCheck', title: 'Save Natural Teeth', description: 'Preserve your tooth when restoration remains possible.' }, { icon: 'Crown', title: 'Restored Function', description: 'Complete treatment with a durable protective restoration.' }] },
  'tooth-filling': { description: 'Repair cavities and minor tooth damage with tooth-colored fillings designed to restore strength and a seamless appearance.', overviewTitle: 'What Is a Tooth Filling?', overviewDescription: 'A tooth filling replaces decayed or damaged tooth structure after the affected area is cleaned. We use tooth-colored materials selected to restore shape, strength, and comfort.', candidatesTitle: 'Who Should Consider Tooth Fillings?', variantsTitle: 'Tooth Filling Services', category: 'General', price: '$55', features: [{ icon: 'ShieldCheck', title: 'Stops Decay', description: 'Remove decay before it progresses deeper into the tooth.' }, { icon: 'Sparkles', title: 'Tooth-Colored', description: 'Blend the restoration with your natural tooth shade.' }, { icon: 'Heart', title: 'Conservative Care', description: 'Preserve as much healthy tooth structure as possible.' }] },
  'dental-jewelry': { description: 'Add a subtle, stylish sparkle with professionally placed dental jewelry using a safe, temporary cosmetic approach.', overviewTitle: 'What Is Dental Jewelry?', overviewDescription: 'Dental jewelry is a small cosmetic gem bonded to the surface of a tooth without drilling. Our team checks the tooth first and explains care so your accessory remains comfortable and easy to maintain.', candidatesTitle: 'Who Should Consider Dental Jewelry?', variantsTitle: 'Dental Jewelry Services', category: 'Cosmetic', price: '$120', features: [{ icon: 'Sparkles', title: 'Personal Expression', description: 'Choose a refined detail that complements your smile.' }, { icon: 'ShieldCheck', title: 'Non-Invasive', description: 'Placed without drilling or permanent tooth alteration.' }, { icon: 'Heart', title: 'Carefully Removed', description: 'Remove or change the gem with professional support.' }] },
  'dental-bleaching': { description: 'Brighten stained or discolored teeth with a personalized whitening plan designed for a noticeably fresher smile.', overviewTitle: 'What Is Professional Teeth Whitening?', overviewDescription: 'Professional whitening uses dentist-supervised products to reduce tooth discoloration. We assess sensitivity and shade goals before recommending in-office, take-home, or combined care.', candidatesTitle: 'Who Should Consider Teeth Whitening?', variantsTitle: 'Teeth Whitening Services', category: 'Cosmetic', price: '$250', features: [{ icon: 'Sparkles', title: 'Brighter Smile', description: 'Lift common surface and age-related discoloration.' }, { icon: 'ShieldCheck', title: 'Supervised Care', description: 'Protect your gums and manage sensitivity appropriately.' }, { icon: 'Heart', title: 'Flexible Options', description: 'Choose in-office or take-home whitening around your schedule.' }] },
  'pediatric-dentistry': { description: 'Build healthy habits early with gentle, positive dental care designed around children’s comfort, growth, and confidence.', overviewTitle: 'What Is Pediatric Dentistry?', overviewDescription: 'Pediatric dentistry supports children’s oral health through preventive visits, growth monitoring, education, and age-appropriate treatment in a welcoming environment.', candidatesTitle: 'Who Should Visit a Pediatric Dentist?', variantsTitle: 'Pediatric Dental Services', category: 'General', price: '$45', features: [{ icon: 'Heart', title: 'Gentle Visits', description: 'A calm, age-appropriate approach helps children feel safe.' }, { icon: 'ShieldCheck', title: 'Healthy Development', description: 'Monitor teeth, gums, bite, and oral habits as children grow.' }, { icon: 'Users', title: 'Family Guidance', description: 'Give parents practical advice for everyday home care.' }] },
};

function contentFor(service) {
  if (SERVICE_PROFILES[service.slug]) return SERVICE_PROFILES[service.slug];
  return {
    description: `Discover personalized ${service.title.toLowerCase()} care at Smilux Dental, delivered with advanced technology and a patient-first approach for comfortable, lasting results.`,
    overviewTitle: `What Is ${service.title}?`,
    overviewDescription: `${service.title} is a carefully planned treatment designed around your oral health goals. Our experienced team combines modern diagnostics, clear communication, and precise clinical care throughout your journey.`,
    candidatesTitle: `Who Should Consider ${service.title}?`,
  };
}

function featureData(service) {
  if (SERVICE_PROFILES[service.slug]?.features && Array.isArray(SERVICE_PROFILES[service.slug].features)) {
    return SERVICE_PROFILES[service.slug].features;
  }
  if (service.slug === 'dental-implants') {
    return [
      { icon: 'ShieldCheck', title: 'Strong & Durable', description: 'Made from biocompatible titanium for long-lasting strength.' },
      { icon: 'Sparkles', title: 'Natural Look & Feel', description: 'Designed to match your natural teeth in function and appearance.' },
      { icon: 'Bone', title: 'Preserve Bone Health', description: 'Help maintain jawbone density and prevent bone loss.' },
    ];
  }

  return [
    { icon: 'ShieldCheck', title: 'Safe & Effective', description: 'Evidence-based treatment planned for predictable, long-lasting results.' },
    { icon: 'Sparkles', title: 'Natural Look & Feel', description: 'Designed to complement your smile, comfort, and everyday function.' },
    { icon: 'Heart', title: 'Patient-First Care', description: 'Personalized guidance and support from consultation through aftercare.' },
  ];
}

function candidateItems(service) {
  return [
    { text: `Patients looking for a reliable ${service.title.toLowerCase()} solution` },
    { text: 'Patients seeking comfortable, modern dental care' },
    { text: 'Those who want a treatment plan tailored to their goals' },
    { text: 'Patients ready to improve oral health and confidence' },
    { text: 'Patients suitable for treatment after a clinical evaluation' },
  ];
}

function benefitsData(service) {
  if (service.slug === 'dental-implants') {
    return [
      { icon: 'Heart', title: 'Restore Chewing Function', description: 'Enjoy your favourite foods with confidence.' },
      { icon: 'Sparkles', title: 'Natural Appearance', description: 'Look and feel like your real teeth.' },
      { icon: 'Bone', title: 'Bone Preservation', description: 'Prevent bone loss and maintain facial structure.' },
      { icon: 'Wrench', title: 'Long-Term Stability', description: 'Designed for lasting strength, stability, and everyday confidence.' },
      { icon: 'Users', title: 'Comfort & Confidence', description: 'No slipping, no adhesives—just a confident smile.' },
    ];
  }

  const profileFeatures = SERVICE_PROFILES[service.slug]?.features;
  if (Array.isArray(profileFeatures)) return profileFeatures.map((item) => ({ icon: item.icon, title: item.title, description: item.description }));

  return [
    { icon: 'Heart', title: 'Comfortable Care', description: 'Feel supported before, during, and after your appointment.' },
    { icon: 'Sparkles', title: 'Natural Appearance', description: 'Results that look and feel harmonious with your smile.' },
    { icon: 'ShieldCheck', title: 'Oral Health', description: 'Support a healthier, more confident everyday smile.' },
    { icon: 'Wrench', title: 'Long-Term Stability', description: 'Built around quality materials and careful planning.' },
    { icon: 'Users', title: 'Confidence', description: 'Enjoy clear guidance and confidence in your care plan.' },
  ];
}

function structureData(service) {
  return {
    anchor_label: service.slug === 'dental-implants' ? 'Implant Structure' : 'Treatment Structure',
    title: service.slug === 'dental-implants' ? 'Smilux Implant Structure' : `${service.title} Treatment Structure`,
    callouts: [
      { title: 'Planning', description: 'A precise plan based on your clinical needs and goals.', side: 'left', target_key: 'top' },
      { title: 'Treatment', description: 'Modern techniques support comfortable, controlled care.', side: 'left', target_key: 'middle' },
      { title: 'Foundation', description: 'Each step is designed for stability and long-term health.', side: 'left', target_key: 'bottom' },
      { title: 'Precision', description: 'Digital tools help our team deliver accurate results.', side: 'right', target_key: 'top-right' },
      { title: 'Comfort', description: 'Your comfort and well-being remain central throughout.', side: 'right', target_key: 'middle-right' },
      { title: 'Aftercare', description: 'Clear follow-up guidance helps protect your results.', side: 'right', target_key: 'bottom-right' },
    ],
    supporting_title: 'Why This Matters',
    supporting_items: [
      { text: 'Stable foundation for long-lasting results.' },
      { text: 'Designed for strength, comfort, and aesthetics.' },
      { text: 'Precision-planned for optimal success.' },
      { text: 'Supported by clear aftercare guidance.' },
    ],
  };
}

function technologyData(imageId, service) {
  const isImplant = service.slug === 'dental-implants';
  return {
    __component: 'service-detail.technology',
    anchor_label: 'Advanced Technology',
    title: isImplant ? 'Advanced Implant Technology at Smilux' : `Advanced Technology for ${service.title}`,
    featured_title: isImplant ? 'OTI® Guided Implant Technology' : 'Digital Care at Smilux Dental',
    featured_description: isImplant ? 'Our proprietary guided implant solution ensures precise placement, minimal tissue trauma, faster recovery, and high long-term success.' : `Modern imaging, planning, and treatment tools support precise and comfortable ${service.title.toLowerCase()} care.`,
    featured_cta: 'Learn More →',
    featured_image: imageId,
    technologies: [
      { icon: 'ScanLine', title: 'CT Cone Beam 3D', description: 'High-resolution 3D imaging for accurate diagnosis and treatment planning.' },
      { icon: 'MonitorCog', title: 'Digital Implant Planning', description: 'Computer-guided planning for predictable and precise implant placement.' },
      { icon: 'Crosshair', title: 'Minimally Invasive Placement', description: 'Advanced techniques designed to reduce tissue disruption and support faster healing.' },
      { icon: 'Clock3', title: 'Faster Recovery', description: 'Streamlined treatment techniques designed to support a smoother recovery.' },
      { icon: 'Workflow', title: 'Precision-Guided Workflow', description: 'From digital scanning and planning to precise implant placement at every step.' },
    ],
  };
}

function procedureData(service) {
  const isImplant = service.slug === 'dental-implants';
  return {
    __component: 'service-detail.procedure',
    anchor_label: 'Implant Procedure',
    title: isImplant ? 'Dental Implant Procedure' : `${service.title} Treatment Process`,
    steps: [
      { number: 1, icon: 'ScanLine', title: 'Consultation & Assessment', description: `We evaluate your oral health and goals for ${service.title.toLowerCase()}.` },
      { number: 2, icon: 'ClipboardList', title: 'Treatment Planning', description: 'A personalized plan is created using modern clinical information.' },
      { number: 3, icon: 'HeartPulse', title: 'Preparation', description: 'We prepare the treatment area and explain every step before care begins.' },
      { number: 4, icon: 'Bone', title: 'Treatment Visit', description: `Your planned ${service.title.toLowerCase()} treatment is delivered carefully and comfortably.` },
      { number: 5, icon: 'Clock3', title: 'Review & Recovery', description: 'We monitor progress and provide clear aftercare guidance.' },
      { number: 6, icon: 'Crown', title: 'Long-Term Maintenance', description: 'Follow-up support helps protect your results and oral health.' },
    ],
  };
}

function specialistsData() {
  return {
    __component: 'service-detail.specialists',
    anchor_label: 'Our Specialists',
    title: 'Experienced Implant Specialists',
    doctors: [
      { name: 'Dr. Ethan Santos', specialty: 'Implantologist & Oral Surgeon', credential_one: '15+ Years Experience', credential_two: 'Fellow, ICOI', profile_label: 'View Profile →', profile_link: '/contact', portrait: 334 },
      { name: 'Dr. Michelle Lim', specialty: 'Prosthodontist', credential_one: '12+ Years Experience', credential_two: 'Master in Prosthodontics', profile_label: 'View Profile →', profile_link: '/contact', portrait: 347 },
      { name: 'Dr. Nicholas Tan', specialty: 'Periodontist', credential_one: '14+ Years Experience', credential_two: 'Specialist in Gum Health', profile_label: 'View Profile →', profile_link: '/contact', portrait: 348 },
      { name: 'Dr. Sophia Lee', specialty: 'Oral & Implant Dentist', credential_one: '10+ Years Experience', credential_two: 'Advanced Implantology', profile_label: 'View Profile →', profile_link: '/contact', portrait: 349 },
    ],
  };
}

function patientResultsData(service) {
  return {
    __component: 'service-detail.patient-results',
    anchor_label: 'Patient Results',
    title: 'Real Patient Results',
    patients: [
      { name: 'Maria T.', treatment: `${service.title} Patient`, rating: 5, testimonial: `The team explained my ${service.title.toLowerCase()} treatment clearly and made every visit feel comfortable. I am delighted with the result and the confidence it has given me.`, portrait: 274, before_image: 202, after_image: 203, before_alt: `Maria before ${service.title.toLowerCase()} treatment`, after_alt: `Maria after ${service.title.toLowerCase()} treatment` },
      { name: 'Robert K.', treatment: 'Single Tooth Implant Patient', rating: 5, testimonial: 'The entire process was professional and comfortable. My missing tooth was restored with an implant that looks and feels completely natural. I am extremely happy with the result.', portrait: 275, before_image: 204, after_image: 205, before_alt: 'Robert before single tooth implant treatment', after_alt: 'Robert after single tooth implant treatment' },
      { name: 'Daniel P.', treatment: 'Implant-Supported Bridge Patient', rating: 5, testimonial: 'I wanted a fixed solution instead of continuing with a removable option. The implant-supported bridge feels stable, comfortable, and much closer to having my natural teeth again.', portrait: 276, before_image: 206, after_image: 207, before_alt: 'Daniel before implant-supported bridge treatment', after_alt: 'Daniel after implant-supported bridge treatment' },
      { name: 'Linda S.', treatment: 'Multiple Dental Implants Patient', rating: 5, testimonial: 'From the first consultation through the final restoration, I felt well cared for. The implants have improved my chewing comfort and given me much more confidence in my smile.', portrait: 277, before_image: 208, after_image: 209, before_alt: 'Linda before multiple implant treatment', after_alt: 'Linda after multiple implant treatment' },
    ],
  };
}

function pricingData(service) {
  const isImplant = service.slug === 'dental-implants';
  const profile = SERVICE_PROFILES[service.slug] || {};
  return {
    __component: 'service-detail.pricing',
    anchor_label: 'Pricing',
    title: isImplant ? 'Dental Implant Pricing' : `${service.title} Pricing`,
    plans: isImplant ? [
      { name: 'Single Implant', subtitle: 'Implant + Abutment + Crown', price: '$1,450', qualifier: 'Starting from', features: ['3D Scan & Planning', 'Implant Placement', 'Custom Crown'], cta_label: 'Book Consultation →', cta_link: '/contact' },
      { name: 'Implant + Crown', subtitle: 'Complete Tooth Replacement', price: '$1,850', qualifier: 'Starting from', features: ['Everything in Single Implant', 'Abutment & Crown', '1-Year Restoration Warranty'], cta_label: 'Book Consultation →', cta_link: '/contact', is_popular: true },
      { name: 'Full-Arch Implant', subtitle: 'All-on-4 / All-on-6', price: '$14,900', qualifier: 'Starting from', features: ['Full-Arch Restoration', 'Premium Materials', '5-Year Restoration Warranty'], cta_label: 'Book Consultation →', cta_link: '/contact' },
      { name: 'Consultation', subtitle: 'Comprehensive Evaluation', price: 'FREE', qualifier: '', features: ['3D Scan Assessment', 'Personalized Treatment Plan', 'No Obligation'], cta_label: 'Book Now', cta_link: '/contact' },
    ] : [
      { name: service.title, subtitle: 'Comprehensive evaluation and care', price: profile.price || 'Consultation', qualifier: 'Starting from', features: ['Clinical Assessment', 'Personalized Treatment', 'Aftercare Guidance'], cta_label: 'Book Consultation →', cta_link: '/contact' },
      { name: 'Complete Treatment', subtitle: 'Full treatment plan', price: 'Custom', qualifier: 'Based on assessment', features: ['Digital Planning', 'Expert Treatment', 'Progress Reviews'], cta_label: 'Book Consultation →', cta_link: '/contact', is_popular: true },
      { name: 'Maintenance Care', subtitle: 'Protect your results', price: 'Custom', qualifier: 'Ask our team', features: ['Follow-Up Review', 'Preventive Guidance', 'Long-Term Support'], cta_label: 'Book Consultation →', cta_link: '/contact' },
      { name: 'Consultation', subtitle: 'Comprehensive Evaluation', price: 'FREE', qualifier: '', features: ['Clinical Assessment', 'Personalized Treatment Plan', 'No Obligation'], cta_label: 'Book Now', cta_link: '/contact' },
    ],
    footer_note: 'Flexible financing options available. Ask our team for details.',
  };
}

function faqData(service) {
  return {
    __component: 'service-detail.faq',
    anchor_label: 'FAQ',
    title: `Frequently Asked Questions About ${service.title}`,
    items: [
      { question: 'Do dental implants hurt?', answer: 'Implant placement is performed with local anesthesia, so the treatment area is numb during the procedure. Some soreness, swelling, or tenderness can occur afterward and varies from patient to patient. Your dentist will provide aftercare instructions and appropriate pain-management guidance.' },
      { question: 'Am I too old for dental implants?', answer: 'Age alone does not determine whether someone can receive dental implants. Overall health, gum health, bone condition, medications, and healing ability are usually more important factors. A clinical evaluation is required to determine suitability.' },
      { question: 'How long does the implant process take?', answer: 'The timeline depends on your oral health, number of implants, and whether procedures such as bone grafting are needed. Implant integration with the jawbone commonly takes several months before the final restoration can be completed.' },
      { question: 'What is the recovery time?', answer: 'Initial soft-tissue recovery often takes around a week, while the implant continues integrating with the jawbone for several months. Recovery varies depending on the procedure and individual healing response.' },
      { question: 'How long do dental implants last?', answer: 'With good oral hygiene, regular dental visits, and appropriate maintenance, the implant itself can last for many years and may last a lifetime. The crown, bridge, or other restoration attached to the implant may eventually require replacement.' },
      { question: `How much does ${service.title.toLowerCase()} cost?`, answer: `Cost depends on your clinical needs, treatment approach, materials, and the number of visits required. The pricing above is a starting reference; a consultation is required for an individualized treatment estimate.` },
    ],
  };
}

function consultationData(service) {
  return {
    __component: 'service-detail.consultation',
    anchor_label: 'Consultation',
    step_number: '12',
    title: service.slug === 'dental-implants' ? 'Ready to Restore Your Smile?' : `Ready for Your ${service.title}?`,
    subtitle: `Book a consultation with our specialists to discuss your ${service.title.toLowerCase()} options.`,
    address: '233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam',
    hotline: '1800 8888',
    email: 'info@smiluxdental.vn',
    working_hours: 'Mon – Sun: 8:30 AM – 7:00 PM',
    map_embed_url: 'https://www.google.com/maps/search/?api=1&query=233%20%E2%80%93%20233A%20Nguy%E1%BB%85n%20Tr%E1%BB%8Dng%20Tuy%E1%BB%83n%2C%20Ph%C6%B0%E1%BB%9Dng%20Ph%C3%BA%20Nhu%E1%BA%ADn%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vi%E1%BB%87t%20Nam',
  };
}

async function run() {
  if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required');
  const overview = await api('/api/services-overview?populate[layout][on][services-overview.service-cards][populate][services][populate]=*');
  const cards = overview.data?.layout?.find((block) => block.__component === 'services-overview.service-cards');
  const services = cards?.services || [];
  if (!services.length) throw new Error('No Services Overview cards found');

  const existing = await api('/api/service-details?pagination[pageSize]=100');
  for (const item of existing.data || []) await api(`/api/service-details/${item.documentId}`, { method: 'DELETE' });

  const avatarIds = services.slice(0, 4).map((service) => mediaId(service.image)).filter(Boolean);
  for (const service of services) {
    const content = contentFor(service);
    const imageId = mediaId(service.image);
    const features = featureData(service);
    const structure = structureData(service);
    const data = {
      slug: service.slug,
      title: service.title,
      breadcrumb_label: service.title.toUpperCase(),
      description: content.description,
      hero_image: imageId,
      primary_cta_label: 'Book Consultation',
      primary_cta_link: '/contact',
      secondary_cta_label: 'View Technology',
      secondary_cta_link: '#service-detail-structure',
      trust_label: 'Trusted by 10,000+ Patients',
      trust_rating: '4.9/5',
      trust_avatars: avatarIds,
      sections: [
        { __component: 'service-detail.overview', anchor_label: service.slug === 'dental-implants' ? 'About Implants' : 'About Service', title: content.overviewTitle, description: content.overviewDescription, image: imageId, features },
        { __component: 'service-detail.benefits', anchor_label: 'Services & Benefits', variants_anchor_label: 'Services', variants_title: service.slug === 'dental-implants' ? 'Dental Implant Services' : `${service.title} Services`, variants: [
          { icon: 'Sparkles', title: 'Personalized Care', description: 'A plan shaped around your clinical needs and smile goals.', image: imageId },
          { icon: 'Users', title: 'Expert Team', description: 'Experienced professionals guide every stage of treatment.', image: imageId },
          { icon: 'Cpu', title: 'Advanced Technology', description: 'Modern tools support precise diagnosis and comfortable care.', image: imageId },
          { icon: 'ShieldCheck', title: 'Lasting Results', description: 'Care designed for predictable function, health, and confidence.', image: imageId },
        ], benefits_anchor_label: 'Benefits', benefits_title: service.slug === 'dental-implants' ? 'Benefits of Dental Implants' : `Benefits of ${service.title}`, benefits: benefitsData(service) },
        { __component: 'service-detail.candidates', anchor_label: 'Who Should Consider', title: content.candidatesTitle, items: candidateItems(service), image: imageId },
        { __component: 'service-detail.structure', ...structure, diagram: imageId },
        technologyData(imageId, service),
        procedureData(service),
        specialistsData(),
        patientResultsData(service),
        pricingData(service),
        faqData(service),
        consultationData(service),
      ],
    };
    const created = await api('/api/service-details', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data }) });
    await api(`/api/service-details/${created.data.documentId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: {}, status: 'published' }) });
    console.log(`[SERVICE DETAIL] seeded ${service.slug}`);
  }
  console.log(`[SERVICE DETAIL] completed ${services.length} shared-template pages`);
}

run().catch((error) => { console.error(`[SERVICE DETAIL] failed: ${error.message}`); process.exitCode = 1; });
