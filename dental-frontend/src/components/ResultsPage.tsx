'use client'

import Image from 'next/image'
import { ArrowRight, Info } from 'lucide-react'
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext'
import { type ResultsData } from '@/src/data/results'
import { useMemo, useState } from 'react'

function ResultImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" unoptimized />
}

export function ResultsPage({ data }: { data: ResultsData }) {
  const { open } = useBookingModal()
  const [filter, setFilter] = useState('All Procedures')
  const categoryFor = (item: ResultsData['cases'][number]) => item.category || (/rhinoplasty/i.test(item.title) ? 'Rhinoplasty' : /breast/i.test(item.title) ? 'Breast' : /body|liposuction|abdominoplasty/i.test(item.title) ? 'Body Contouring' : 'Face & Neck')
  const categories = useMemo(() => ['All Procedures', ...new Set(data.cases.map(categoryFor))], [data.cases])
  const visibleCases = filter === 'All Procedures' ? data.cases : data.cases.filter((item) => categoryFor(item) === filter)
  return <main className="stitch-page results-page">
    <section className="results-intro"><div className="stitch-container"><div className="results-intro__rule" aria-hidden="true" /><h1>{data.title}</h1><p>{data.introduction}</p><div className="results-filters" role="group" aria-label="Filter patient results">{categories.map((category) => <button key={category} type="button" className={filter === category ? 'is-active' : ''} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div></div></section>
    <section className="results-gallery"><div className="results-grid">{visibleCases.map(item => <article key={item.caseNumber} className="result-card"><div className="result-pair"><div><ResultImage src={item.beforeImage} alt={item.beforeAlt} /><span>Before</span></div><div><ResultImage src={item.afterImage} alt={item.afterAlt} /><span>After</span></div></div><div className="result-card__body"><div className="result-card__heading"><div><h2>{item.title}</h2><p>{item.subtitle}</p></div><strong>Case {item.caseNumber}</strong></div><dl><div><dt>Patient Profile</dt><dd>{item.profile}</dd></div><div><dt>Recovery</dt><dd>{item.recovery}</dd></div></dl></div></article>)}</div>{visibleCases.length === 0 && <p className="results-empty">No published cases are available for this procedure.</p>}</section>
    <section className="results-patient-image-disclaimer" aria-labelledby="patient-image-disclaimer-title">
      <div className="stitch-container">
        <Info size={22} aria-hidden="true" />
        <h2 id="patient-image-disclaimer-title">{data.disclaimerLabel}</h2>
        <p>{data.disclaimer}</p>
      </div>
    </section>
    <section className="results-cta"><div className="stitch-container"><div><h2>{data.ctaTitle}</h2><p>{data.ctaDescription}</p></div><button type="button" onClick={open}>Book a Consultation <ArrowRight size={20} /></button></div></section>
  </main>
}
