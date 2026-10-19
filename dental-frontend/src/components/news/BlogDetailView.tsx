import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ServiceContentRenderer } from '@/src/components/services/ServiceContentRenderer'
import { ServiceDetailSidebar } from '@/src/components/services/ServiceDetailSidebar'
import { ServiceFaqSection } from '@/src/components/services/ServiceFaqSection'
import type { BlogDetailRecord } from '@/src/lib/api/blog-detail'
import { getLatestBlogDetails } from '@/src/lib/api/blog-detail'
import { blogArticlePath } from '@/src/lib/news/routes'
import type { WebsiteCategory } from '@/src/types/strapi'

type BetterBlockChild = { text?: string; children?: BetterBlockChild[] }
type BetterBlock = { type?: string; level?: number; children?: BetterBlockChild[] }

const mediaUrl = (value?: any) => {
  const media = value?.data?.attributes || value?.data || value?.attributes || value
  if (!media || typeof media !== 'object' || typeof media.url !== 'string') return null
  return media.url.startsWith('/uploads/') ? `/api/strapi-media${media.url}` : media.url
}
const textFromNodes = (nodes?: BetterBlockChild[]): string => (nodes || []).map((node) => node.text || textFromNodes(node.children)).join('').trim()
const sectionId = (slug: string, index: number) => `blog-${slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'article'}-section-${index + 1}`
const contentId = (slug: string) => sectionId(slug, 0).replace(/-section-1$/, '-content')

function getIndexItems(blocks: BetterBlock[], slug: string) {
  const headings = blocks.filter((block) => block.type === 'heading' && (block.level || 2) <= 3)
    .map((block, index) => ({ id: sectionId(slug, index), label: textFromNodes(block.children) })).filter((item) => item.label)
  return headings.length ? headings : [{ id: contentId(slug), label: 'Article overview' }]
}

export async function BlogDetailView({ blog, categoryLabel, categories = [] }: { blog: BlogDetailRecord; categoryLabel?: string; categories?: WebsiteCategory[] }) {
  const latestBlogs = await getLatestBlogDetails(blog.slug)
  const image = mediaUrl(blog.coverImage)
  const blocks = (blog.contentBetterBlocks || []) as BetterBlock[]
  const indexItems = getIndexItems(blocks, blog.slug)

  return <main className="service-detail-page blog-detail-page">
    <section className="service-detail-hero service-detail-hero--editorial">
      <div className="service-detail-hero__media" aria-hidden="true">{image ? <Image src={image} alt="" fill priority sizes="100vw" /> : null}</div>
      <div className="service-detail-hero__content">
        <nav className="service-detail-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><Link href="/news">Patient Planning Journal</Link><span aria-hidden="true">›</span><span>{blog.title}</span></nav>
        {categoryLabel ? <span className="blog-result-card__category">{categoryLabel}</span> : null}
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
        {latestBlogs.length ? <aside className="service-detail-latest" aria-label="Latest articles"><span>EXPLORE MORE</span><h3>Latest articles</h3><div className="service-detail-latest__list">{latestBlogs.map((latest) => { const latestImage = mediaUrl(latest.coverImage); return <Link href={blogArticlePath(latest.slug, latest.blog_category_id, categories)} className="service-detail-latest__item" key={latest.id}><span className="service-detail-latest__image">{latestImage ? <Image src={latestImage} alt="" fill sizes="72px" /> : null}</span><span className="service-detail-latest__copy"><strong>{latest.title}</strong>{latest.metaDescription ? <small>{latest.metaDescription}</small> : null}</span></Link> })}</div></aside> : null}
      </div>
    </section>
  </main>
}
