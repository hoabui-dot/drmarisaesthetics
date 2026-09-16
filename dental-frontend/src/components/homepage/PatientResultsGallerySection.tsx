'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { resultsMockData } from '@/src/data/results'
import type { ResultsData } from '@/src/data/results'
import type { HomepageSectionContent } from '@/src/types/homepage-editorial'
import { usePatientResultsGalleryMotion } from '@/src/hooks/usePatientResultsGalleryMotion'

function ResultImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill sizes="(max-width: 900px) 86vw, 40vw" className="object-cover" unoptimized />
}

export function PatientResultsGallerySection({ content, results }: { content?: HomepageSectionContent | null; results?: ResultsData | null }) {
  const ref = useRef<HTMLElement>(null)
  usePatientResultsGalleryMotion(ref)
  const badge = typeof content?.badge === 'string' && content.badge.trim() ? content.badge.trim() : ''
  const title = typeof content?.title === 'string' && content.title.trim()
    ? content.title
    : 'Results are individual. Planning is personal.'
  const subtitle = typeof content?.subtitle === 'string' && content.subtitle.trim() ? content.subtitle : ''
  const cases = [...(results?.cases || resultsMockData.cases)]
    .sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })
    .slice(0, 6)
  return <section ref={ref} id="results" className="stitch-section stitch-results-preview" data-results-module>
    <div className="stitch-results-pin" data-results-pin><div className="stitch-container"><div className="stitch-section-heading stitch-results-heading">{badge ? <span className="stitch-kicker">{badge}</span> : null}<h2 className="stitch-editorial-lead">{title}</h2>{subtitle ? <p className="stitch-lead">{subtitle}</p> : null}</div><div className="stitch-results-gallery" data-results-gallery><div className="stitch-results-gallery__track" data-results-track>{cases.map((item) => <article className="stitch-results-card" key={item.caseNumber}><div className="stitch-results-feature__image"><ResultImage src={item.image || item.afterImage || ''} alt={item.imageAlt || item.afterAlt || `Composite before and after result for ${item.title}`} /></div><div className="stitch-results-feature__meta"><span>Case {item.caseNumber}</span><h3>{item.title}</h3><p>{item.subtitle}</p></div></article>)}</div></div></div></div>
  </section>
}
