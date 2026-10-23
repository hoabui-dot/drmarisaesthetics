import type { Metadata } from 'next'
import { OurTeamPage } from '@/src/components/OurTeamPage'
import { ourTeamMockData } from '@/src/data/our-team'
import { getOurTeam } from '@/src/lib/api/queries'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data'

const PROFILE_PATH = '/our-team/dr-huy'
const PAGE_TITLE = 'Dr. Huy | Our Team | Dr. Maris Aesthetics'
const PAGE_DESCRIPTION = 'Meet Dr. Tran Minh Huy and learn about his experience in aesthetic surgery and patient-centered surgical care.'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getOurTeam(false)
  return buildSeoMetadata({ path: PROFILE_PATH, pageSeo: page?.seo.pageSeo, title: page?.seo.title || PAGE_TITLE, description: page?.seo.description || PAGE_DESCRIPTION })
}

export default async function DrHuyProfileRoute() {
  const cmsData = await getOurTeam(false)
  const structuredData = await resolveStructuredData({
    pageType: 'about',
    path: PROFILE_PATH,
    title: cmsData?.seo.title || PAGE_TITLE,
    description: cmsData?.seo.description || PAGE_DESCRIPTION,
    pageSeo: cmsData?.seo.pageSeo,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Dr. Huy', path: PROFILE_PATH },
    ],
  })

  return <><StructuredDataScript data={structuredData} /><OurTeamPage data={cmsData || ourTeamMockData} drHuyImageTreatment /></>
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
