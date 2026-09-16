import type { Metadata } from 'next'
import { apiClient } from '@/src/lib/api/client'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { ServicesPage, type ServiceListItem } from '@/src/components/ServicesPage'

type Service = { id: number; title: string; slug: string; metaDescription?: string; category?: string; coverImage?: any }
const imageUrl = (value: any) => { const media = value?.data?.attributes || value?.data || value?.attributes || value; return typeof media?.url === 'string' ? (media.url.startsWith('/uploads/') ? `/api/strapi-media${media.url}` : media.url) : null }

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({ path: '/services', title: 'Plastic Surgery Services | Dr. Maris Aesthetics', description: 'Explore surgeon-led plastic surgery procedures planned around anatomy, safety and long-term recovery.' })
}

export default async function ServicesPageRoute() {
  const response = await apiClient<{ data?: any[] }>('/api/services', { params: { 'populate[coverImage]': 'true', sort: 'title:asc', 'pagination[pageSize]': 100 }, tags: ['services'] })
  const services: ServiceListItem[] = (response.data || []).map((entry: any) => {
    const service = entry.attributes || entry
    const media = service.coverImage?.data?.attributes || service.coverImage?.data || service.coverImage?.attributes || service.coverImage
    return { id: entry.id, title: service.title, slug: service.slug, description: service.metaDescription, category: service.category, imageUrl: imageUrl(service.coverImage), imageAlt: media?.alternativeText || service.title }
  })
  return <ServicesPage services={services} />
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
