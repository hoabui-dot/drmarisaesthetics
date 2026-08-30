'use client'

import { ContactHeroSection } from '@/src/components/blocks/ContactHeroSection'
import { ContactConsultationSection } from '@/src/components/blocks/ContactConsultationSection'
import { ContactClinicLocationSection } from '@/src/components/blocks/ContactClinicLocationSection'
import { ContactExpectationSection } from '@/src/components/blocks/ContactExpectationSection'
import { ContactFaqSection } from '@/src/components/blocks/ContactFaqSection'
import type { ContactMethod } from '@/src/types/strapi'

const referenceConsultationImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv4QMbPrkqG2aQ0lh3niXL3DrE3lV-66wyWK1lkJzf8jRos1VVmG5v9eCDbgbQns7JGmp4NN1fVExc890phtmTH9BsHXbgroS_68_aX8oRZE4RF-4nLI_vuj2haRZFgvRoizqHbmA8gJPC1umUy9r5_PpJuxr7wHJn_58yOr2MypPuq1muRN4ujFcK-_0M8IDMVPxU6KBoBwt0D3_KeXJcQPKVZKki28T8J8ySldfYExiIcbOw3CvHxQ'

const staticContactContent: any = {
  blocks: [
    { id: 'contact-hero', __component: 'contact.hero', data: { title: 'Start With a Conversation About Your Case', subtitle: 'PRIVATE CONSULTATION · HO CHI MINH CITY', description: 'Considering cosmetic surgery abroad often begins with questions, not decisions. Contact DR. MARIS AESTHETICS to discuss your concerns, previous procedures and surgical goals before planning your next step.', heroImageUrl: referenceConsultationImage } },
    { id: 'contact-consultation', __component: 'contact.consultation-section', data: { formTitle: 'Request a Consultation', formIntro: 'Please fill out the form below and our patient coordinator will contact you within 24 hours to schedule your private consultation.', serviceOptions: [{ label: 'Rhinoplasty', value: 'rhinoplasty' }, { label: 'Revision Surgery', value: 'revision-surgery' }, { label: 'Facial Contouring', value: 'facial-contouring' }, { label: 'Breast Surgery', value: 'breast-surgery' }], locationOptions: [{ label: 'Ho Chi Minh City · City International Hospital', value: 'city-international-hospital' }], privacyPolicyLabel: 'Privacy Policy', privacyPolicyHref: '/privacy-policy', submitLabel: 'Send Request', infoTitle: 'Contact Information', infoDescription: 'Our international patient coordinator will guide you through the next step.', advisorTitle: 'International Patient Coordination', advisorDescription: 'Private, direct and medically focused communication before you travel.', advisorImage: referenceConsultationImage, contacts: [{ type: 'hotline', label: 'Phone', value: '+84 28 1234 5678', href: 'tel:+842812345678' }, { type: 'email', label: 'Email', value: 'concierge@drmarisaesthetics.com', href: 'mailto:concierge@drmarisaesthetics.com' }, { type: 'whatsapp', label: 'WhatsApp', value: 'Message our team', href: 'https://wa.me/842812345678' }], trustTitle: 'Hospital-Based Care', trustDescription: 'Every surgical plan is assessed with safety, anatomy and recovery in mind.' } },
    { id: 'contact-location', __component: 'contact.map-section', data: { title: 'Visit City International Hospital', address: 'Ho Chi Minh City, Vietnam', benefits: [{ icon: 'location', text: 'Hospital-based surgical facility' }, { icon: 'landmark', text: 'International patient support' }, { icon: 'parking', text: 'Convenient city access' }], clinicName: 'City International Hospital', mapAddress: 'City International Hospital Ho Chi Minh City', directionsLabel: 'Get Directions', directionsUrl: 'https://maps.google.com/?q=City+International+Hospital+Ho+Chi+Minh+City' } },
    { id: 'contact-expectation', __component: 'contact.expectation', data: { title: 'What to Expect', items: [{ step: '01', title: 'Send Your Request', description: 'Fill out our detailed form to help us understand your unique aesthetic goals and concerns.' }, { step: '02', title: 'Speak With Our Team', description: 'Our patient coordinator will contact you to review your request and arrange an appointment.' }, { step: '03', title: 'Meet Your Doctor', description: 'Enjoy a comprehensive, private consultation with our medical specialists to design your roadmap.' }] } },
    { id: 'contact-faq', __component: 'contact.faq', data: { title: 'Frequently Asked Questions', questions: [{ question: 'Is there a fee for the initial consultation?', answer: "Yes, we charge a nominal fee for the specialist's time, which is fully credited toward any treatment you choose to proceed with." }, { question: 'How soon can I get an appointment?', answer: 'Typically, we can accommodate new patient consultations within 3–5 business days depending on physician availability.' }, { question: 'Do you offer virtual consultations?', answer: 'For international patients or initial assessments, we offer secure video consultations via our patient portal.' }, { question: 'How should I prepare for my consultation?', answer: 'Please bring a list of your current medications and any medical history relevant to your visit.' }] } },
  ],
}

export default function ContactPageClient({ contactMethods = [] }: { contactMethods?: ContactMethod[] }) {
  const cmsContacts = contactMethods
    .filter((method) => method.isActive && method.href)
    .map((method) => ({
      type: method.type === 'phone' ? 'hotline' : method.type,
      label: method.label,
      value: method.type === 'phone' ? method.href.replace(/^tel:/, '') : method.label,
      href: method.href,
    }))
  const content = cmsContacts.length > 0
    ? {
        ...staticContactContent,
        blocks: staticContactContent.blocks.map((block: any) => block.__component === 'contact.consultation-section'
          ? { ...block, data: { ...block.data, contacts: cmsContacts } }
          : block),
      }
    : staticContactContent
  return (
    <main className="contact-page min-h-screen selection:bg-slate-200 selection:text-slate-900">
      {content.blocks.map((block: any) => {
        if (block.__component === 'contact.hero') {
          return <ContactHeroSection key={block.id} data={block.data} />
        }

        if (block.__component === 'contact.consultation-section') {
          return <ContactConsultationSection key={block.id} data={block.data} />
        }

        if (block.__component === 'contact.map-section') {
          return <ContactClinicLocationSection key={block.id} data={block.data} />
        }

        if (block.__component === 'contact.expectation') return <ContactExpectationSection key={block.id} data={block.data} />
        if (block.__component === 'contact.faq') return <ContactFaqSection key={block.id} data={block.data} />

        return null
      })}
    </main>
  )
}
