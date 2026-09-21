'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { ArrowRight, CheckCircle2, Clock3, MapPin, PhoneCall, ShieldCheck } from 'lucide-react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'
import { CommonFaqAccordion } from '@/src/components/blocks/CommonFaqAccordion'
import { GoogleMapEmbed } from '@/src/components/ui/google-map-embed'
import { ContactConsultationSection, type ContactConsultationData } from '@/src/components/blocks/ContactConsultationSection'
import type { ContactMapSettings } from '@/src/components/blocks/ContactClinicLocationSection'
import type { ServiceOption } from '@/src/components/blocks/ContactConsultationSection'
import type { DeepPlaneFaceliftSpecialistData, DeepPlaneSectionKey } from '@/src/lib/constants/deep-plane-facelift-specialist'
import { useDeepPlaneCertificationMotion } from '@/src/hooks/useDeepPlaneCertificationMotion'
import { PlanningProcessSection } from '@/src/components/homepage/PlanningProcessSection'

function ConsultationButton({ variant = 'primary' }: { variant?: 'primary' | 'secondary' }) {
  const { open } = useBookingModal()
  return <button type="button" className={`deep-plane-facelift__button deep-plane-facelift__button--${variant}`} onClick={open}>{variant === 'primary' ? 'Schedule a Private Consultation' : 'Explore Surgical Technique'} <ArrowRight size={16} aria-hidden="true" /></button>
}

type DeepPlaneFaceliftSpecialistPageProps = {
  page: DeepPlaneFaceliftSpecialistData
  websiteSettings?: ContactMapSettings
  serviceOptions?: ServiceOption[]
}

