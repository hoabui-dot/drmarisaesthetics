'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { resultsMockData } from '@/src/data/results'
import { usePatientResultsGalleryMotion } from '@/src/hooks/usePatientResultsGalleryMotion'

function ResultImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill sizes="(max-width: 900px) 86vw, 40vw" className="object-cover" unoptimized />
}

export function PatientResultsGallerySection() {
  const ref = useRef<HTMLElement>(null)
  usePatientResultsGalleryMotion(ref)
  return <section ref={ref} id="results" className="stitch-section stitch-results-preview" data-results-module>
    <div className="stitch-results-pin" data-results-pin><div className="stitch-container"><div className="stitch-section-heading stitch-results-heading"><h2 className="stitch-editorial-lead">Results are individual. Planning is personal.</h2></div><div className="stitch-results-gallery" data-results-gallery><div className="stitch-results-gallery__track" data-results-track>{resultsMockData.cases.map((item) => <article className="stitch-results-card" key={item.caseNumber}><div className="stitch-results-feature__image"><ResultImage src={item.image || item.afterImage || ''} alt={item.imageAlt || item.afterAlt || `Composite before and after result for ${item.title}`} /></div><div className="stitch-results-feature__meta"><span>Case {item.caseNumber}</span><h3>{item.title}</h3><p>{item.subtitle}</p></div></article>)}</div></div></div></div>
  </section>
}
