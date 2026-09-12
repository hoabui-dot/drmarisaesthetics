import type { Metadata } from 'next'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data'
import { StitchHomepage } from '@/src/components/StitchAestheticPage'
import { getHomepageEditorial } from '@/src/lib/api/queries'

/**
 * Homepage
 * 
 * Editorial homepage. Content is read from the Homepage single type while
 * the visual/animation composition remains owned by the frontend.
 */

export default async function Home() {
  const homepage = await getHomepageEditorial()
  const structuredData = await resolveStructuredData({
    pageType: 'home', path: '/',
    title: 'Plastic Surgery in Vietnam for International Patients',
    description: 'Hospital-based cosmetic surgery in Ho Chi Minh City with direct surgeon assessment by Dr. Maris.',
  })

  return <><StructuredDataScript data={structuredData} /><StitchHomepage data={homepage ?? undefined} /></>
}

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({ path: '/', title: 'Dr. Maris Aesthetics | Plastic Surgery in Vietnam', description: 'Hospital-based cosmetic surgery in Ho Chi Minh City with direct surgeon assessment by Dr. Maris.' })
}
