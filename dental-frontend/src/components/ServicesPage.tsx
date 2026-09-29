'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import type { WebsiteCategory } from '@/src/types/strapi'
import { ConsultationCtaSection } from '@/src/components/blocks/ConsultationCtaSection'

export type ServiceListItem = {
  id: number
  title: string
  slug: string
  description?: string
  categoryId?: string
  imageUrl?: string | null
  imageAlt?: string
}

const ALL_SERVICES_FILTER_KEY = 'all'
const PAGE_SIZE = 6

export function ServicesPage({ services: initialServices, total: initialTotal, categories = [] }: {
  services: ServiceListItem[]
  total: number
  categories?: WebsiteCategory[]
}) {
  const reduceMotion = Boolean(useReducedMotion())
  const [filter, setFilter] = useState(ALL_SERVICES_FILTER_KEY)
  const [page, setPage] = useState(1)
  const [services, setServices] = useState(initialServices)
  const [total, setTotal] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })
    if (filter !== ALL_SERVICES_FILTER_KEY) params.set('category', filter)
    setLoading(true)
    fetch(`/api/services?${params}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Service listing request failed')
        return response.json()
      })
      .then((data) => {
        setServices(Array.isArray(data.items) ? data.items : [])
        setTotal(Number(data.total) || 0)
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') console.error('[Services] Could not update listing', error)
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [filter, page])

  const categoryLabels = useMemo(() => new Map(categories.map((category) => [category.id, category.label])), [categories])

  const selectFilter = (categoryId: string) => {
    setFilter(categoryId)
    setPage(1)
  }

  return <MotionConfig reducedMotion="user">
    <main className="stitch-page results-page services-results-page">
      <section className="results-page__hero" data-results-entrance>
        <div className="stitch-container">
          <span className="results-page__eyebrow">SURGEON-LED SERVICES · DR. MARIS AESTHETICS</span>
          <h2><span className="results-page__title-mask"><span>Plastic Surgery Services</span></span></h2>
          <p className="results-page__editorial-lead">Surgeon-led procedures planned around anatomy, safety and long-term recovery.</p>
          <p className="results-page__supporting-copy">Explore the procedures Dr. Maris performs with direct clinical involvement from assessment through follow-up.</p>
          <div className="results-filters" role="group" aria-label="Filter services">
            <button type="button" className={filter === ALL_SERVICES_FILTER_KEY ? 'is-active' : ''} aria-pressed={filter === ALL_SERVICES_FILTER_KEY} onClick={() => selectFilter(ALL_SERVICES_FILTER_KEY)}>
              {filter === ALL_SERVICES_FILTER_KEY && <motion.span layoutId="services-active-filter" className="results-filters__active-surface" transition={reduceMotion ? { duration: 0 } : { duration: .3, ease: 'easeOut' }} />}
              <span className="results-filters__label">ALL SERVICES</span>
            </button>
            {categories.map((category) => <button key={category.id} type="button" className={filter === category.id ? 'is-active' : ''} aria-pressed={filter === category.id} onClick={() => selectFilter(category.id)}>
              {filter === category.id && <motion.span layoutId="services-active-filter" className="results-filters__active-surface" transition={reduceMotion ? { duration: 0 } : { duration: .3, ease: 'easeOut' }} />}
              {category.icon?.url ? <Image src={category.icon.url} alt="" width={16} height={16} className="results-filters__icon" unoptimized /> : null}
              <span className="results-filters__label">{category.label}</span>
            </button>)}
          </div>
        </div>
      </section>

      <section className="results-gallery results-gallery--filtered-list" aria-label="Plastic surgery services" aria-busy={loading}>
        <motion.div layout className="results-grid" transition={reduceMotion ? { duration: 0 } : { layout: { duration: .35, ease: 'easeOut' } }}>
          <AnimatePresence initial={false}>
            {services.map((service) => <motion.article key={service.id} layout className="result-card services-result-card" initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }} transition={{ duration: reduceMotion ? 0 : .3 }}>
              <Link href={`/services/${service.slug}`} className="blog-result-card__link">
                <div className="result-pair result-pair--single blog-result-card__image">{service.imageUrl ? <Image src={service.imageUrl} alt={service.imageAlt || service.title} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" unoptimized /> : null}</div>
                <div className="result-card__body">
                  <div className="result-card__heading"><div><span className="blog-result-card__category">{service.categoryId ? categoryLabels.get(service.categoryId) || `Category ${service.categoryId}` : 'Clinical service'}</span><h3>{service.title}</h3><p>{service.description || 'Explore a personalized surgical plan with Dr. Maris.'}</p></div></div>
                  <span className="result-card__action">Explore service <ArrowRight size={15} /></span>
                </div>
              </Link>
            </motion.article>)}
          </AnimatePresence>
        </motion.div>
        {!services.length ? <p className="results-empty">No services are available in this category.</p> : null}
        {pageCount > 1 ? <nav className="listing-pagination" aria-label="Service pages">
          <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button>
          <span>Page {page} of {pageCount}</span>
          <button type="button" disabled={page >= pageCount || loading} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Next</button>
        </nav> : null}
      </section>
      <ConsultationCtaSection id="consultation-cta" />
    </main>
  </MotionConfig>
}
