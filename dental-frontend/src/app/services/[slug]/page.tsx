import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { apiClient } from '@/src/lib/api/client'
import { ServiceContentRenderer } from '@/src/components/services/ServiceContentRenderer'
import { ServiceDetailSidebar } from '@/src/components/services/ServiceDetailSidebar'

type MediaValue = { url?: string; attributes?: { url?: string }; data?: { attributes?: { url?: string }; url?: string } }
type BetterBlockChild = { text?: string; children?: BetterBlockChild[] }
type BetterBlock = { type?: string; level?: number; children?: BetterBlockChild[] }
type Service = { id: number; title: string; slug: string; contentBetterBlocks?: BetterBlock[]; metaDescription?: string; coverImage?: MediaValue; publishedAt?: string; createdAt?: string }

const imageUrl = (value?: MediaValue) => {
  const media = value?.data?.attributes || value?.data || value?.attributes || value
  if (!media || typeof media !== 'object' || typeof media.url !== 'string') return null
  return media.url.startsWith('/uploads/') ? `/api/strapi-media${media.url}` : media.url
}

const textFromNodes = (nodes?: BetterBlockChild[]): string => (nodes || []).map((node) => node.text || textFromNodes(node.children)).join('').trim()
const getServiceImage = (service: Service) => imageUrl(service.coverImage)

const getService = async (slug: string) => {
  const response = await apiClient<{ data?: Service[] }>('/api/services', { params: { 'filters[slug][$eq]': slug, populate: '*' }, tags: ['services', `service-${slug}`] })
  return response.data?.[0] || null
}

const getLatestServices = async (currentSlug: string) => {
  try {
    const response = await apiClient<{ data?: Service[] }>('/api/services', { params: { populate: 'coverImage', sort: 'publishedAt:desc', 'pagination[pageSize]': 7 }, tags: ['services'] })
    return (response.data || []).filter((service) => service.slug !== currentSlug).slice(0, 6)
  } catch {
    return []
  }
}

const sectionId = (slug: string, index: number) => {
  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'service'
  return `service-${safeSlug}-section-${index + 1}`
}
const contentId = (slug: string) => sectionId(slug, 0).replace(/-section-1$/, '-content')

const getIndexItems = (blocks: BetterBlock[], slug: string) => {
  const headings = blocks.filter((block) => block.type === 'heading' && (block.level || 2) <= 3).map((block, index) => ({ id: sectionId(slug, index), label: textFromNodes(block.children) })).filter((item) => item.label)
  return headings.length ? headings : [{ id: contentId(slug), label: 'Service overview' }]
}

export async function generateStaticParams() {
  try {
    const response = await apiClient<{ data?: Service[] }>('/api/services', { params: { 'fields[0]': 'slug' }, tags: ['services'] })
    return (response.data || []).map((service) => ({ slug: service.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const service = await getService((await params).slug)
  if (!service) return { title: 'Service Not Found' }
  const image = getServiceImage(service)
  return {
    title: service.title,
    description: service.metaDescription,
    openGraph: { title: service.title, description: service.metaDescription, type: 'article', images: image ? [{ url: image, alt: service.title }] : undefined },
    twitter: { card: 'summary_large_image', title: service.title, description: service.metaDescription, images: image ? [image] : undefined },
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const service = await getService(slug)
  if (!service) notFound()

  const latestServices = await getLatestServices(service.slug)
  const image = getServiceImage(service)
  const blocks = service.contentBetterBlocks || []
  const indexItems = getIndexItems(blocks, service.slug)

  return (
    <main className="service-detail-page">
      <section className="service-detail-hero service-detail-hero--editorial">
        <div className="service-detail-hero__media" aria-hidden="true">{image ? <Image src={image} alt="" fill priority sizes="100vw" /> : null}</div>
        <div className="service-detail-hero__content">
          <nav className="service-detail-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><Link href="/services">Services</Link><span aria-hidden="true">›</span><span>{service.title}</span></nav>
          <span className="stitch-kicker">DR. MARIS AESTHETICS · PLASTIC SURGERY</span>
          <h2>{service.title}</h2>
          {service.metaDescription ? <p className="service-detail-hero__description">{service.metaDescription}</p> : null}
        </div>
      </section>

      <section className="service-detail-body" aria-label={`${service.title} details`}>
        <div className="service-detail-body-layout">
          <ServiceDetailSidebar items={indexItems} />

          <article id={contentId(service.slug)} className="service-detail-article">
            <header className="service-detail-article__header"><span className="service-detail-eyebrow">{service.title}</span><p>{service.metaDescription || 'A surgeon-led approach planned around your anatomy, safety and long-term recovery.'}</p></header>
            {blocks.length ? <ServiceContentRenderer content={blocks} sectionIds={indexItems.map((item) => item.id)} /> : <p className="service-detail-empty">This service content is being prepared.</p>}
            <Link href="/services" className="blog-detail-back">Back to services</Link>
          </article>

          {latestServices.length ? <aside className="service-detail-latest" aria-label="Latest services"><span>EXPLORE MORE</span><h3>Latest services</h3><div className="service-detail-latest__list">{latestServices.map((latest) => { const latestImage = getServiceImage(latest); return <Link href={`/services/${latest.slug}`} className="service-detail-latest__item" key={latest.id}><span className="service-detail-latest__image">{latestImage ? <Image src={latestImage} alt="" fill sizes="72px" /> : null}</span><span className="service-detail-latest__copy"><strong>{latest.title}</strong>{latest.metaDescription ? <small>{latest.metaDescription}</small> : null}</span></Link> })}</div></aside> : null}
        </div>
      </section>
    </main>
  )
}
