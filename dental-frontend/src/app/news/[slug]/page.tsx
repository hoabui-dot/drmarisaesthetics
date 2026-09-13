import type { Metadata } from 'next/types';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import Image from 'next/image';
import { CalendarDays, ChevronRight, Clock3, FileText, Search, UserRound, ArrowRight } from 'lucide-react';
import { NavigationLink } from '@/src/components/ui/NavigationLink';
import { MarkdownContent } from '@/src/components/MarkdownContent';
import { apiClient } from '@/src/lib/api/client';
import { getBlogCategoryLabel } from '@/src/lib/constants/news';
import { buildSeoMetadata, type PageSeoInput } from '@/src/lib/seo/seo-manager';
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data';

interface BlogPost { id: number; documentId: string; title: string; slug: string; excerpt?: string; metaDescription?: string; content?: string; category?: string; authorName?: string; readingTime?: string; imageUrl?: string | null; imageAlt?: string; metaImageUrl?: string | null; publishedAt: string; createdAt: string; updatedAt: string; seo?: PageSeoInput; }
interface StrapiResponse { data: BlogPost[]; meta?: any; }
interface SidebarService { title: string; subtitle: string; imageUrl: string; href: string; }
// Next Image fetches remote sources from inside the frontend container. Use the
// Docker-internal Strapi URL there; browser-rendered Markdown uses the proxy.
const STRAPI_INTERNAL_URL = (process.env.STRAPI_URL || 'http://smilux-strapi:22345').replace(/\/$/, '');
const fallbackImage = 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=85&w=1400';

