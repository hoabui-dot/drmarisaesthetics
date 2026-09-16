'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useMemo, useState } from 'react'
import { ConsultationCtaSection } from '@/src/components/blocks/ConsultationCtaSection'

export type BlogListItem = {
  id: number
  title: string
  slug: string
  category?: string
  metaDescription?: string
  publishedAt?: string
  imageUrl?: string | null
  imageAlt?: string
}

const formatDate = (value?: string) => value
  ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
  : '—'

export function BlogResultsPage({ posts }: { posts: BlogListItem[] }) {
  const reduceMotion = Boolean(useReducedMotion())
  const [filter, setFilter] = useState('All Articles')
  const categories = useMemo(() => ['All Articles', ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean) as string[]))], [posts])
  const filteredPosts = useMemo(() => filter === 'All Articles' ? posts : posts.filter((post) => post.category === filter), [filter, posts])

  return <MotionConfig reducedMotion="user">
    <main className="stitch-page results-page blog-results-page">
      <section className="results-page__hero" data-results-entrance>
        <div className="stitch-container">
          <h2><span className="results-page__title-mask"><span>Patient Planning Journal</span></span></h2>
          <p className="results-page__editorial-lead">Clear, clinically grounded guidance for informed decisions and confident recovery.</p>
          <p className="results-page__supporting-copy">Explore surgeon-led perspectives, treatment planning notes and recovery guidance from the Dr. Maris Aesthetics team.</p>
          <div className="results-filters" role="group" aria-label="Filter articles">
            {categories.map((category) => <button key={category} type="button" className={filter === category ? 'is-active' : ''} aria-pressed={filter === category} onClick={() => setFilter(category)}>
              {filter === category && <motion.span layoutId="blog-active-filter" className="results-filters__active-surface" transition={reduceMotion ? { duration: 0 } : { duration: .3, ease: 'easeOut' }} />}
              <span className="results-filters__label">{category}</span>
            </button>)}
          </div>
        </div>
      </section>

      <section className="results-gallery results-gallery--filtered-list" aria-label="Articles">
        <motion.div layout className="results-grid" transition={reduceMotion ? { duration: 0 } : { layout: { duration: .35, ease: 'easeOut' } }}>
          <AnimatePresence initial={false}>
            {filteredPosts.map((post) => <motion.article key={post.id} layout className="result-card blog-result-card" initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }} transition={{ duration: reduceMotion ? 0 : .3 }}>
              <Link href={`/news/${post.slug}`} className="blog-result-card__link">
                <div className="result-pair result-pair--single blog-result-card__image">{post.imageUrl ? <Image src={post.imageUrl} alt={post.imageAlt || post.title} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" unoptimized /> : null}</div>
                <div className="result-card__body">
                  <div className="result-card__heading"><div><span className="blog-result-card__category">{post.category || 'Clinical knowledge'}</span><h3>{post.title}</h3><p>{post.metaDescription || 'Read the clinical guide.'}</p></div><strong>{formatDate(post.publishedAt)}</strong></div>
                  <span className="result-card__action">Read article <ArrowRight size={15} /></span>
                </div>
              </Link>
            </motion.article>)}
          </AnimatePresence>
        </motion.div>
        {!filteredPosts.length ? <p className="results-empty">No published articles are available.</p> : null}
      </section>
      <ConsultationCtaSection id="consultation-cta" />
    </main>
  </MotionConfig>
}
