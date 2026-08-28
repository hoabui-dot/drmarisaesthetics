'use client'

import Image from 'next/image'
import { ArrowRight, ChevronDown, Info } from 'lucide-react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'
import { resultsMockData, type ResultsData } from '@/src/data/results'

function ResultImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" unoptimized />
}

export function ResultsPage({ data = resultsMockData }: { data?: ResultsData }) {
  const { open } = useBookingModal()
  return <main className="stitch-page results-page">
    <section className="results-intro"><div className="stitch-container"><h1>{data.title}</h1><p>{data.introduction}</p></div></section>
    <section className="results-gallery"><div className="results-grid">{data.cases.map(item => <article key={item.caseNumber} className="result-card"><div className="result-pair"><div><ResultImage src={item.beforeImage} alt={item.beforeAlt} /><span>Before</span></div><div><ResultImage src={item.afterImage} alt={item.afterAlt} /><span>After</span></div></div><div className="result-card__body"><div className="result-card__heading"><div><h2>{item.title}</h2><p>{item.subtitle}</p></div><strong>Case {item.caseNumber}</strong></div><dl><div><dt>Patient Profile</dt><dd>{item.profile}</dd></div><div><dt>Recovery</dt><dd>{item.recovery}</dd></div></dl></div></article>)}</div><div className="results-load-more"><button type="button">Load Additional Cases <ChevronDown size={18} /></button></div></section>
    <section className="results-disclaimer"><div className="stitch-container"><Info size={22} /><span>{data.disclaimerLabel}</span><p>{data.disclaimer}</p></div></section>
    <section className="results-cta"><div className="stitch-container"><div><h2>{data.ctaTitle}</h2><p>{data.ctaDescription}</p></div><button type="button" onClick={open}>Book a Consultation <ArrowRight size={20} /></button></div></section>
  </main>
}
