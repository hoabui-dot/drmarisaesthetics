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
  imageUrl?: string | null
  imageAlt?: string
}

const categories = ['All Services', 'Face & Neck', 'Breast', 'Body Contouring', 'Other']

function serviceCategory(service: ServiceListItem) {
  if (service.category) return service.category
  if (/breast/i.test(service.title)) return 'Breast'
  if (/buttock|liposuction|gastric|labiaplasty/i.test(service.title)) return 'Body Contouring'
  if (/rhinoplasty|blepharoplasty|facelift|neck|face/i.test(service.title)) return 'Face & Neck'
  return 'Other'
}

export function ServicesPage({ services }: { services: ServiceListItem[] }) {
  const reduceMotion = Boolean(useReducedMotion())
  const [filter, setFilter] = useState('All Services')
  const filteredServices = useMemo(
    () => filter === 'All Services' ? services : services.filter((service) => serviceCategory(service) === filter),
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
            {categories.map((category) => <button key={category} type="button" className={filter === category ? 'is-active' : ''} aria-pressed={filter === category} onClick={() => setFilter(category)}>
              {filter === category && <motion.span layoutId="services-active-filter" className="results-filters__active-surface" transition={reduceMotion ? { duration: 0 } : { duration: .3, ease: 'easeOut' }} />}
              <span className="results-filters__label">{category}</span>
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
                  <div className="result-card__heading"><div><span className="blog-result-card__category">{serviceCategory(service)}</span><h3>{service.title}</h3><p>{service.description || 'Explore a personalized surgical plan with Dr. Maris.'}</p></div></div>
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
