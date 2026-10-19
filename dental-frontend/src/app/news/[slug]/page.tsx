import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { BlogDetailView } from '@/src/components/news/BlogDetailView'
import { getBlogDetail } from '@/src/lib/api/blog-detail'
import { getWebsiteSetting } from '@/src/lib/api/queries'
import { blogArticlePath } from '@/src/lib/news/routes'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'

async function resolve(slug: string) {
  const [blog, settings] = await Promise.all([getBlogDetail(slug), getWebsiteSetting()])
  if (!blog) return { blog: null, settings, category: undefined }
  const category = settings?.blogCategories.find((item) => item.id === blog.blog_category_id)
  return { blog, settings, category }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { blog, settings, category } = await resolve(slug)
  if (!blog) return { title: 'Article Not Found' }
  const imageValue = blog.coverImage?.data?.attributes || blog.coverImage?.data || blog.coverImage?.attributes || blog.coverImage
  const image = typeof imageValue?.url === 'string' ? imageValue.url : undefined
  return buildSeoMetadata({
    path: blogArticlePath(blog.slug, blog.blog_category_id, settings?.blogCategories || []),
    pageSeo: blog.seo as any,
    title: blog.title,
    description: blog.metaDescription || blog.title,
    image,
    type: 'article',
  })
}

export default async function LegacyBlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { blog, settings, category } = await resolve(slug)
  if (!blog) notFound()
  if (category?.routeName) permanentRedirect(blogArticlePath(blog.slug, blog.blog_category_id, settings?.blogCategories || []))
  return <BlogDetailView blog={blog} categoryLabel={category?.label} categories={settings?.blogCategories || []} />
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamicParams = true
