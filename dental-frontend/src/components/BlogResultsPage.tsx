'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import type { WebsiteCategory } from '@/src/types/strapi'
import { ConsultationCtaSection } from '@/src/components/blocks/ConsultationCtaSection'

export type BlogListItem = {
  id: number
  title: string
  slug: string
  categoryId?: string
  metaDescription?: string
  publishedAt?: string
  imageUrl?: string | null
  imageAlt?: string
}

const ALL_ARTICLES_FILTER_KEY = 'all'
const PAGE_SIZE = 6
const formatDate = (value?: string) => value
  ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
  : '—'

export function BlogResultsPage({ posts: initialPosts, total: initialTotal, categories = [] }: {
  posts: BlogListItem[]
  total: number
  categories?: WebsiteCategory[]
}) {
  const reduceMotion = Boolean(useReducedMotion())
  const [filter, setFilter] = useState(ALL_ARTICLES_FILTER_KEY)
  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState(initialPosts)
  const [total, setTotal] = useState(initialTotal)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })
    if (filter !== ALL_ARTICLES_FILTER_KEY) params.set('category', filter)
    if (search) params.set('search', search)
    setLoading(true)
    fetch(`/api/news?${params}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Article listing request failed')
        return response.json()
      })
      .then((data) => {
        setPosts(Array.isArray(data.items) ? data.items : [])
        setTotal(Number(data.total) || 0)
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') console.error('[News] Could not update listing', error)
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [filter, page, search])

  const categoryLabels = useMemo(() => new Map(categories.map((category) => [category.id, category.label])), [categories])
  const selectFilter = (categoryId: string) => { setFilter(categoryId); setPage(1) }
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearch(searchInput.trim())
    setPage(1)
  }

  return <MotionConfig reducedMotion="user">
    <main className="stitch-page results-page blog-results-page">
      <section className="results-page__hero" data-results-entrance>
        <div className="stitch-container">
          <h2><span className="results-page__title-mask"><span>Patient Planning Journal</span></span></h2>
          <p className="results-page__editorial-lead">Clear, clinically grounded guidance for informed decisions and confident recovery.</p>
          <p className="results-page__supporting-copy">Explore surgeon-led perspectives, treatment planning notes and recovery guidance from the Dr. Maris Aesthetics team.</p>
          <div className="results-filters" role="group" aria-label="Filter articles">
            <button type="button" className={filter === ALL_ARTICLES_FILTER_KEY ? 'is-active' : ''} aria-pressed={filter === ALL_ARTICLES_FILTER_KEY} onClick={() => selectFilter(ALL_ARTICLES_FILTER_KEY)}>
              {filter === ALL_ARTICLES_FILTER_KEY && <motion.span layoutId="blog-active-filter" className="results-filters__active-surface" transition={reduceMotion ? { duration: 0 } : { duration: .3, ease: 'easeOut' }} />}
              <span className="results-filters__label">All Articles</span>
            </button>
            {categories.map((category) => <button key={category.id} type="button" className={filter === category.id ? 'is-active' : ''} aria-pressed={filter === category.id} onClick={() => selectFilter(category.id)}>
              {filter === category.id && <motion.span layoutId="blog-active-filter" className="results-filters__active-surface" transition={reduceMotion ? { duration: 0 } : { duration: .3, ease: 'easeOut' }} />}
              {category.icon?.url ? <Image src={category.icon.url} alt="" width={16} height={16} className="results-filters__icon" unoptimized /> : null}
              <span className="results-filters__label">{category.label}</span>
            </button>)}
          </div>
          <form className="listing-search" onSubmit={submitSearch} role="search">
            <label className="sr-only" htmlFor="news-article-search">Search articles</label>
            <input id="news-article-search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search articles" />
            <button type="submit" aria-label="Search articles"><Search size={17} /> Search</button>
          </form>
        </div>
      </section>

      <section className="results-gallery results-gallery--filtered-list" aria-label="Articles" aria-busy={loading}>
        <motion.div layout className="results-grid" transition={reduceMotion ? { duration: 0 } : { layout: { duration: .35, ease: 'easeOut' } }}>
          <AnimatePresence initial={false}>
            {posts.map((post) => <motion.article key={post.id} layout className="result-card blog-result-card" initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }} transition={{ duration: reduceMotion ? 0 : .3 }}>
              <Link href={`/news/${post.slug}`} className="blog-result-card__link">
                <div className="result-pair result-pair--single blog-result-card__image">{post.imageUrl ? <Image src={post.imageUrl} alt={post.imageAlt || post.title} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover" unoptimized /> : null}</div>
                <div className="result-card__body">
                  <div className="result-card__heading"><div><span className="blog-result-card__category">{post.categoryId ? categoryLabels.get(post.categoryId) || `Category ${post.categoryId}` : 'Clinical knowledge'}</span><h3>{post.title}</h3><p>{post.metaDescription || 'Read the clinical guide.'}</p></div><strong>{formatDate(post.publishedAt)}</strong></div>
                  <span className="result-card__action">Read article <ArrowRight size={15} /></span>
                </div>
              </Link>
            </motion.article>)}
          </AnimatePresence>
        </motion.div>
        {!posts.length ? <p className="results-empty">No published articles are available.</p> : null}
        {pageCount > 1 ? <nav className="listing-pagination" aria-label="Article pages">
          <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button>
          <span>Page {page} of {pageCount}</span>
          <button type="button" disabled={page >= pageCount || loading} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Next</button>
        </nav> : null}
      </section>
      <ConsultationCtaSection id="consultation-cta" />
    </main>
  </MotionConfig>
}
