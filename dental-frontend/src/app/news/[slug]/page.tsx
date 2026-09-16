import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { apiClient } from '@/src/lib/api/client'
import { ServiceContentRenderer } from '@/src/components/services/ServiceContentRenderer'
import { ServiceDetailSidebar } from '@/src/components/services/ServiceDetailSidebar'
import { ServiceFaqSection, type ServiceFaqData } from '@/src/components/services/ServiceFaqSection'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'

type MediaValue = { url?: string; alternativeText?: string; attributes?: { url?: string; alternativeText?: string }; data?: { attributes?: { url?: string; alternativeText?: string }; url?: string } }
type BetterBlockChild = { text?: string; children?: BetterBlockChild[] }
type BetterBlock = { type?: string; level?: number; children?: BetterBlockChild[] }
type Blog = { id: number; title: string; slug: string; category?: string; metaDescription?: string; coverImage?: MediaValue; contentBetterBlocks?: BetterBlock[]; faq?: ServiceFaqData | null; publishedAt?: string; createdAt?: string; seo?: unknown }

const mediaUrl = (value?: MediaValue) => {
  const media = value?.data?.attributes || value?.data || value?.attributes || value
  if (!media || typeof media !== 'object' || typeof media.url !== 'string') return null
  return media.url.startsWith('/uploads/') ? `/api/strapi-media${media.url}` : media.url
}

const textFromNodes = (nodes?: BetterBlockChild[]): string => (nodes || []).map((node) => node.text || textFromNodes(node.children)).join('').trim()
const sectionId = (slug: string, index: number) => `blog-${slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'article'}-section-${index + 1}`
const contentId = (slug: string) => sectionId(slug, 0).replace(/-section-1$/, '-content')

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const response = await apiClient<{ data?: any[] }>('/api/blogs', {
      params: { 'filters[slug][$eq]': slug, 'populate[coverImage]': 'true', 'populate[seo]': 'true', 'populate[faq][populate][items]': 'true' },
      tags: ['blogs', `blog-${slug}`],
    })
    const entry = response.data?.[0]
    if (!entry) return null
    return { id: entry.id, ...(entry.attributes || entry) }
  } catch {
    return null
  }
}

async function getBlogSlugs() {
  try {
    const response = await apiClient<{ data?: any[] }>('/api/blogs', { params: { 'fields[0]': 'slug' }, tags: ['blogs'] })
    return (response.data || []).map((entry) => (entry.attributes || entry).slug).filter(Boolean)
  } catch { return [] }
}

async function getLatestBlogs(currentSlug: string): Promise<Blog[]> {
  try {
    const response = await apiClient<{ data?: any[] }>('/api/blogs', { params: { 'populate[coverImage]': 'true', sort: 'publishedAt:desc', 'pagination[pageSize]': 7 }, tags: ['blogs'] })
    return (response.data || []).map((entry) => ({ id: entry.id, ...(entry.attributes || entry) })).filter((entry) => entry.slug !== currentSlug).slice(0, 6)
  } catch { return [] }
}

const getIndexItems = (blocks: BetterBlock[], slug: string) => {
  const headings = blocks.filter((block) => block.type === 'heading' && (block.level || 2) <= 3).map((block, index) => ({ id: sectionId(slug, index), label: textFromNodes(block.children) })).filter((item) => item.label)
  return headings.length ? headings : [{ id: contentId(slug), label: 'Article overview' }]
}

export async function generateStaticParams() { return (await getBlogSlugs()).map((slug) => ({ slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const blog = await getBlog((await params).slug)
  if (!blog) return { title: 'Article Not Found' }
  const image = mediaUrl(blog.coverImage)
  return buildSeoMetadata({ path: `/news/${blog.slug}`, pageSeo: blog.seo as any, title: blog.title, description: blog.metaDescription || blog.title, image, type: 'article' })
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const blog = await getBlog(slug)
  if (!blog) notFound()
  const latestBlogs = await getLatestBlogs(blog.slug)
  const image = mediaUrl(blog.coverImage)
  const blocks = blog.contentBetterBlocks || []
  const indexItems = getIndexItems(blocks, blog.slug)

  return <main className="service-detail-page blog-detail-page">
    <section className="service-detail-hero service-detail-hero--editorial">
      <div className="service-detail-hero__media" aria-hidden="true">{image ? <Image src={image} alt="" fill priority sizes="100vw" /> : null}</div>
      <div className="service-detail-hero__content">
        <nav className="service-detail-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><Link href="/news">Patient Planning Journal</Link><span aria-hidden="true">›</span><span>{blog.title}</span></nav>
        <h2>{blog.title}</h2>
        {blog.metaDescription ? <p className="service-detail-hero__description">{blog.metaDescription}</p> : null}
      </div>
    </section>
    <section className="service-detail-body" aria-label={`${blog.title} details`}>
      <div className="service-detail-body-layout">
        <ServiceDetailSidebar items={indexItems} />
        <article id={contentId(blog.slug)} className="service-detail-article">
          <header className="service-detail-article__header"><p>{blog.metaDescription || 'A clear, clinically grounded guide from the Dr. Maris Aesthetics team.'}</p></header>
          {blocks.length ? <ServiceContentRenderer content={blocks} sectionIds={indexItems.map((item) => item.id)} /> : <p className="service-detail-empty">This article content is being prepared.</p>}
          <ServiceFaqSection data={blog.faq} />
          <Link href="/news" className="blog-detail-back"><ArrowRight aria-hidden="true" />Back to Patient Planning Journal</Link>
        </article>
        {latestBlogs.length ? <aside className="service-detail-latest" aria-label="Latest articles"><span>EXPLORE MORE</span><h3>Latest articles</h3><div className="service-detail-latest__list">{latestBlogs.map((latest) => { const latestImage = mediaUrl(latest.coverImage); return <Link href={`/news/${latest.slug}`} className="service-detail-latest__item" key={latest.id}><span className="service-detail-latest__image">{latestImage ? <Image src={latestImage} alt="" fill sizes="72px" /> : null}</span><span className="service-detail-latest__copy"><strong>{latest.title}</strong>{latest.metaDescription ? <small>{latest.metaDescription}</small> : null}</span></Link> })}</div></aside> : null}
      </div>
    </section>
  </main>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamicParams = true
