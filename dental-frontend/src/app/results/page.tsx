import type { Metadata } from 'next'
import { ResultsPage } from '@/src/components/ResultsPage'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { resultsMockData } from '@/src/data/results'

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({
    path: '/results',
    title: 'Patient Results Gallery | Dr. Maris Aesthetics',
    description: 'Explore published patient results and before-and-after cases from Dr. Maris Aesthetics.',
  })
}

export default async function ResultsRoute() {
  return <ResultsPage data={resultsMockData} />
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
