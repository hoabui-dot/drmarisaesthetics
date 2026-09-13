import Link from 'next/link'
import Image from 'next/image'
import { apiClient } from '@/src/lib/api/client'

type Service = { id: number; title: string; slug: string; metaDescription?: string; coverImage?: any }
const imageUrl = (value: any) => { const media = value?.data?.attributes || value?.attributes || value; return typeof media?.url === 'string' ? (media.url.startsWith('/uploads/') ? `/api/strapi-media${media.url}` : media.url) : null }

export default async function ServicesPage() {
  const response = await apiClient<{ data: Service[] }>('/api/services', { params: { populate: 'coverImage', sort: 'title:asc' }, tags: ['services'] })
  const services = response.data || []
  return <main className="blog-detail-page services-index-page"><section className="blog-detail-container"><header className="services-index-page__header"><span className="stitch-kicker">DR. MARIS AESTHETICS</span><h2>Plastic Surgery Services</h2><p>Explore surgeon-led procedures planned around anatomy, safety and long-term recovery.</p></header><div className="services-index-page__grid">{services.map((service) => { const image = imageUrl(service.coverImage); return <Link href={`/services/${service.slug}`} className="services-index-card" key={service.id}>{image ? <div className="services-index-card__image"><Image src={image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /></div> : null}<div><span className="stitch-kicker">PLASTIC SURGERY</span><h3>{service.title}</h3>{service.metaDescription ? <p>{service.metaDescription}</p> : null}<span>Explore service</span></div></Link> })}</div></section></main>
}
