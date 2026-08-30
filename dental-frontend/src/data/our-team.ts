export type OurTeamData = {
  professionalImage?: string
  hospitalImage?: string
  internationalImage?: string
  hero: { eyebrow: string; title: string; paragraphs: string[]; image: string; imageAlt: string }
  surgicalCare: { title: string; heading: string; paragraphs: string[]; steps: string[]; image: string; imageAlt: string; experience: string; experienceLabel: string }
  revision: { eyebrow: string; title: string; heading: string; description: string; calloutTitle: string; calloutDescription: string; concerns: Array<{ title: string; description: string }>; image?: string; imageAlt?: string }
  internationalPatients: { eyebrow: string; title: string; description: string; steps: Array<{ number: string; title: string; description: string }> }
  journey: { eyebrow: string; title: string; description: string; steps: Array<{ number: string; title: string; description: string }> }
  consultation: { title: string; description: string; fields: { name: string; email: string; phone: string; interest: string; description: string }; interests: string[]; whatsappLabel: string }
  faq: { eyebrow: string; title: string; items: Array<{ question: string; answer: string }> }
}

// Stable, openly hosted editorial imagery replaces expired Stitch preview URLs.
const reliableTeamImages = {
  hero: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1600&q=85',
  clinic: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1800&q=85',
  hospital: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1800&q=85',
  consultation: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=85',
  revision: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1800&q=85',
}

