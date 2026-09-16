import type { Metadata } from 'next'
import { BlogResultsPage, type BlogListItem } from '@/src/components/BlogResultsPage'
import { apiClient } from '@/src/lib/api/client'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({
    path: '/news',
    title: 'Patient Planning Journal | Dr. Maris Aesthetics',
    description: 'Clinically grounded guidance for planning plastic surgery, recovery and revision care.',
  })
}

const mediaUrl = (media: any) => {
  const value = media?.data?.attributes || media?.attributes || media
  if (typeof value?.url !== 'string') return null
  return value.url.startsWith('/uploads/') ? `/api/strapi-media${value.url}` : value.url
}

async function getBlogs(): Promise<BlogListItem[]> {
  try {
    const response = await apiClient<{ data?: any[] }>('/api/blogs', {
      params: { 'populate[coverImage]': 'true', sort: 'publishedAt:desc', 'pagination[pageSize]': 100 },
      tags: ['blogs'],
    })
    return (response.data || []).map((entry) => {
      const blog = entry.attributes || entry
      const media = blog.coverImage?.data?.attributes || blog.coverImage?.attributes || blog.coverImage
      return { id: entry.id, title: blog.title, slug: blog.slug, category: blog.category, metaDescription: blog.metaDescription, publishedAt: blog.publishedAt, imageUrl: mediaUrl(blog.coverImage), imageAlt: media?.alternativeText || blog.title }
    })
  } catch {
    return []
  }
}

export default async function NewsPage() {
  return <BlogResultsPage posts={await getBlogs()} />
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
