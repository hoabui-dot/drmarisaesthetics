import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getOurTeam } from '@/src/lib/api/queries'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data'
import { OurTeamPage } from '@/src/components/OurTeamPage'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Our Team | Dr. Maris Aesthetics'
  const description = 'Meet the surgeon-led team behind Dr. Maris Aesthetics and our hospital-based cosmetic surgery care in Vietnam.'
  const content = await getOurTeam()
  return buildSeoMetadata({ path: '/our-team', pageSeo: (content as any)?.seo, title, description })
}

export default async function OurTeamRoute() {
  const { isEnabled: isDraftMode } = await draftMode()
  const content = await getOurTeam(isDraftMode)
  if (!content || !content.hero) notFound()
  const structuredData = await resolveStructuredData({
    pageType: 'about',
    path: '/our-team',
    title: 'Our Team | Dr. Maris Aesthetics',
    description: 'Meet the surgeon-led team behind Dr. Maris Aesthetics and our hospital-based cosmetic surgery care in Vietnam.',
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Our Team', path: '/our-team' }],
  })
  return <><StructuredDataScript data={structuredData} /><OurTeamPage data={content} /></>
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
