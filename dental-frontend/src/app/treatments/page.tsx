import type { Metadata } from 'next'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { TreatmentLandingPage } from '@/src/components/TreatmentLandingPage'
import { getTreatmentsPage } from '@/src/lib/api/queries'

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({
    path: '/treatments',
    title: 'Treatments | Dr. Maris Aesthetics',
    description: 'Explore surgeon-led, anatomy-focused cosmetic surgery treatments at Dr. Maris Aesthetics in Vietnam.',
  })
}

/** Independent Treatments landing route. */
export default async function TreatmentsPage() {
  const data = await getTreatmentsPage()
  return <TreatmentLandingPage data={data || undefined} />
}

export const dynamic = 'force-dynamic'
