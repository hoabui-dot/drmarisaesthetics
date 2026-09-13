import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPageBySlug, getAllPageSlugs } from '@/src/lib/api/queries'
import { BlockRenderer } from '@/src/components/BlockRenderer'
import { PreviewBanner } from '@/src/components/PreviewBanner'
import { MarkdownContent } from '@/src/components/MarkdownContent'
import { Suspense } from 'react'
import { PageSkeleton } from '@/src/components/LoadingSkeleton'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data'

/**
 * Dynamic Landing Page Route
 * 
 * This route handles all dynamic landing pages from Strapi CMS.
 * Supports preview mode for draft content.
 * 
 * Flow:
 * 1. Next.js matches URL to [slug] parameter
 * 2. Check if draft mode is enabled
 * 3. generateMetadata() fetches page data for SEO
 * 4. Page component fetches same data (cached by Next.js)
 * 5. BlockRenderer renders the layout blocks
 * 6. Page is served to user
 * 
 * Performance:
 * - Uses ISR (revalidate: 60) for optimal performance
 * - Data is fetched once and cached
 * - Static generation for known slugs
 * - No cache in preview mode
 */

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * Generate Static Params
 * 
 * Pre-generates pages at build time for all existing slugs.
 * This enables static generation for better performance.
 */
export async function generateStaticParams() {
  try {
    const slugs = await getAllPageSlugs()

    return slugs.map((slug) => ({
      slug,
    }))
  } catch (error) {
    return []
  }
}

/**
 * Generate Metadata (SEO)
 * 
 * Generates page metadata for SEO optimization.
 * Maps CMS SEO fields to Next.js metadata.
 * 
 * Note: This function is cached by Next.js and shares cache with page component.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const { isEnabled: isDraftMode } = await draftMode()
    const page = await getPageBySlug(slug, isDraftMode)

    if (!page) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
      }
    }

    const metadata = await buildSeoMetadata({ path: `/${page.slug}`, pageSeo: {
      meta_title: page.seo?.metaTitle,
      meta_description: page.seo?.metaDescription,
      meta_image: page.seo?.metaImage,
      canonical_url: page.seo?.canonicalUrl,
      no_index: page.seo?.noIndex,
      no_follow: page.seo?.noFollow,
      open_graph_title: page.seo?.openGraphTitle,
      open_graph_description: page.seo?.openGraphDescription,
    }, title: page.title, description: page.description || `Learn more about ${page.title}` })
    return isDraftMode ? { ...metadata, title: `[PREVIEW] ${metadata.title}` } : metadata
  } catch (error) {
    return {
      title: 'Error',
      description: 'An error occurred while loading this page.',
    }
  }
}

/**
 * Page Component
 * 
 * Main component that renders the dynamic landing page.
 * Supports preview mode for draft content.
 */
export default async function LandingPage({ params }: PageProps) {
  try {
    // Check if draft mode is enabled
    const { isEnabled: isDraftMode } = await draftMode()

    // Fetch page data from CMS
    const { slug } = await params
    const page = await getPageBySlug(slug, isDraftMode)

    // Handle page not found
    if (!page) {
      notFound()
    }

    const structuredData = await resolveStructuredData({
      pageType: 'page', path: `/${page.slug}`,
      pageSeo: {
        meta_title: page.seo?.metaTitle, meta_description: page.seo?.metaDescription, meta_image: page.seo?.metaImage,
        canonical_url: page.seo?.canonicalUrl, no_index: page.seo?.noIndex, no_follow: page.seo?.noFollow,
        open_graph_title: page.seo?.openGraphTitle, open_graph_description: page.seo?.openGraphDescription,
      },
      title: page.title, description: page.description || `Learn more about ${page.title}`,
      image: page.cover, breadcrumbs: [{ name: 'Home', path: '/' }, { name: page.title, path: `/${page.slug}` }],
      publishedAt: page.publishDate, updatedAt: page.updatedAt,
    })

    return (
      <>
        <StructuredDataScript data={structuredData} />
        {/* Preview Mode Banner */}
        {isDraftMode && <PreviewBanner />}

        <main className={isDraftMode ? "min-h-screen bg-background pt-20" : "min-h-screen bg-background"}>
          {page.layout && page.layout.length > 0 ? (
            <Suspense fallback={<PageSkeleton />}>
              {/* Render all blocks from CMS */}
              <BlockRenderer layout={page.layout} />
            </Suspense>
          ) : (
            /* Fallback: Show content field if no blocks */
            <div className="container mx-auto px-4 py-16 max-w-4xl">
              {/* Cover Image */}
              {page.cover && (
                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl mb-8">
                  <img
                    src={page.cover.url}
                    alt={page.cover.alt || page.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#165197] leading-[1.1] tracking-tight mb-4">{page.title}</h2>

              {/* Publish Date */}
              {page.publishDate && (
                <p className="text-sm text-foreground-muted mb-6">
                  Published: {new Date(page.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}

              {/* Description */}
              {page.description && (
                <p className="text-base sm:text-lg md:text-xl text-foreground-secondary font-medium mb-8 leading-relaxed">
                  {page.description}
                </p>
              )}

              {/* Content */}
              {page.content && (
                <MarkdownContent
                  content={page.content}
                  className="text-foreground-secondary"
                />
              )}
            </div>
          )}
        </main>
      </>
    )
  } catch (error) {
    // `notFound()` throws an internal Next.js control-flow error. Re-throw it
    // so unknown slugs reach the app-level 404 instead of being rendered as a
    // generic CMS loading error.
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_HTTP_ERROR_FALLBACK')
    ) {
      throw error
    }

    // Keep a recoverable error state for genuine CMS/runtime failures.
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full text-center space-y-4 px-4">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground">
            Error Loading Page
          </h2>
          <p className="text-foreground-secondary">
            We encountered an error while loading this page. Please try again later.
          </p>
        </div>
      </main>
    )
  }
}

/**
 * Revalidation Configuration
 * 
 * On-Demand Revalidation:
 * - No time-based revalidation (revalidate = false)
 * - Cache invalidated via Strapi webhooks
 * - Real-time content updates
 * - Enterprise-grade cache management
 * 
 * Cache tags are used for granular revalidation:
 * - 'pages' tag: Revalidates all page queries
 * - 'page' tag: Revalidates specific page queries
 * 
 * Webhook triggers revalidation immediately when content changes.
 */
// force-dynamic: prevents stale SSG content baked when Strapi was unreachable at build time.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Dynamic Params Configuration
 * 
 * Allow dynamic params that weren't pre-generated.
 * New pages created in CMS will work immediately.
 */
export const dynamicParams = true
