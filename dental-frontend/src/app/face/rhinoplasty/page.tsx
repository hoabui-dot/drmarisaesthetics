import type { Metadata } from 'next'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data'
import { StitchTreatmentPage } from '@/src/components/StitchTreatmentPage'

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({
    path: '/face/rhinoplasty',
    title: 'Rhinoplasty Surgery in Vietnam | Dr. Maris Aesthetics',
    description: 'Learn about anatomy-led rhinoplasty surgery in Vietnam with Dr. Maris Aesthetics.',
  })
}

export default async function FaceRhinoplastyPage() {
  const structuredData = await resolveStructuredData({
    pageType: 'service',
    path: '/face/rhinoplasty',
    title: 'Rhinoplasty Surgery in Vietnam',
    description: 'Learn about anatomy-led rhinoplasty surgery in Vietnam with Dr. Maris Aesthetics.',
    serviceType: 'Rhinoplasty Surgery',
    areaServed: 'Ho Chi Minh City, Vietnam',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Face', path: '/face/rhinoplasty' },
      { name: 'Rhinoplasty', path: '/face/rhinoplasty' },
    ],
  })

  return <><StructuredDataScript data={structuredData} /><StitchTreatmentPage /></>
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
