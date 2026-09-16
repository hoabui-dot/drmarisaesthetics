'use client'

import { MotionFaqAccordion } from '@/src/components/ui/motion-faq-accordion'

export type ServiceFaqItem = {
  id?: number | string
  question: string
  answer: string
}

export type ServiceFaqData = {
  title: string
  items: ServiceFaqItem[]
}

/**
 * Service FAQ presentation. It intentionally mirrors the centered homepage
 * accordion surface, without homepage-only badge, subtitle, or image layers.
 */
export function ServiceFaqSection({ data }: { data?: ServiceFaqData | null }) {
  if (!data?.title || !data.items?.length) return null

  return (
    <section className="stitch-section stitch-surface service-detail-faq-section" aria-labelledby="service-faq-title">
      <div className="stitch-container service-detail-faq-section__inner">
        <h2 id="service-faq-title">{data.title}</h2>
        <MotionFaqAccordion
          className="stitch-faq-grid service-detail-faq-section__accordion"
          items={data.items.map((item) => ({ id: item.id, question: item.question, answer: item.answer }))}
          defaultOpenIndex={0}
        />
      </div>
    </section>
  )
}
