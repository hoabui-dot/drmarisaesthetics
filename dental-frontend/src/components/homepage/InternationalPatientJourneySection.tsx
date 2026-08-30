'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useInternationalPatientJourneyMotion } from '@/src/hooks/useInternationalPatientJourneyMotion'

const doctorImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTeb4K7icJOejOCNmhoM1L_97JimcI6Qtyot9YzMr51gD3_D096TT551datl7elzq4TGEQz-bEMf8KBAUaMGPSuRx-gXA7LQDE6AxQJeik8HAprXx5WLc0J8tMTKQRuN5tTfMsno6xTgx-ocAouFxiXWQRiCATFFvjwsLvpxprL1m7V9S-mUEXDc3L_aWSsmNthvE245NzLwUH0W-RYhnjXBO7LUB-OAqjk5SNLSZFeUzTH3V751D0'
const steps = [
  ['Send Your Case', 'Submit your medical history, surgical goals, high-resolution photographs, and relevant details for a preliminary clinical review.', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85', 'International patient preparing medical information for remote surgical review'],
  ['Video Consultation', 'A direct one-to-one consultation with Dr. Maris to discuss your anatomy, goals, expectations, previous procedures, and surgical considerations.', doctorImage, 'Video consultation with Dr. Maris in a private clinical setting'],
  ['Travel Planning', 'Receive guidance for your medical itinerary, hospital arrangements, recommended accommodation, and appropriate recovery time in Ho Chi Minh City.', 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=85', 'International patient preparing for planned medical travel to Vietnam'],
  ['In-Person Exam', 'Meet Dr. Maris for a complete clinical examination, final anatomical assessment, and required pre-operative testing at City International Hospital.', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85', 'Plastic surgeon conducting an in-person clinical examination'],
  ['Your Procedure', 'Your procedure is performed by Dr. Maris within the medical infrastructure of City International Hospital.', 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=85', 'Plastic surgery team inside a modern operating theatre'],
  ['Recovery & Follow-Up', 'Receive structured post-operative care and a long-term follow-up plan designed to support safe healing and recovery.', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85', 'Patient receiving calm post-operative follow-up care'],
] as const

export function InternationalPatientJourneySection() {
  const ref = useRef<HTMLElement>(null)
  useInternationalPatientJourneyMotion(ref)
  return <section ref={ref} id="journey" className="stitch-section stitch-surface stitch-journey" data-journey-module>
    <div className="stitch-journey-pin" data-journey-pin><div className="stitch-journey-intro"><h2 data-journey-intro>From inquiry to confident recovery.</h2></div><div className="stitch-journey-layout"><aside className="stitch-journey-indicator" aria-label="International patient journey progress"><div className="stitch-journey-indicator__rail"><span className="stitch-journey-indicator__track" aria-hidden="true" /><span className="stitch-journey-indicator__progress" data-journey-progress aria-hidden="true" />{steps.map(([title], index) => <span className="stitch-journey-indicator__step" data-journey-indicator key={title}><b>0{index + 1}</b><span>{title}</span></span>)}</div></aside><div className="stitch-journey-content"><div className="stitch-journey-copy">{steps.map(([title, copy, image, alt], index) => <article key={title} data-journey-step><span className="stitch-journey-number" aria-hidden="true">0{index + 1}</span><div className="stitch-journey-mobile-image"><Image src={image} alt={alt} fill sizes="100vw" className="object-cover" unoptimized /></div><h3>{title}</h3><p>{copy}</p></article>)}</div></div><div className="stitch-journey-visual"><div className="stitch-journey-visual__frame">{steps.map(([title, , image, alt]) => <div className="stitch-journey-visual__image" data-journey-visual key={title}><Image src={image} alt={alt} fill sizes="(max-width: 900px) 100vw, 48vw" className="object-cover" unoptimized /></div>)}</div><span className="stitch-journey-visual__caption">DR. MARIS AESTHETICS / HO CHI MINH CITY</span></div></div></div>
  </section>
}
