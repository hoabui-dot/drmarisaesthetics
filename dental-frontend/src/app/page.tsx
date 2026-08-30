import type { Metadata } from 'next'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data'
import { StitchHomepage } from '@/src/components/StitchAestheticPage'

/**
 * Homepage
 * 
 * Static Stitch homepage. The export-code UI is intentionally independent
 * from CMS reads; consultation forms still submit through the API.
 */

export default async function Home() {
  const structuredData = await resolveStructuredData({
    pageType: 'home', path: '/',
    title: 'Plastic Surgery in Vietnam for International Patients',
    description: 'Hospital-based cosmetic surgery in Ho Chi Minh City with direct surgeon assessment by Dr. Maris.',
  })

  return <><StructuredDataScript data={structuredData} /><StitchHomepage /></>
}

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({ path: '/', title: 'Dr. Maris Aesthetics | Plastic Surgery in Vietnam', description: 'Hospital-based cosmetic surgery in Ho Chi Minh City with direct surgeon assessment by Dr. Maris.' })
}
