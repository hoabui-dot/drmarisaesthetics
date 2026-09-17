'use client'

import Image from 'next/image'
import { ArrowRight, Award, BadgeCheck, CalendarDays, CheckCircle2, GraduationCap, Hospital } from 'lucide-react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'
import { ourTeamMockData, type OurTeamData } from '@/src/data/our-team'
import { useOurTeamMotion } from '@/src/hooks/useOurTeamMotion'
import { useRef } from 'react'
import { FAQSection } from '@/src/components/blocks/FAQSection'

function TeamImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 50vw" className={`object-cover ${className}`.trim()} unoptimized />
}

function ConsultationButton({ children = 'REQUEST A CONSULTATION', className = '' }: { children?: React.ReactNode; className?: string }) {
  const { open } = useBookingModal()
  return <button type="button" onClick={open} className={`booking-inline-cta editorial-hero-primary ${className}`.trim()}><CalendarDays size={16} aria-hidden="true" />{children}</button>
}

const careerTimeline = ['Koren Star Cosmetic Hospital', 'Asia International Cosmetic Hospital', 'Medika Cosmetic Hospital', 'City International Hospital (CIH)']
const revisionConcerns = ['capsular contracture', 'implant rupture', 'implant displacement', 'breast asymmetry', 'symmastia', 'implant removal', 'excessive scar tissue', 'free silicone', 'silicone migration or leakage', 'failed breast augmentation']
const reviewItems = ['current concerns', 'recent photographs', 'medical history', 'previous surgery information', 'implant details', 'previous operation reports', 'relevant investigations']

