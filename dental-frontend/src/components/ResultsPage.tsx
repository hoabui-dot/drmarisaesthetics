'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ConsultationCtaSection } from '@/src/components/blocks/ConsultationCtaSection'
import { type ResultCase, type ResultsData } from '@/src/data/results'

function ResultImage({ src, alt }: { src?: string; alt: string }) {
  return src ? <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" unoptimized /> : null
}

function ResultCaseModal({ item, onClose, reduceMotion }: { item: ResultCase; onClose: () => void; reduceMotion: boolean }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button, input, [href], [tabindex]:not([tabindex="-1"])')
      if (!focusable.length) return
      const first = focusable[0]; const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown) }
  }, [onClose])
  return <motion.div className="results-case-modal" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .24 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <motion.div ref={dialogRef} layoutId={`result-card-${item.caseNumber}`} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={`case-title-${item.caseNumber}`} className="results-case-modal__panel" initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: .985, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: .985, y: 12 }} transition={{ duration: reduceMotion ? 0 : .3, ease: [0.22, 1, 0.36, 1] }}>
      <div className="results-case-modal__topline"><span>Case {item.caseNumber}</span><button type="button" onClick={onClose} aria-label="Close case details"><X size={20} /></button></div>
      <div className="results-case-modal__content"><div className="results-case-modal__media results-case-modal__media--static"><ResultImage src={item.image || item.afterImage} alt={item.imageAlt || item.afterAlt || `Before and after result for ${item.title}`} /></div><div className="results-case-modal__details"><span className="results-case-modal__eyebrow">Clinical case record</span><h2 id={`case-title-${item.caseNumber}`}>{item.title}</h2><p>{item.subtitle}</p><dl><div><dt>Patient Profile</dt><dd>{item.profile}</dd></div><div><dt>Recovery</dt><dd>{item.recovery}</dd></div><div><dt>Procedure</dt><dd>{item.title}</dd></div><div><dt>Documentation</dt><dd>Composite before &amp; after view</dd></div></dl><small>Individual results vary. This case is presented for educational context and does not guarantee a specific outcome.</small></div></div>
    </motion.div>
  </motion.div>
}

