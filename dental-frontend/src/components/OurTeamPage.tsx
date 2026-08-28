'use client'

import Image from 'next/image'
import { ArrowRight, CalendarDays, CheckCircle2 } from 'lucide-react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'
import { ourTeamMockData, type OurTeamData } from '@/src/data/our-team'

function TeamImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 45vw" className="object-cover" unoptimized />
}

function ConsultationButton({ children = 'REQUEST AN ONLINE CONSULTATION' }: { children?: React.ReactNode }) {
  const { open } = useBookingModal()
  return <button type="button" onClick={open} className="stitch-button stitch-button--dark"><CalendarDays size={16} />{children}</button>
}

export function OurTeamPage({ data = ourTeamMockData }: { data?: OurTeamData }) {
  const { hero, surgicalCare, revision, internationalPatients, journey, consultation, faq } = data
  return <main className="stitch-page stitch-our-team">
    <section className="stitch-home-hero"><div className="stitch-home-hero__inner">
      <div className="stitch-home-hero__copy"><span className="stitch-kicker"><i /> {hero.eyebrow}</span><h1>{hero.title}</h1>{hero.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<div className="stitch-actions"><ConsultationButton /><a className="stitch-link" href="#international-journey">Explore Surgical Procedures <ArrowRight size={17} /></a></div><div className="stitch-proof-row"><span>Direct Surgeon Care</span><b>|</b><span>Hospital-Based Surgery</span><b>|</b><span>International Patients</span><b>|</b><span>Revision Surgery</span></div></div>
      <div className="stitch-home-hero__image"><div className="stitch-image-wash" /><TeamImage src={hero.image} alt={hero.imageAlt} /></div>
    </div></section>

    <section className="stitch-section"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">{surgicalCare.title}</span><h2>{surgicalCare.heading}</h2>{surgicalCare.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<div className="stitch-process-line">{surgicalCare.steps.map((step, index) => <div key={step}><b>0{index + 1}</b><span>{step}</span></div>)}</div><a className="stitch-link" href="#consultation">Meet Dr. Maris <ArrowRight size={17} /></a></div><div className="stitch-portrait"><TeamImage src={surgicalCare.image} alt={surgicalCare.imageAlt} /><div className="stitch-stat"><strong>{surgicalCare.experience}</strong><span>{surgicalCare.experienceLabel}</span></div></div></div></section>

    <section id="revision" className="stitch-section stitch-dark"><div className="stitch-container stitch-grid stitch-grid--two"><div><span className="stitch-kicker">{revision.eyebrow}</span><h2>{revision.title}</h2><h3>{revision.heading}</h3><p>{revision.description}</p><div className="stitch-callout"><strong>{revision.calloutTitle}</strong><p>{revision.calloutDescription}</p><a className="stitch-link stitch-link--light" href="#consultation">Request a Revision Assessment <ArrowRight size={17} /></a></div></div><div><h3 className="stitch-light-heading">Common Revision Concerns We Address</h3><ul className="stitch-check-list">{revision.concerns.map(concern => <li key={concern.title}><CheckCircle2 size={17} /><span><strong>{concern.title}</strong>{concern.description}</span></li>)}</ul></div></div></section>

    <section className="stitch-section stitch-surface"><div className="stitch-container"><div className="stitch-section-heading"><span className="stitch-kicker">{internationalPatients.eyebrow}</span><h2>{internationalPatients.title}</h2><p>{internationalPatients.description}</p></div><div className="stitch-journey-grid">{internationalPatients.steps.map(step => <article key={step.number}><b>{step.number}</b><h3>{step.title}</h3><p>{step.description}</p></article>)}</div><div className="stitch-actions"><a className="stitch-button stitch-button--dark" href="#international-journey">Plan Your Surgery in Vietnam</a><ConsultationButton /></div></div></section>

    <section id="international-journey" className="stitch-section"><div className="stitch-container"><div className="stitch-section-heading stitch-section-heading--center"><span className="stitch-kicker">{journey.eyebrow}</span><h2>{journey.title}</h2><p>{journey.description}</p></div><div className="stitch-journey-grid">{journey.steps.map(step => <article key={step.number}><b>{step.number}</b><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></div></section>

    <section id="consultation" className="stitch-section stitch-consultation"><div className="stitch-container stitch-consultation__inner"><div className="stitch-section-heading stitch-section-heading--center"><h2>{consultation.title}</h2><p>{consultation.description}</p></div><form className="stitch-form" onSubmit={event => event.preventDefault()}><div className="stitch-form-grid">{[['name', consultation.fields.name, 'text'], ['email', consultation.fields.email, 'email'], ['phone', consultation.fields.phone, 'tel']].map(([key, label, type]) => <label key={key}>{label}<input name={key} type={type} /></label>)}<label>{consultation.fields.interest}<select name="interest"><option value="">Select a procedure</option>{consultation.interests.map(interest => <option key={interest}>{interest}</option>)}</select></label></div><label>{consultation.fields.description}<textarea name="description" rows={4} /></label><div className="stitch-form-actions"><button type="submit" className="stitch-button stitch-button--dark">Submit Your Case for Review</button><a className="stitch-link" href="https://wa.me/84123456789"><span>💬</span>{consultation.whatsappLabel}</a></div></form></div></section>

    <section className="stitch-section stitch-surface"><div className="stitch-container"><div className="stitch-section-heading"><span className="stitch-kicker">{faq.eyebrow}</span><h2>{faq.title}</h2></div><div className="stitch-faq-grid">{faq.items.map(item => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</div></div></section>
  </main>
}
