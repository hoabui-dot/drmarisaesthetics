import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getHomepage } from '@/src/lib/api/queries'
import { BlockRenderer } from '@/src/components/BlockRenderer'
import { EmptyState } from '@/src/components/EmptyState'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data'

/**
 * Homepage
 * 
 * Dynamic homepage driven by Strapi CMS.
 * Renders flexible layout blocks from the homepage Single Type.
 * 
 * Features:
 * - Fully CMS-driven content
 * - Dynamic block rendering
 * - Cached with on-demand revalidation
 * - Graceful error handling
 */

export default async function Home() {
  const { isEnabled: isDraftMode } = await draftMode()
  // Fetch homepage data from CMS
  const homepage = await getHomepage(isDraftMode)

  // Handle empty homepage
  if (!homepage.blocks || homepage.blocks.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EmptyState
          title="Homepage not configured"
          description="The homepage hasn't been set up yet. Please configure it in the CMS."
        />
      </div>
    )
  }

  const structuredData = await resolveStructuredData({
    pageType: 'home', path: '/',
    title: homepage.metadataTitle || 'Saigon International Dental Clinic - Perfect Smile',
    description: homepage.metadataDescription || 'Professional dental care with modern technology and experienced doctors.',
    pageSeo: homepage.seo,
  })

  return (
    <>
      <StructuredDataScript data={structuredData} />
      <div className="min-h-screen bg-background">
      <BlockRenderer layout={homepage.blocks} />
      </div>
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage()
  return buildSeoMetadata({ path: '/', pageSeo: homepage.seo, title: homepage.metadataTitle || 'Saigon International Dental Clinic - Perfect Smile', description: homepage.metadataDescription || 'Professional dental care with modern technology and experienced doctors.', image: homepage.metadataImage })
}

// Disable all caching for this page to guarantee instant updates from CMS
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
