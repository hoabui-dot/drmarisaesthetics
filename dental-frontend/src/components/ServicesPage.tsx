'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useMemo, useState } from 'react'
import { ConsultationCtaSection } from '@/src/components/blocks/ConsultationCtaSection'

export type ServiceListItem = {
  id: number
  title: string
  slug: string
  description?: string
  category?: string
  categoryIds?: string[]
  categories?: Array<{ id: string; label: string }>
  imageUrl?: string | null
  imageAlt?: string
}

export type ServiceCategory = { id: string; label: string }

const ALL_SERVICES_FILTER_KEY = '__all_services__'

function serviceCategoryLabels(service: ServiceListItem) {
  const labels = service.categories?.map((category) => category.label).filter(Boolean) || []
  if (labels.length) return labels
  return service.category ? [service.category] : []
}

function serviceCategoryLabel(service: ServiceListItem) {
  return serviceCategoryLabels(service).join(' · ') || 'Clinical service'
}

function getFilterCategories(services: ServiceListItem[], configuredCategories: ServiceCategory[]) {
  if (configuredCategories.length) return configuredCategories

  const categoryMap = new Map<string, { id: string; label: string }>()
  services.forEach((service) => {
    service.categories?.forEach((category) => {
      if (category.id && category.label && !categoryMap.has(category.id)) categoryMap.set(category.id, category)
    })
  })
  return Array.from(categoryMap.values()).sort((a, b) => a.label.localeCompare(b.label))
}

export function ServicesPage({ services, categories: configuredCategories = [] }: { services: ServiceListItem[]; categories?: ServiceCategory[] }) {
  const reduceMotion = Boolean(useReducedMotion())
  const [filter, setFilter] = useState(ALL_SERVICES_FILTER_KEY)
  const categories = useMemo(() => getFilterCategories(services, configuredCategories), [configuredCategories, services])
  const filteredServices = useMemo(
    () => filter === ALL_SERVICES_FILTER_KEY
      ? services
      : services.filter((service) => service.categoryIds?.includes(filter)),
    [filter, services],
  )

  return <MotionConfig reducedMotion="user">
    <main className="stitch-page results-page services-results-page">
      <section className="results-page__hero" data-results-entrance>
        <div className="stitch-container">
          <span className="results-page__eyebrow">SURGEON-LED SERVICES · DR. MARIS AESTHETICS</span>
          <h2><span className="results-page__title-mask"><span>Plastic Surgery Services</span></span></h2>
          <p className="results-page__editorial-lead">Surgeon-led procedures planned around anatomy, safety and long-term recovery.</p>
          <p className="results-page__supporting-copy">Explore the procedures Dr. Maris performs with direct clinical involvement from assessment through follow-up.</p>
          <div className="results-filters" role="group" aria-label="Filter services">
            <button type="button" className={filter === ALL_SERVICES_FILTER_KEY ? 'is-active' : ''} aria-pressed={filter === ALL_SERVICES_FILTER_KEY} onClick={() => setFilter(ALL_SERVICES_FILTER_KEY)}>
              {filter === ALL_SERVICES_FILTER_KEY && <motion.span layoutId="services-active-filter" className="results-filters__active-surface" transition={reduceMotion ? { duration: 0 } : { duration: .3, ease: 'easeOut' }} />}
              <span className="results-filters__label">ALL SERVICES</span>
            </button>
            {categories.map((category) => <button key={category.id} type="button" className={filter === category.id ? 'is-active' : ''} aria-pressed={filter === category.id} onClick={() => setFilter(category.id)}>
              {filter === category.id && <motion.span layoutId="services-active-filter" className="results-filters__active-surface" transition={reduceMotion ? { duration: 0 } : { duration: .3, ease: 'easeOut' }} />}
              <span className="results-filters__label">{category.label}</span>
            </button>)}
          </div>
        </div>
      </section>

      <section className="results-gallery results-gallery--filtered-list" aria-label="Plastic surgery services">
        <motion.div layout className="results-grid" transition={reduceMotion ? { duration: 0 } : { layout: { duration: .35, ease: 'easeOut' } }}>
          <AnimatePresence initial={false}>
            {filteredServices.map((service) => <motion.article key={service.id} layout className="result-card services-result-card" initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }} transition={{ duration: reduceMotion ? 0 : .3 }}>
              <Link href={`/services/${service.slug}`} className="blog-result-card__link">
                <div className="result-pair result-pair--single blog-result-card__image">{service.imageUrl ? <Image src={service.imageUrl} alt={service.imageAlt || service.title} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" unoptimized /> : null}</div>
                <div className="result-card__body">
                  <div className="result-card__heading"><div><span className="blog-result-card__category">{serviceCategoryLabel(service)}</span><h3>{service.title}</h3><p>{service.description || 'Explore a personalized surgical plan with Dr. Maris.'}</p></div></div>
                  <span className="result-card__action">Explore service <ArrowRight size={15} /></span>
                </div>
              </Link>
            </motion.article>)}
          </AnimatePresence>
        </motion.div>
        {!filteredServices.length ? <p className="results-empty">No services are available in this category.</p> : null}
      </section>
      <ConsultationCtaSection id="consultation-cta" />
    </main>
  </MotionConfig>
}