export function OurTeamPage({ data = ourTeamMockData }: { data?: OurTeamData }) {
  const { hero, revision } = data
  const professional = data.professional
  const international = data.internationalPatients
  const pageRef = useRef<HTMLElement>(null)
  useOurTeamMotion(pageRef)
  return <main ref={pageRef} className="stitch-page stitch-our-team">
    <section className="our-team-profile-hero" data-team-hero><div className="our-team-profile-hero__grid stitch-container"><div className="our-team-profile-hero__heading"><span className="stitch-kicker" data-team-hero-eyebrow><i data-team-hero-divider />{hero.eyebrow}</span><h2><span className="stitch-hero-line"><span data-team-hero-title-line>{hero.title}</span></span></h2></div><div className="our-team-profile-hero__copy"><div className="our-team-profile-hero__identity" data-team-hero-copy><p>Dr. Tran Minh Huy</p><span>Specialist Level I in Aesthetic Surgery, Vietnam</span></div><div className="our-team-profile-hero__body">{hero.paragraphs.map((paragraph) => <p key={paragraph} data-team-hero-copy>{paragraph}</p>)}</div><div className="stitch-actions" data-team-hero-actions><ConsultationButton className="stitch-button stitch-button--dark">Request a Consultation</ConsultationButton><a className="stitch-button stitch-button--outline" href="#revision">Explore Surgical Expertise <ArrowRight size={17} /></a></div></div><div className="our-team-profile-hero__media" data-team-hero-image><TeamImage src={hero.image} alt={hero.imageAlt} className="our-team-profile-hero__image" /></div></div></section>

    <section className="our-team-authority"><div className="stitch-container"><div className="our-team-section-heading"><span className="stitch-kicker">{data.authority.eyebrow}</span><h2>{data.authority.title}</h2><p>{data.authority.description}</p></div><div className="our-team-authority__grid">{data.authority.cards.map(({ title, items }, index) => { const Icon = [GraduationCap, BadgeCheck, Award][index % 3]; return <article key={title}><span className="our-team-authority__icon"><Icon size={24} aria-hidden="true" /></span><h3>{title}</h3><ul>{items.map(item => <li key={item}><CheckCircle2 size={15} aria-hidden="true" />{item}</li>)}</ul></article> })}</div></div></section>

    <section className="our-team-professional"><div className="stitch-container our-team-professional__grid"><div><span className="stitch-kicker">{professional?.eyebrow || 'PROFESSIONAL JOURNEY'}</span><h2>{professional?.title || 'Experience Across Cosmetic Surgery &amp; Hospital Environments'}</h2><p>{professional?.description || 'Dr. Maris&apos;s professional background includes experience across cosmetic surgery institutions and a hospital environment in Ho Chi Minh City.'}</p><div className="our-team-timeline">{(professional?.steps?.length ? professional.steps : careerTimeline.map((title, index) => ({ number: `0${index + 1}`, title, description: '' }))).map(step => <div key={step.number + step.title}><b>{step.number}</b><span>{step.title}</span></div>)}</div></div><div className="our-team-professional__media"><TeamImage src={professional?.image || data.professionalImage || hero.image} alt={professional?.imageAlt || 'Modern premium clinic hallway in Ho Chi Minh City'} /></div></div></section>

    <section className="our-team-credentials"><div className="stitch-container our-team-credentials__grid"><div><span className="stitch-kicker">{data.credentials.eyebrow}</span><h2>{data.credentials.title}</h2><p>{data.credentials.description}</p></div><div className="our-team-credential-list">{data.credentials.rows.map(({ label, value }) => <div key={label}><span>{label}</span><p>{value}</p></div>)}</div></div></section>

    <section id="revision" className="our-team-revision" data-team-revision><div className="stitch-container our-team-revision__grid"><div><span className="stitch-kicker" data-revision-reveal>{revision.eyebrow}</span><h2 data-revision-reveal>{revision.title}</h2><p data-revision-reveal>{revision.description}</p><div className="our-team-revision__concerns">{(revision.concerns.length ? revision.concerns : revisionConcerns.map(title => ({ title, description: '' }))).map(item => <span key={item.title} data-revision-reveal><ArrowRight size={14} aria-hidden="true" />{item.title}</span>)}</div><p className="our-team-revision__note" data-revision-reveal>{revision.calloutDescription}</p><div data-revision-reveal><ConsultationButton>Request a Revision Surgery Assessment</ConsultationButton></div></div><div className="our-team-revision__media" data-revision-media><TeamImage src={revision.image || hero.image} alt={revision.imageAlt || 'Specialist surgeon examining medical scans for revision planning'} /></div></div></section>

    <section className="our-team-hospital"><div className="stitch-container our-team-hospital__grid"><div className="our-team-hospital__media"><TeamImage src={data.hospital.image || data.hospitalImage || hero.image} alt={data.hospital.imageAlt || 'Modern surgical theater at City International Hospital'} /></div><div><Hospital size={34} aria-hidden="true" /><span className="stitch-kicker">{data.hospital.eyebrow}</span><h2>{data.hospital.title}</h2><p>{data.hospital.description}</p><ul>{data.hospital.proofItems.map(item => <li key={item}><CheckCircle2 size={16} aria-hidden="true" />{item}</li>)}</ul></div></div></section>

    <section className="our-team-international"><div className="stitch-container our-team-international__grid"><div><span className="stitch-kicker">{international.eyebrow}</span><h2>{international.title}</h2><p className="stitch-lead">{international.description}</p><p className="our-team-review-label">What you can provide for preliminary review:</p><ul>{(international.steps.length ? international.steps : reviewItems.map(title => ({ title }))).map(item => <li key={item.title}><CheckCircle2 size={16} aria-hidden="true" />{item.title}</li>)}</ul><blockquote>&quot;Your trip should begin with information — not uncertainty.&quot;</blockquote><p className="our-team-international__note">Note: Remote consultation supports preliminary planning but does not replace the in-person examination required before a final surgical decision.</p><div className="stitch-actions"><ConsultationButton>Request an Online Consultation</ConsultationButton><a className="stitch-link" href="#consultation">International Patient Guide <ArrowRight size={17} /></a></div></div><div className="our-team-international__media"><TeamImage src={data.internationalImage || hero.image} alt="Dr. Maris conducting a remote patient consultation" /></div></div></section>

    <FAQSection
      data={{
        blockType: 'faq',
        id: 0,
        title: data.faq.title,
        subtitle: data.faq.eyebrow,
        backgroundImage: data.faq.backgroundImage,
        layout: 'left',
        questions: data.faq.items.map((item, index) => ({ id: index, question: item.question, answer: item.answer })),
      }}
      layout="left"
      maxWidthClassName="max-w-3xl"
    />
  </main>
}
