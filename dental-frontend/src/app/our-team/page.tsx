import type { Metadata } from 'next'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data'
import { OurTeamPage } from '@/src/components/OurTeamPage'
import { ourTeamMockData } from '@/src/data/our-team'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Our Team | Dr. Maris Aesthetics'
  const description = 'Meet the surgeon-led team behind Dr. Maris Aesthetics and our hospital-based cosmetic surgery care in Vietnam.'
  return buildSeoMetadata({ path: '/our-team', title, description })
}

export default async function OurTeamRoute() {
  const structuredData = await resolveStructuredData({
    pageType: 'about',
    path: '/our-team',
    title: 'Our Team | Dr. Maris Aesthetics',
    description: 'Meet the surgeon-led team behind Dr. Maris Aesthetics and our hospital-based cosmetic surgery care in Vietnam.',
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Our Team', path: '/our-team' }],
  })
  return <><StructuredDataScript data={structuredData} /><OurTeamPage data={ourTeamMockData} /></>
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
