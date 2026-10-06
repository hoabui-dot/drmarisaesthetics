import { apiClient } from '@/src/lib/api/client'
import { getMediaUrl } from '@/src/lib/api/media'

export type CategoryListingItem = {
  id: number
  title: string
  slug: string
  description?: string
  categoryId?: string
  publishedAt?: string
  imageUrl: string | null
  imageAlt: string
}

export type ListingPage<T> = { items: T[]; total: number; page: number; pageSize: number }

const entity = (value: any) => value?.attributes || value || {}

const mediaDetails = (value: any, fallbackAlt: string) => {
  const media = entity(value?.data || value)
  return {
    imageUrl: media?.url ? getMediaUrl(media) : null,
    imageAlt: media?.alternativeText || fallbackAlt,
  }
}

export async function getServiceListingPage(options: {
  page?: number
  pageSize?: number
  category?: string
} = {}): Promise<ListingPage<CategoryListingItem>> {
  const page = Math.max(1, Math.floor(options.page || 1))
  const pageSize = Math.min(24, Math.max(1, Math.floor(options.pageSize || 6)))
  const category = options.category?.trim()
  const params: Record<string, unknown> = {
    'populate[coverImage]': 'true',
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
    'sort[0]': 'navigationOrder:asc',
    'sort[1]': 'title:asc',
  }
  if (category && category !== 'all') params['filters[service_category_id][$eq]'] = category

  const response = await apiClient<any>('/api/services', {
    params,
    tags: ['services', 'website-setting'],
    cache: 'no-store',
  })
  const items = (Array.isArray(response?.data) ? response.data : []).map((entry: any) => {
    const service = entity(entry)
    const media = mediaDetails(service.coverImage, service.title || 'Service')
    return {
      id: Number(entry.id),
      title: service.title || '',
      slug: service.slug || '',
      description: service.metaDescription || undefined,
      categoryId: typeof service.service_category_id === 'string' ? service.service_category_id : undefined,
      ...media,
    }
  })
  return {
    items,
    total: Number(response?.meta?.pagination?.total ?? items.length),
    page,
    pageSize,
  }
}

export async function getBlogListingPage(options: {
  page?: number
  pageSize?: number
  category?: string
  search?: string
} = {}): Promise<ListingPage<CategoryListingItem>> {
  const page = Math.max(1, Math.floor(options.page || 1))
  const pageSize = Math.min(24, Math.max(1, Math.floor(options.pageSize || 6)))
  const category = options.category?.trim()
  const search = options.search?.trim()
  const params: Record<string, unknown> = {
    'populate[coverImage]': 'true',
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
    'sort[0]': 'publishedAt:desc',
  }
  if (category && category !== 'all') params['filters[blog_category_id][$eq]'] = category
  if (search) {
    params['filters[$or][0][title][$containsi]'] = search
    params['filters[$or][1][metaDescription][$containsi]'] = search
  }

  const response = await apiClient<any>('/api/blogs', {
    params,
    tags: ['blogs', 'website-setting'],
    cache: 'no-store',
  })
  const items = (Array.isArray(response?.data) ? response.data : []).map((entry: any) => {
    const blog = entity(entry)
    const media = mediaDetails(blog.coverImage, blog.title || 'Article')
    return {
      id: Number(entry.id),
      title: blog.title || '',
      slug: blog.slug || '',
      description: blog.metaDescription || undefined,
      categoryId: typeof blog.blog_category_id === 'string' ? blog.blog_category_id : undefined,
      publishedAt: blog.publishedAt || undefined,
      ...media,
    }
  })
  return {
    items,
    total: Number(response?.meta?.pagination?.total ?? items.length),
    page,
    pageSize,
  }
}
