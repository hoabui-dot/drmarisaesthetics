import type { Metadata } from 'next'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { TreatmentLandingPage } from '@/src/components/TreatmentLandingPage'

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({
    path: '/treatments',
    title: 'Treatments | Dr. Maris Aesthetics',
    description: 'Explore surgeon-led, anatomy-focused cosmetic surgery treatments at Dr. Maris Aesthetics in Vietnam.',
  })
}

/** Independent Treatments landing route. */
export default function TreatmentsPage() {
  return <TreatmentLandingPage />
}

export const dynamic = 'force-dynamic'
