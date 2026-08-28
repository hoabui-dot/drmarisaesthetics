import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getHomepage } from '@/src/lib/api/queries'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data'
import { StitchHomepage, StitchHomepageFaq } from '@/src/components/StitchAestheticPage'

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

  const structuredData = await resolveStructuredData({
    pageType: 'home', path: '/',
    title: homepage.metadataTitle || 'Saigon International Dental Clinic - Perfect Smile',
    description: homepage.metadataDescription || 'Professional dental care with modern technology and experienced doctors.',
    pageSeo: homepage.seo,
  })

  return <><StructuredDataScript data={structuredData} /><StitchHomepage /><StitchHomepageFaq /></>
}

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage()
  return buildSeoMetadata({ path: '/', pageSeo: homepage.seo, title: homepage.metadataTitle || 'Saigon International Dental Clinic - Perfect Smile', description: homepage.metadataDescription || 'Professional dental care with modern technology and experienced doctors.', image: homepage.metadataImage })
}

// Disable all caching for this page to guarantee instant updates from CMS
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
