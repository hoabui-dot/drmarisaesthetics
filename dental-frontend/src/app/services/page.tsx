import type { Metadata } from 'next'
import { apiClient } from '@/src/lib/api/client'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { ServicesPage, type ServiceListItem } from '@/src/components/ServicesPage'

type Service = {
  id: number
  title: string
  slug: string
  metaDescription?: string
  category?: string
  categories?: any
  coverImage?: any
}

type ServiceCategory = { id: string; label: string }

const mapServiceCategories = (value: any): ServiceCategory[] => {
  const raw = Array.isArray(value) ? value : value?.data || []
  return raw
    .map((entry: any) => {
      const category = entry?.attributes || entry
      return {
        id: String(category?.category_id || category?.documentId || category?.id || '').trim(),
        label: String(category?.label || '').trim(),
      }
    })
    .filter((category: ServiceCategory) => category.id && category.label)
}
const imageUrl = (value: any) => { const media = value?.data?.attributes || value?.data || value?.attributes || value; return typeof media?.url === 'string' ? (media.url.startsWith('/uploads/') ? `/api/strapi-media${media.url}` : media.url) : null }

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({ path: '/services', title: 'Plastic Surgery Services | Dr. Maris Aesthetics', description: 'Explore surgeon-led plastic surgery procedures planned around anatomy, safety and long-term recovery.' })
}

export default async function ServicesPageRoute() {
  const [response, categoriesResponse] = await Promise.all([
    apiClient<{ data?: any[] }>('/api/services', { params: { 'populate[coverImage]': 'true', 'populate[categories]': 'true', sort: 'title:asc', 'pagination[pageSize]': 100 }, tags: ['services'] }),
    apiClient<{ data?: any[] }>('/api/service-categories', { params: { 'fields[0]': 'category_id', 'fields[1]': 'label', sort: 'label:asc', 'pagination[pageSize]': 100 }, tags: ['services', 'service-categories'] }).catch(() => ({ data: [] })),
  ])
  const categories: ServiceCategory[] = (categoriesResponse.data || [])
    .map((entry: any) => {
      const category = entry.attributes || entry
      return { id: String(category.category_id || '').trim(), label: String(category.label || '').trim() }
    })
    .filter((category) => category.id && category.label)
  const services: ServiceListItem[] = (response.data || []).map((entry: any) => {
    const service = entry.attributes || entry
    const media = service.coverImage?.data?.attributes || service.coverImage?.data || service.coverImage?.attributes || service.coverImage
    const serviceCategories = mapServiceCategories(service.categories)
    return { id: entry.id, title: service.title, slug: service.slug, description: service.metaDescription, category: service.category, categoryIds: serviceCategories.map((category) => category.id), categories: serviceCategories, imageUrl: imageUrl(service.coverImage), imageAlt: media?.alternativeText || service.title }
  })
  return <ServicesPage services={services} categories={categories} />
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
