import type { Metadata } from 'next'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { StitchTreatmentPage } from '@/src/components/StitchTreatmentPage'

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({
    path: '/treatments',
    title: 'Treatments | Dr. Maris Aesthetics',
    description: 'Explore surgeon-led, anatomy-focused cosmetic surgery treatments at Dr. Maris Aesthetics in Vietnam.',
  })
}

/** Independent Treatments landing route. */
export default function TreatmentsPage() {
  return <StitchTreatmentPage showQuickFacts={false} />
}

export const dynamic = 'force-dynamic'