export function DeepPlaneFaceliftSpecialistPage({ page, websiteSettings, serviceOptions = [] }: DeepPlaneFaceliftSpecialistPageProps) {
  const certificationRef = useRef<HTMLElement>(null)
  useDeepPlaneCertificationMotion(certificationRef)
  const consultationForm: ContactConsultationData = {
    formTitle: page.consultation.formTitle,
    formIntro: 'Please share a few details about your goals. Our patient coordinator will review your case and arrange a private surgical consultation.',
    serviceOptions,
    privacyPolicyLabel: 'Privacy Policy',
    privacyPolicyHref: '/privacy-policy',
    submitLabel: 'Request Private Consultation',
    infoTitle: 'Private Surgical Intake',
    infoDescription: page.consultation.formDescription,
    advisorTitle: 'Direct Surgeon-Led Review',
    advisorDescription: 'Your information is reviewed as the first step in a carefully planned surgical journey.',
    contacts: [],
    trustTitle: 'Confidential Clinical Review',
    trustDescription: 'Your details remain private and are used only to coordinate your consultation.',
  }
  const mapAddress = websiteSettings?.address || ''
  const mapLatitude = websiteSettings?.mapLatitude ?? 34.0736
  const mapLongitude = websiteSettings?.mapLongitude ?? -118.4004
  const mapZoom = websiteSettings?.mapZoom ?? 16
  const officeAddress = websiteSettings?.address || ''
  const consultationHours = websiteSettings?.openingHours || ''
  const consultationPhone = websiteSettings?.phonePrimary || ''
  const recoverySteps = page.recovery.steps.map((step) => ({
    number: step.number,
    title: step.title,
    description: step.description,
    items: [...step.items],
    image: step.image,
    imageAlt: step.imageAlt,
  }))
  const sectionPosition = (key: DeepPlaneSectionKey) => {
    const index = page.sections.findIndex((section) => section.key === key)
    return index === -1 ? page.sections.length + 1 : index
  }
  const sectionStyle = (key: DeepPlaneSectionKey) => ({ order: sectionPosition(key) })

  return <main className="stitch-page deep-plane-facelift" style={{ display: 'flex', flexDirection: 'column' }}>
    <section className="deep-plane-facelift__hero" style={sectionStyle('hero')}>
      <div className="stitch-container deep-plane-facelift__hero-grid">
        <div className="deep-plane-facelift__hero-copy">
          <span className="stitch-kicker"><i aria-hidden="true" />{page.hero.eyebrow}</span>
          <h1>{page.hero.title}</h1>
          <figure className="deep-plane-facelift__hero-image deep-plane-facelift__hero-image--mobile" aria-hidden="true"><Image src={page.hero.image} alt="" fill priority sizes="(max-width: 767px) 100vw, 1px" unoptimized /><figcaption><ShieldCheck size={22} aria-hidden="true" /><span><strong>{page.hero.verifiedLabel}</strong><b>{page.hero.verifiedTitle}</b><small>{page.hero.verifiedMeta}</small></span></figcaption></figure>
          <p className="deep-plane-facelift__lead">{page.hero.description}</p>
          <ul className="deep-plane-facelift__checklist">{page.hero.checklist.map((item) => <li key={item}><CheckCircle2 size={18} aria-hidden="true" />{item}</li>)}</ul>
          <div className="deep-plane-facelift__actions"><ConsultationButton /><a href="#technique" className="deep-plane-facelift__button deep-plane-facelift__button--secondary">Explore Surgical Technique <ArrowRight size={16} aria-hidden="true" /></a></div>
          <div className="deep-plane-facelift__metrics">{page.hero.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        </div>
        <figure className="deep-plane-facelift__hero-image deep-plane-facelift__hero-image--desktop"><Image src={page.hero.image} alt={page.hero.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 42vw" unoptimized /><figcaption><ShieldCheck size={22} aria-hidden="true" /><span><strong>{page.hero.verifiedLabel}</strong><b>{page.hero.verifiedTitle}</b><small>{page.hero.verifiedMeta}</small></span></figcaption></figure>
      </div>
    </section>

    <section id={page.journey.id} style={sectionStyle('journey')} className="deep-plane-facelift__section deep-plane-facelift__section--tint deep-plane-facelift__section--journey"><SectionHeading eyebrow={page.journey.eyebrow} title={page.journey.title} description={page.journey.description} /><div className="stitch-container deep-plane-facelift__card-grid deep-plane-facelift__card-grid--four">{page.journey.steps.map(([, badge, title, description, phase], index) => { const number = String(index + 1).padStart(2, '0'); return <article className="deep-plane-facelift__card" key={`${number}-${title}`}><div><div className="deep-plane-facelift__card-top"><strong>{number}</strong><span>{badge}</span></div><h3>{title}</h3><p>{description}</p></div><small>{phase}</small></article> })}</div></section>

    <div className="deep-plane-facelift__recovery-process" style={sectionStyle('recovery')}>
      <PlanningProcessSection
        sectionId={page.recovery.id}
        className="deep-plane-recovery-process"
        eyebrow={page.recovery.eyebrow}
        title={page.recovery.title}
        description={page.recovery.description}
        steps={recoverySteps}
        showActions={false}
        showStepImagesOnMobile
      />
      <div className="stitch-container deep-plane-facelift__note"><ShieldCheck size={24} aria-hidden="true" /><span>{page.recovery.note}</span></div>
    </div>

     <section ref={certificationRef} style={sectionStyle('certifications')} id={page.certifications.id} className="deep-plane-facelift__section deep-plane-facelift__section--tint deep-plane-facelift__certification-section"><div className="deep-plane-facelift__certification-pin" data-certification-pin><SectionHeading eyebrow={page.certifications.eyebrow} title={page.certifications.title} description={page.certifications.description} /><div className="stitch-container deep-plane-facelift__certification-gallery" data-certification-gallery><div className="deep-plane-facelift__certification-track" data-certification-track>{page.certifications.cards.map((card) => <CertificationCard key={card.image} {...card} />)}</div></div></div></section>

    <section id={page.safety.id} style={sectionStyle('safety')} className="deep-plane-facelift__section deep-plane-facelift__section--safety"><SectionHeading eyebrow={page.safety.eyebrow} title={page.safety.title} description={page.safety.description} /><div className="stitch-container deep-plane-facelift__card-grid deep-plane-facelift__card-grid--three">{page.safety.cards.map((card) => <article className="deep-plane-facelift__safety-card" key={card.title}><div className="deep-plane-facelift__safety-image"><Image src={card.image} alt={card.alt} fill sizes="(max-width: 900px) 100vw, 33vw" unoptimized /></div><div className="deep-plane-facelift__safety-copy"><span className="deep-plane-facelift__eyebrow">{card.eyebrow}</span><h3>{card.title}</h3><ul>{card.items.map((item) => <li key={item}><CheckCircle2 size={14} aria-hidden="true" /><span>{item}</span></li>)}</ul></div></article>)}</div><div className="stitch-container deep-plane-facelift__facility-note"><ShieldCheck size={18} aria-hidden="true" />{page.safety.note}</div></section>

    <section id={page.credentials.id} style={sectionStyle('credentials')} className="deep-plane-facelift__section deep-plane-facelift__section--tint"><div className="stitch-container deep-plane-facelift__credentials"><figure className="deep-plane-facelift__credentials-image deep-plane-facelift__credentials-image--desktop"><Image src={page.credentials.image} alt={page.credentials.imageAlt} fill sizes="(max-width: 900px) 100vw, 40vw" unoptimized /><figcaption><span>Direct Clinical Involvement</span><strong>100% Surgeon-Performed Procedures</strong><small>From initial diagnostic 3D scan to every deep-plane retaining suture.</small></figcaption></figure><div><span className="stitch-kicker">{page.credentials.eyebrow}</span><h2>{page.credentials.title}</h2><figure className="deep-plane-facelift__credentials-image deep-plane-facelift__credentials-image--mobile" aria-hidden="true"><Image src={page.credentials.image} alt="" fill sizes="(max-width: 767px) 100vw, 1px" unoptimized /><figcaption><span>Direct Clinical Involvement</span><strong>100% Surgeon-Performed Procedures</strong><small>From initial diagnostic 3D scan to every deep-plane retaining suture.</small></figcaption></figure><div className="deep-plane-facelift__paragraphs">{page.credentials.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="deep-plane-facelift__credential-list">{page.credentials.cards.map(([title, description]) => <div key={title}><CheckCircle2 size={18} aria-hidden="true" /><span><strong>{title}</strong><small>{description}</small></span></div>)}</div></div></div></section>

    <section id={page.faq.id} style={sectionStyle('faq')} className="deep-plane-facelift__section deep-plane-facelift__section--faq"><SectionHeading eyebrow={page.faq.eyebrow} title={page.faq.title} description={page.faq.description} /><div className="stitch-container deep-plane-facelift__faq"><CommonFaqAccordion items={page.faq.items.map(([question, answer], index) => ({ id: index + 1, question, answer }))} className="deep-plane-facelift__faq-accordion" defaultOpenIndex={0} /></div></section>

    <section id={page.consultation.id} style={sectionStyle('consultation')} className="deep-plane-facelift__consultation"><div className="stitch-container deep-plane-facelift__consultation-grid"><div className="deep-plane-facelift__facility"><span className="deep-plane-facelift__eyebrow">{page.consultation.eyebrow}</span><h2>{page.consultation.title}</h2><div className="deep-plane-facelift__consultation-image"><Image src={page.consultation.image} alt={page.consultation.imageAlt} fill sizes="(max-width: 900px) 100vw, 42vw" unoptimized /></div><dl><div><dt><MapPin size={17} aria-hidden="true" />Surgical Suite & Consultation Office</dt><dd>{officeAddress}</dd></div><div><dt><Clock3 size={17} aria-hidden="true" />Consultation Hours</dt><dd>{consultationHours}</dd></div><div><dt><PhoneCall size={17} aria-hidden="true" />Private Surgical Concierge Line</dt><dd>{consultationPhone}</dd></div></dl><div className="deep-plane-facelift__map"><div className="deep-plane-facelift__map-frame"><GoogleMapEmbed lat={mapLatitude} lng={mapLongitude} query={mapAddress} zoom={mapZoom} title="Dr. Maris Aesthetics clinic location map" /></div></div></div><div className="deep-plane-facelift__intake"><ContactConsultationSection data={consultationForm} formOnly /></div></div></section>
  </main>
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="stitch-container deep-plane-facelift__section-heading"><span className="deep-plane-facelift__eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></header>
}

function CertificationCard({ image, imageAlt }: { image: string; imageAlt: string }) {
  return <article className="deep-plane-facelift__certificate deep-plane-facelift__certificate--image"><Image src={image} alt={imageAlt} fill sizes="(max-width: 900px) 86vw, 40vw" unoptimized /><div className="deep-plane-facelift__certificate-image-bottom"><span className="deep-plane-facelift__certificate-image-label">Accredited Surgical Facility</span><strong className="deep-plane-facelift__certificate-image-issuer">Issued by Quad A / AAAASF</strong></div></article>
}
