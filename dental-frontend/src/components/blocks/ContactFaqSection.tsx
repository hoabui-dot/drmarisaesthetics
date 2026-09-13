import { CommonFaqAccordion } from '@/src/components/blocks/CommonFaqAccordion'

type Faq = { question: string; answer: string }
const defaults: Faq[] = [
  { question: 'Is there a fee for the initial consultation?', answer: "Yes, we charge a nominal fee for the specialist's time, which is fully credited toward any treatment you choose to proceed with." },
  { question: 'How soon can I get an appointment?', answer: 'Typically, we can accommodate new patient consultations within 3–5 business days depending on physician availability.' },
  { question: 'Do you offer virtual consultations?', answer: 'For international patients or initial assessments, we offer secure video consultations via our patient portal.' },
  { question: 'How should I prepare for my consultation?', answer: 'Please bring a list of your current medications and any medical history relevant to your visit.' },
]

export function ContactFaqSection({ data }: { data: { title?: string; questions?: Faq[] } }) {
  const items = data.questions?.length ? data.questions : defaults
  return <section className="contact-faq" aria-labelledby="contact-faq-title"><h2 id="contact-faq-title">{data.title || 'Frequently Asked Questions'}</h2>
    <CommonFaqAccordion items={items} className="contact-faq__accordion" />
  </section>
}
