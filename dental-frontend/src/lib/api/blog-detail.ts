import { apiClient } from '@/src/lib/api/client'

export type BlogDetailRecord = {
  id: number
  title: string
  slug: string
  blog_category_id?: string | null
  metaDescription?: string
  coverImage?: any
  contentBetterBlocks?: any[]
  faq?: any
  publishedAt?: string
  createdAt?: string
  seo?: unknown
}

export async function getBlogDetail(slug: string): Promise<BlogDetailRecord | null> {
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

export async function getBlogSlugs(): Promise<string[]> {
  try {
    const response = await apiClient<{ data?: any[] }>('/api/blogs', { params: { 'fields[0]': 'slug' }, tags: ['blogs'] })
    return (response.data || []).map((entry) => (entry.attributes || entry).slug).filter(Boolean)
  } catch { return [] }
}

export async function getLatestBlogDetails(currentSlug: string): Promise<BlogDetailRecord[]> {
  try {
    const response = await apiClient<{ data?: any[] }>('/api/blogs', { params: { 'populate[coverImage]': 'true', sort: 'publishedAt:desc', 'pagination[pageSize]': 7 }, tags: ['blogs'] })
    return (response.data || []).map((entry) => ({ id: entry.id, ...(entry.attributes || entry) })).filter((entry) => entry.slug !== currentSlug).slice(0, 6)
  } catch { return [] }
}