export function ResultsPage({ data }: { data: ResultsData }) {
  const reduceMotion = Boolean(useReducedMotion()); const pageRef = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState('All Procedures'); const [selectedCase, setSelectedCase] = useState<ResultCase | null>(null); const lastTriggerRef = useRef<HTMLElement | null>(null)
  const [batchSize, setBatchSize] = useState(6); const [visibleCount, setVisibleCount] = useState(6)
  const categories = ['All Procedures', 'Face & Neck', 'Rhinoplasty', 'Breast', 'Body Contouring']
  const categoryFor = (item: ResultCase) => item.category || (/rhinoplasty/i.test(item.title) ? 'Rhinoplasty' : /breast/i.test(item.title) ? 'Breast' : /body|liposuction|abdominoplasty/i.test(item.title) ? 'Body Contouring' : 'Face & Neck')
  const filteredCases = useMemo(() => filter === 'All Procedures' ? data.cases : data.cases.filter((item) => categoryFor(item) === filter), [data.cases, filter])
  const visibleCases = filteredCases.slice(0, visibleCount)

  useEffect(() => {
    const updateBatchSize = () => {
      const nextSize = window.matchMedia('(max-width: 767px)').matches ? 3 : window.matchMedia('(max-width: 1023px)').matches ? 4 : 6
      setBatchSize(nextSize)
      setVisibleCount((current) => Math.max(current, nextSize))
    }
    updateBatchSize()
    window.addEventListener('resize', updateBatchSize)
    return () => window.removeEventListener('resize', updateBatchSize)
  }, [])

  useEffect(() => {
    setVisibleCount(batchSize)
    setSelectedCase(null)
  }, [filter, batchSize])

  useGSAP(() => {
    const section = pageRef.current?.querySelector<HTMLElement>('[data-results-entrance]'); if (!section || reduceMotion) return
    const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 78%', once: true } })
    timeline.fromTo('[data-results-eyebrow]', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .35, ease: 'power3.out' }).fromTo('[data-results-title-line]', { yPercent: 100 }, { yPercent: 0, duration: .62, ease: 'power3.out' }, '-=.12').fromTo('[data-results-lead]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .45, ease: 'power3.out' }, '-=.2').fromTo('[data-results-filters]', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .38, ease: 'power3.out' }, '-=.16').fromTo('[data-result-card]', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .42, stagger: .07, ease: 'power3.out' }, '-=.12')
  }, { scope: pageRef, dependencies: [reduceMotion] })
  useEffect(() => { if (!selectedCase) lastTriggerRef.current?.focus() }, [selectedCase])

  return <MotionConfig reducedMotion="user"><LayoutGroup id="patient-results-gallery"><main ref={pageRef} className="stitch-page results-page">
    <section className="results-page__hero" data-results-entrance><div className="stitch-container"><span className="results-page__eyebrow" data-results-eyebrow>CLINICAL OUTCOMES · DR. MARIS AESTHETICS</span><h2><span className="results-page__title-mask"><span data-results-title-line>{data.title}</span></span></h2><p className="results-page__editorial-lead" data-results-lead>A curated record of surgical outcomes, documented with consistency and clinical context.</p><p className="results-page__supporting-copy">{data.introduction}</p><div className="results-filters" data-results-filters role="group" aria-label="Filter patient results">{categories.map((category) => <button key={category} type="button" className={filter === category ? 'is-active' : ''} aria-pressed={filter === category} onClick={() => setFilter(category)}>{filter === category && <motion.span layoutId="results-active-filter" className="results-filters__active-surface" transition={reduceMotion ? { duration: 0 } : { duration: .3, ease: 'easeOut' }} />}<span className="results-filters__label">{category}</span></button>)}</div></div></section>
    <section className="results-gallery results-gallery--filtered-list" aria-label="Patient results"><motion.div layout className="results-grid" transition={reduceMotion ? { duration: 0 } : { layout: { duration: .35, ease: 'easeOut' } }}><AnimatePresence initial={false}>{visibleCases.filter((item) => item.caseNumber !== selectedCase?.caseNumber).map((item) => <motion.article key={item.caseNumber} layout layoutId={`result-card-${item.caseNumber}`} data-result-card className="result-card" tabIndex={0} role="button" aria-label={`Open case ${item.caseNumber}: ${item.title}`} onClick={(event) => { lastTriggerRef.current = event.currentTarget; setSelectedCase(item) }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); lastTriggerRef.current = event.currentTarget; setSelectedCase(item) } }} initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .985 }} whileHover={reduceMotion ? undefined : { y: -2 }} transition={{ layout: reduceMotion ? { duration: 0 } : { duration: .35, ease: 'easeOut' }, opacity: { duration: reduceMotion ? 0 : .2 }, scale: { duration: reduceMotion ? 0 : .25, ease: 'easeOut' } }}><div className="result-pair result-pair--single"><ResultImage src={item.image || item.afterImage} alt={item.imageAlt || item.afterAlt || `Before and after result for ${item.title}`} /></div><div className="result-card__body"><div className="result-card__heading"><div><h3>{item.title}</h3><p>{item.subtitle}</p></div><strong>Case {item.caseNumber}</strong></div><dl><div><dt>Patient Profile</dt><dd>{item.profile}</dd></div><div><dt>Recovery</dt><dd>{item.recovery}</dd></div></dl><span className="result-card__action">View case <ArrowRight size={15} /></span></div></motion.article>)}</AnimatePresence></motion.div>{visibleCases.length === 0 && <p className="results-empty">No published cases are available for this procedure.</p>}{visibleCases.length < filteredCases.length && <div className="results-load-more"><button type="button" onClick={() => setVisibleCount((current) => Math.min(current + batchSize, filteredCases.length))} aria-label={`Show ${Math.min(batchSize, filteredCases.length - visibleCases.length)} more patient results`}>SHOW MORE RESULTS</button></div>}</section>
    <ConsultationCtaSection id="consultation-cta" />
    <AnimatePresence>{selectedCase && <ResultCaseModal item={selectedCase} onClose={() => setSelectedCase(null)} reduceMotion={reduceMotion} />}</AnimatePresence>
  </main></LayoutGroup></MotionConfig>
}