function mediaUrl(media: any) {
  const value = media?.data?.attributes || media;
  if (!value?.url) return null;
  if (!value.url.startsWith('http')) return `${STRAPI_INTERNAL_URL}${value.url}`;
  try {
    const parsed = new URL(value.url);
    if (parsed.pathname.startsWith('/uploads/')) return `${STRAPI_INTERNAL_URL}${parsed.pathname}`;
  } catch { /* Keep non-URL media values unchanged. */ }
  return value.url;
}
function cleanText(value: string) { return value.replace(/[`*_\[\]]/g, '').replace(/\s+/g, ' ').trim(); }
function slugify(value: string) { return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function formatDate(value?: string) { return value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) : '—'; }
function getReadingTime(blog: BlogPost) { if (blog.readingTime) return blog.readingTime; const words = blog.content?.trim().split(/\s+/).filter(Boolean).length || 0; return `${Math.max(1, Math.ceil(words / 180))} min read`; }

async function getBlogBySlug(slug: string, isDraftMode: boolean = false): Promise<BlogPost | null> {
  try {
    const response = await apiClient<StrapiResponse>('/api/blogs', { params: { 'filters[slug][$eq]': slug, populate: '*' }, isDraftMode, tags: ['blogs', `blog-${slug}`] });
    const blog = response.data?.[0];
    if (!blog) return null;
    const data: any = (blog as any).attributes || blog;
    const cover = data.coverImage || data.imageCover;
    const meta = data.metaImage || data.meta_image;
    return { id: blog.id, documentId: blog.documentId, ...data, imageUrl: mediaUrl(cover), metaImageUrl: mediaUrl(meta), imageAlt: (cover?.data?.attributes || cover)?.alternativeText || data.title };
  } catch { return null; }
}

async function getAllBlogSlugs() {
  try { const response = await apiClient<StrapiResponse>('/api/blogs', { params: { 'fields[0]': 'slug' }, isDraftMode: false, tags: ['blogs'] }); return response.data?.map((blog) => blog.slug) || []; } catch { return []; }
}

async function getImplantServices(): Promise<SidebarService[]> {
  try {
    const response = await apiClient<any>('/api/services', { params: { 'pagination[pageSize]': 5, 'populate[coverImage]': 'true', sort: 'title:asc' }, isDraftMode: false, tags: ['services'] });
    return (response.data || []).map((entry: any) => {
      const data = entry.attributes || entry;
      return { title: data.title, subtitle: data.metaDescription || 'Read the clinical guide', imageUrl: mediaUrl(data.coverImage) || fallbackImage, href: `/services/${data.slug}` };
    });
  } catch { return []; }
}

export async function generateStaticParams() { return (await getAllBlogSlugs()).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const blog = await getBlogBySlug((await params).slug); if (!blog) return { title: 'Article Not Found' }; return buildSeoMetadata({ path: `/news/${blog.slug}`, pageSeo: blog.seo, title: blog.title, description: blog.metaDescription || blog.excerpt || blog.title, image: blog.metaImageUrl || blog.imageUrl, type: 'article' }); }

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { isEnabled: isDraftMode } = await draftMode();
  const blog = await getBlogBySlug((await params).slug, isDraftMode);
  if (!blog) notFound();
  const content = blog.content || '';
  const headings = Array.from(content.matchAll(/^#{2,3}\s+(.+)$/gm)).map((match) => ({ label: cleanText(match[1]), id: slugify(match[1]) }));
  const sidebarServices = await getImplantServices();
  const heroImage = blog.metaImageUrl || blog.imageUrl || fallbackImage;
  const authorImage = `${STRAPI_INTERNAL_URL}/uploads/doctor_new_4622af55c6.jpg`;
  const categoryLabel = getBlogCategoryLabel(blog.category);
  const structuredData = await resolveStructuredData({
    pageType: 'news', path: `/news/${blog.slug}`, pageSeo: blog.seo, title: blog.title,
    description: blog.metaDescription || blog.excerpt || blog.title, image: heroImage,
    publishedAt: blog.publishedAt, updatedAt: blog.updatedAt, authorName: blog.authorName,
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Knowledge Center', path: '/news' }, { name: blog.title, path: `/news/${blog.slug}` }],
  });

  return <><StructuredDataScript data={structuredData} /><main className="blog-detail-page"><div className="blog-detail-container"><div className="blog-detail-grid"><article className="blog-detail-main">
    <nav className="blog-detail-breadcrumb" aria-label="Breadcrumb"><NavigationLink href="/" className="blog-detail-breadcrumb-link">Home</NavigationLink><ChevronRight aria-hidden="true" /><NavigationLink href="/news">Knowledge</NavigationLink>{blog.category ? <><ChevronRight aria-hidden="true" /><NavigationLink href={`/news?category=${encodeURIComponent(categoryLabel)}`}>{categoryLabel}</NavigationLink></> : null}<ChevronRight aria-hidden="true" /><span aria-current="page">{blog.title}</span></nav>
    <header className="blog-detail-header"><h2>{blog.title}</h2><div className="blog-detail-meta"><span className="is-category"><FileText aria-hidden="true" />{categoryLabel}</span><span><Clock3 aria-hidden="true" />{getReadingTime(blog)}</span><span><CalendarDays aria-hidden="true" />Created {formatDate(blog.createdAt || blog.publishedAt)}</span><span><Image src={authorImage} alt="" width={24} height={24} /><UserRound aria-hidden="true" />By {blog.authorName || 'Dr. Maris Aesthetics'}</span></div></header>
    <section className="blog-detail-intro" aria-label="Article introduction"><span aria-hidden="true">“</span><p>{blog.metaDescription || blog.excerpt || 'Explore trusted dental knowledge from the Smilux Dental clinical team.'}</p></section>
    <div className="blog-detail-hero-image"><Image src={heroImage} alt={blog.imageAlt || `${blog.title} educational image`} fill priority sizes="(max-width: 900px) 100vw, 780px" /></div>
    {headings.length ? <nav className="blog-detail-toc" aria-labelledby="blog-detail-toc-title"><h2 id="blog-detail-toc-title"><FileText aria-hidden="true" />Table of Contents</h2><ol>{headings.map((heading, index) => <li key={`${heading.id}-${index}`}><a href={`#${heading.id}`}><span>{index + 1}.</span>{heading.label}</a></li>)}</ol></nav> : null}
    <div className="blog-detail-markdown"><MarkdownContent content={content} /></div>
    <NavigationLink href="/news" className="blog-detail-back"><ArrowRight aria-hidden="true" />Back to Knowledge Center</NavigationLink>
  </article><aside className="blog-detail-sidebar"><form className="blog-detail-search" action="/news" method="get"><label className="sr-only" htmlFor="blog-detail-search-input">Search articles</label><input id="blog-detail-search-input" name="search" placeholder="Search articles..." /><button type="submit" aria-label="Search articles"><Search aria-hidden="true" /></button></form><section className="blog-detail-services" aria-labelledby="related-guides-title"><h2 id="related-guides-title">Related Surgical Guides</h2><div>{sidebarServices.map((service) => <NavigationLink href={service.href} key={service.title} className="blog-detail-service-item"><Image src={service.imageUrl} alt="" width={82} height={76} /><span><strong>{service.title}</strong><small>{service.subtitle}</small></span><ChevronRight aria-hidden="true" /></NavigationLink>)}</div><NavigationLink href="/news?category=Plastic%20Surgery" className="blog-detail-view-all">View all surgical guides <ArrowRight aria-hidden="true" /></NavigationLink></section></aside></div></div></main></>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;