export const ourTeamMockData: OurTeamData = {
  professionalImage: 'https://lh3.googleusercontent.com/aida/AEtjO1XXbq0nEsgYvRypCDIPl7aYFjLX9jK_4XdlD_cfBculkZTdj5M2lnd9-W1CXBjRYBrDa1nXZqbd-iZUYb1Q7Vi1trslqcuOB4el34aOEFT6XGhIihyHsb_t3BGfWObKnT3UXlvYfzYkzOyHmJWHuhvCsUo0zZ-lbVEw_J-hkqA-JofgimRbz3kNUwXTYtwpLw-ZQi1AXtd-zJ2XICOQ2o-MAFpQA6KGdJnfwk7YcJcVasZJbRsdCYOAt_5n',
  hospitalImage: 'https://lh3.googleusercontent.com/aida/AEtjO1WfULKLvdA7A_Rj8nBOX_Kn4LmHjU2-su8dEHYnuCNvWH8zGH2VDEOxtFMgWgeR6If4x7n5vdvVky1h0MeTtSV8PStHQs2fsgjwbQZmU1Q1PgUg6dJdriyJXI1p5Bn9OTSDBvBwctYIf2mrg6TFJIMeg3auoz96farOQg5_OfYLFN0fu-A5WYBZolrU8LjIPAQ5J6My4bPbRib4k0H1rV7OGK8kdzTOHwxqk7KYMM_icNzO6KJ7Pjb1nJ4r',
  internationalImage: 'https://lh3.googleusercontent.com/aida/AEtjO1UyuNh8ose2rDhcXXEcTYoAdy4x4Ry3MwC3pg_wXtQn4c63X1-UQdzF14j9kip2XLiqMvjaesf48BCWcM1Dqw1Clq1SzLJU6HUXKTRwKYAjnv1O8y-ZZ8EgA2jGpludA-yFWXoN6vSOb7-Bpa1pIcKLnhasL4U6-8QBhJmhnlM0_pftftjplRV_VA8mM9Nx_z24iA7y5fVSFl6vtZ6rOO5GTlKvBKPeMWYartYc6acnLzIToaIIAzE2Qcg',
  hero: {
    eyebrow: 'HOSPITAL-BASED COSMETIC SURGERY · HO CHI MINH CITY',
    title: 'Plastic Surgery in Vietnam for International Patients',
    paragraphs: [
      'Cosmetic surgery is a medical decision before it is an aesthetic one. At DR. MARIS AESTHETICS, your case is personally assessed and managed by Dr. Maris, with surgery performed at City International Hospital (CIH) in Ho Chi Minh City.',
      'From primary cosmetic procedures to complex revision surgery, every surgical plan begins with your anatomy, medical history, previous procedures and individual goals.',
    ],
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1VJgsEWyGmfDFSAH60TpejN1jfTPmYouVsZ6nzGtFO-mzWXDj4ML916mc1zchSnpvY7m88L1KOFHMClbU6PRUGQVk20RWEOObY-Azg1runApDtoRFTNBpZnQXPxQv8lEKzGLEtfQlKASUeJ1Z5sq0SVnz15YOQcXehydlpLHsYXKhD855cjiMUGm4GDxrrvSsczZAH4ZDei4aqQkEzjXiaIG6taexRlthR5fWzpWqGrG1XApRqhfUWwKchJ',
    imageAlt: 'Portrait of Dr. Maris in clinical setting',
  },
  surgicalCare: {
    title: 'Your surgical care process',
    heading: 'Who will actually perform my surgery?',
    paragraphs: [
      'Dr. Maris (Dr. Tran Minh Huy) brings 6+ years of specialized cosmetic surgery experience to every case. Unlike high-volume clinics, we strictly limit our surgical schedule to ensure that Dr. Maris is personally involved in every critical step of your journey.',
      'This commitment to individualized planning means your anatomy, medical history, and aesthetic goals receive the undivided attention they deserve, from the first incision to the final stitch.',
    ],
    steps: ['Consultation', 'Examination', 'Planning', 'Surgery', 'Follow-Up'],
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1WfULKLvdA7A_Rj8nBOX_Kn4LmHjU2-su8dEHYnuCNvWH8zGH2VDEOxtFMgWgeR6If4x7n5vdvVky1h0MeTtSV8PStHQs2fsgjwbQZmU1Q1PgUg6dJdriyJXI1p5Bn9OTSDBvBwctYIf2mrg6TFJIMeg3auoz96farOQg5_OfYLFN0fu-A5WYBZolrU8LjIPAQ5J6My4bPbRib4k0H1rV7OGK8kdzTOHwxqk7KYMM_icNzO6KJ7Pjb1nJ4r',
    imageAlt: 'Dr. Tran Minh Huy - Lead Surgeon',
    experience: '6+ Years',
    experienceLabel: 'Specialized Cosmetic Surgery',
  },
  revision: {
    eyebrow: 'Specialized Care',
    title: 'Revision Cosmetic Surgery Vietnam',
    heading: 'When Your First Surgery Did Not Go as Planned',
    description: 'Revision surgery requires a significantly higher level of expertise, precision, and understanding of altered anatomy. Dr. Maris specializes in complex reconstructive and secondary cosmetic procedures, providing honest assessments and realistic pathways to restoration.',
    calloutTitle: 'Can My Previous Cosmetic Surgery Be Corrected?',
    calloutDescription: 'The first step in any revision journey is determining if a secondary surgery is medically advisable and likely to achieve an improvement. We require detailed medical records, operative reports (if available), and high-resolution images to conduct a thorough preliminary assessment before you travel.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdQyeOuQas2HDVrVcVv0mWZjxK3NWf1aDA_QEng9nRjmoK2pYH1XjEumfk0988xq1TbuDpUye-R2kcmzj_NraeiFCSU7EiiUQcK5Wg-heWJarwStAYZNOfwi30sJc6xoXm5FXiLNhEnrR_0IJEJov2CIwFzzznKxxh2ptDNszjA5d22zwbu-pLLc42i4MJd3LN6i-eVWO1UU6D7Q1SWaZuz51f0dMV7ZyaKKxbyKgxHxbTC40sadlI8Q',
    imageAlt: 'Specialist surgeon examining medical scans for revision planning',
    concerns: [
      { title: 'Capsular Contracture', description: 'Addressing hardened or distorted breast implants.' },
      { title: 'Asymmetry Correction', description: 'Balancing uneven results from previous breast, facial, or body procedures.' },
      { title: 'Excessive Scar Tissue', description: 'Scar revision and tissue realignment.' },
      { title: 'Implant Malposition', description: 'Correcting implants that have shifted, bottomed out, or appear unnatural.' },
      { title: 'Over-resected Rhinoplasty', description: 'Rebuilding nasal structures compromised by previous aggressive surgeries.' },
      { title: 'Contour Irregularities', description: 'Smoothing indentations or lumpiness following primary liposuction.' },
      { title: 'Unsatisfactory Functional Outcomes', description: 'Addressing breathing difficulties or other functional impairments resulting from initial cosmetic procedures.' },
    ],
  },
  internationalPatients: {
    eyebrow: 'International Patients',
    title: 'Planning Plastic Surgery in Vietnam From Overseas',
    description: 'Patients from Australia, New Zealand, the United States, Europe and other international markets can begin their consultation process before traveling.',
    steps: [
      { number: '01', title: 'Send Your Case', description: 'Provide relevant concerns, photographs, medical history, previous surgical information, and implant details where applicable.' },
      { number: '02', title: 'Online Consultation', description: 'Preliminary consultation before travel. Remote consultation does not replace physical examination.' },
      { number: '03', title: 'Travel to Ho Chi Minh City', description: 'Patient arrives for in-person assessment and clinical evaluation at our facility.' },
      { number: '04', title: 'Final Examination & Surgical Planning', description: 'Dr. Maris confirms suitability and finalizes the surgical plan based on physical findings.' },
      { number: '05', title: 'Surgery at CIH', description: 'Hospital-based cosmetic surgery performed in a fully accredited international hospital setting.' },
      { number: '06', title: 'Recovery & Follow-Up', description: 'Recovery and return travel timing depend on the procedure and individual condition.' },
    ],
  },
  journey: {
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
  consultation: {
    title: 'Begin Your Journey',
    description: 'We do not offer generic tourism packages. We provide individualized medical assessments to determine the safest and most effective approach for your goals.',
    fields: { name: 'Full Name', email: 'Email Address', phone: 'Phone Number', interest: 'Primary Area of Interest', description: 'Brief Case Description' },
    interests: ['Rhinoplasty', 'Revision Surgery', 'Facial Contouring', 'Breast Augmentation', 'Other Procedure'],
    whatsappLabel: 'Contact via WhatsApp',
  },
  faq: {
    eyebrow: 'SURGICAL PLANNING',
    title: 'Frequently Asked Questions About Plastic Surgery in Vietnam',
    items: [
      { question: 'Is DR. MARIS AESTHETICS a spa or cosmetic surgery provider?', answer: 'We are a specialized cosmetic surgery provider. Unlike spas or beauty clinics, all surgical procedures are performed in a fully accredited international hospital (CIH) with comprehensive medical infrastructure.' },
      { question: 'Who performs my cosmetic surgery?', answer: "Every surgery is personally performed by Dr. Maris (Dr. Tran Minh Huy). We do not use 'ghost surgeons' or junior residents; your care is managed directly by the lead surgeon from planning to follow-up." },
      { question: 'Can I speak with Dr. Maris before travelling to Vietnam?', answer: 'Yes. We require an online consultation via video call to review your medical history, photographs, and surgical goals before any travel arrangements are finalized.' },
      { question: 'Does Dr. Maris perform revision plastic surgery?', answer: 'Dr. Maris specializes in complex revision cases, including corrective rhinoplasty, breast implant revision, and scar management for patients who had unsatisfactory results elsewhere.' },
      { question: 'Can failed cosmetic surgery always be corrected?', answer: 'While many issues can be significantly improved, correction depends on the amount of healthy tissue remaining and the nature of the previous surgery. A thorough assessment is required to determine realistic outcomes.' },
      { question: 'How long should I stay in Vietnam after plastic surgery?', answer: 'Stay duration varies by procedure, typically ranging from 7 to 14 days. This ensures you are past the immediate post-operative phase and have had your initial follow-up examinations before flying.' },
      { question: 'How much does plastic surgery cost in Vietnam?', answer: "Costs are significantly more competitive than in Australia or the US, but we prioritize safety and hospital-based care over 'budget' pricing. Quotes are provided after your clinical assessment." },
      { question: 'What should I send if I need revision surgery?', answer: 'Please provide your previous operative reports, the date of your last surgery, high-resolution photos of the area, and a detailed description of your specific concerns.' },
    ],
  },
}

// Keep every rendered media slot backed by a verified URL, including nested legacy data.
ourTeamMockData.professionalImage = reliableTeamImages.clinic
ourTeamMockData.hospitalImage = reliableTeamImages.hospital
ourTeamMockData.internationalImage = reliableTeamImages.consultation
ourTeamMockData.hero.image = reliableTeamImages.hero
ourTeamMockData.surgicalCare.image = reliableTeamImages.consultation
ourTeamMockData.revision.image = reliableTeamImages.revision
