import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogDetailView } from '@/src/components/news/BlogDetailView'
import { getBlogDetail } from '@/src/lib/api/blog-detail'
import { getWebsiteSetting } from '@/src/lib/api/queries'
import { blogArticlePath } from '@/src/lib/news/routes'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'

async function resolve(categoryRoute: string, articleSlug: string) {
  const [blog, settings] = await Promise.all([getBlogDetail(articleSlug), getWebsiteSetting()])
  const categories = settings?.blogCategories || []
  if (!blog) return { blog: null, category: undefined, categories }
  const category = categories.find((item) => item.id === blog.blog_category_id)
  if (!category || category.routeName !== categoryRoute) return { blog: null, category: undefined, categories }
  return { blog, category, categories }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; articleSlug: string }> }): Promise<Metadata> {
  const { slug: categoryRoute, articleSlug } = await params
  const { blog, categories } = await resolve(categoryRoute, articleSlug)
  if (!blog) return { title: 'Article Not Found' }
  const imageValue = blog.coverImage?.data?.attributes || blog.coverImage?.data || blog.coverImage?.attributes || blog.coverImage
  const image = typeof imageValue?.url === 'string' ? imageValue.url : undefined
  return buildSeoMetadata({ path: blogArticlePath(blog.slug, blog.blog_category_id, categories), pageSeo: blog.seo as any, title: blog.title, description: blog.metaDescription || blog.title, image, type: 'article' })
}

export default async function CategoryBlogDetailPage({ params }: { params: Promise<{ slug: string; articleSlug: string }> }) {
  const { slug: categoryRoute, articleSlug } = await params
  const { blog, category, categories } = await resolve(categoryRoute, articleSlug)
  if (!blog || !category) notFound()
  return <BlogDetailView blog={blog} categoryLabel={category.label} categories={categories} />
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamicParams = true
