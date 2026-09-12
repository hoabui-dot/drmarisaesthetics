'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { SERVICE_UI_COPY } from '@/src/data/service-details'
import type { ServicePageData, ServiceHighlight } from '@/src/data/service-details'
import { MotionFaqAccordion } from '@/src/components/ui/motion-faq-accordion'

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('is-visible')
        observer.unobserve(node)
      }
    }, { threshold: 0.12 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className="service-page-reveal">{children}</div>
}

function Cards({ items }: { items: ServiceHighlight[] }) {
  return <div className="service-page-card-grid">{items.map((item) => <article className="service-page-card" key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
}

function Section({ id, eyebrow, title, body, children, tone = 'light', image, imageAlt }: { id: string; eyebrow: string; title: string; body: string; children: React.ReactNode; tone?: 'light' | 'soft' | 'navy'; image?: string; imageAlt?: string }) {
  return <Reveal><section id={id} className={`service-page-section service-page-section--${tone}`}><div className="service-page-container">{image ? <div className="service-page-section__layout"><div><p className="service-page-eyebrow">{eyebrow}</p><h2>{title}</h2><p className="service-page-lead">{body}</p>{children}</div><figure className="service-page-section__visual"><img src={image} alt={imageAlt || title} loading="lazy" /></figure></div> : <><p className="service-page-eyebrow">{eyebrow}</p><h2>{title}</h2><p className="service-page-lead">{body}</p>{children}</>}</div></section></Reveal>
}

export function ServicePage({ data }: { data: ServicePageData }) {
  return <main className="service-page">
    <section className="service-page-hero"><div className="service-page-container service-page-hero__grid"><div className="service-page-hero__copy"><p className="service-page-eyebrow">{data.eyebrow}</p><h1>{data.title}</h1><p className="service-page-hero__description">{data.description}</p><ul className="service-page-trust-list">{data.trustPoints.map((point) => <li key={point}>{point}</li>)}</ul><div className="service-page-actions"><Link className="service-page-primary" href="/contact#form-section">BOOK A CONSULTATION</Link><Link className="service-page-secondary" href="#service-overview">EXPLORE THE PROCEDURE</Link></div></div><div className="service-page-hero__media"><img src={data.image} alt={data.imageAlt} /></div></div></section>
    <nav className="service-page-anchor" aria-label="Service sections"><div className="service-page-container">{['overview', 'suitability', 'approach', 'planning', 'hospital', 'recovery', 'faq'].map((id) => <a href={`#service-${id}`} key={id}>{data[id as keyof ServicePageData] && typeof data[id as keyof ServicePageData] === 'object' ? (data[id as keyof ServicePageData] as { title: string }).title : id}</a>)}</div></nav>
    <Section id="service-overview" eyebrow={SERVICE_UI_COPY.overviewEyebrow} title={data.overview.title} body={data.overview.body} image={data.visuals.overview}><Cards items={data.overview.highlights} /></Section>
    <Section id="service-suitability" eyebrow={SERVICE_UI_COPY.suitabilityEyebrow} title={data.suitability.title} body={data.suitability.body} tone="soft"><ul className="service-page-check-list">{data.suitability.items.map((item) => <li key={item}>{item}</li>)}</ul></Section>
    <Section id="service-approach" eyebrow={SERVICE_UI_COPY.approachEyebrow} title={data.approach.title} body={data.approach.body}><ul className="service-page-check-list">{data.approach.points.map((item) => <li key={item}>{item}</li>)}</ul></Section>
    <Section id="service-planning" eyebrow={SERVICE_UI_COPY.planningEyebrow} title={data.planning.title} body={data.planning.body} tone="soft" image={data.visuals.planning}><Cards items={data.planning.steps} /></Section>
    <Section id="service-specialty" eyebrow={SERVICE_UI_COPY.specialtyEyebrow} title={data.specialty.title} body={data.specialty.body}><Cards items={data.specialty.cards} /></Section>
    <Section id="service-hospital" eyebrow={SERVICE_UI_COPY.hospitalEyebrow} title={data.hospital.title} body={data.hospital.body} tone="navy" image={data.visuals.hospital}><ul className="service-page-check-list">{data.hospital.points.map((item) => <li key={item}>{item}</li>)}</ul></Section>
    <Section id="service-recovery" eyebrow={SERVICE_UI_COPY.recoveryEyebrow} title={data.recovery.title} body={data.recovery.body} tone="soft" image={data.visuals.recovery}><Cards items={data.recovery.timeline} /></Section>
    <Section id="service-risks" eyebrow={SERVICE_UI_COPY.risksEyebrow} title={data.risks.title} body={data.risks.body}><ul className="service-page-check-list">{data.risks.points.map((item) => <li key={item}>{item}</li>)}</ul></Section>
    <Section id="service-expectations" eyebrow={SERVICE_UI_COPY.expectationsEyebrow} title={data.expectations.title} body={data.expectations.body} tone="soft"><ul className="service-page-check-list">{data.expectations.points.map((item) => <li key={item}>{item}</li>)}</ul></Section>
    <Section id="service-international" eyebrow={SERVICE_UI_COPY.internationalEyebrow} title={data.international.title} body={data.international.body} image={data.visuals.international}><ul className="service-page-check-list">{data.international.points.map((item) => <li key={item}>{item}</li>)}</ul></Section>
    <Section id="service-faq" eyebrow={SERVICE_UI_COPY.faqEyebrow} title={data.faq.title} body={SERVICE_UI_COPY.faqIntro}><MotionFaqAccordion allowMultiple className="service-page-faq" itemClassName="service-page-faq__item" triggerClassName="service-page-faq__trigger" contentClassName="service-page-faq__content" items={data.faq.items.map((item) => ({ ...item, id: item.question }))} /></Section>
    <section className="service-page-cta" style={{ backgroundImage: `linear-gradient(110deg, rgba(8,46,111,.96), rgba(8,46,111,.76)), url(${data.visuals.hospital})` }}><div className="service-page-container"><p className="service-page-eyebrow">{SERVICE_UI_COPY.ctaEyebrow}</p><h2>{SERVICE_UI_COPY.ctaTitle}</h2><Link className="service-page-primary" href="/contact#form-section">BOOK A CONSULTATION</Link></div></section>
  </main>
}
