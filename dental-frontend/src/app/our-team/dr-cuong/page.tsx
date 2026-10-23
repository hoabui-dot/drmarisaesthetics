import type { Metadata } from 'next'
import { DeepPlaneFaceliftSpecialistPage } from '@/src/components/DeepPlaneFaceliftSpecialistPage'
import { getAboutHospitalLocations, getDeepPlaneFaceliftSpecialist, getServiceOptions, getWebsiteSetting } from '@/src/lib/api/queries'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data'

const PROFILE_PATH = '/our-team/dr-cuong'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDeepPlaneFaceliftSpecialist()
  return buildSeoMetadata({ path: PROFILE_PATH, pageSeo: page.seo.pageSeo, title: page.seo.title, description: page.seo.description })
}

export default async function DrCuongProfileRoute() {
  const [page, websiteSetting, serviceOptions, hospitalChapters] = await Promise.all([
    getDeepPlaneFaceliftSpecialist(),
    getWebsiteSetting(),
    getServiceOptions(),
    getAboutHospitalLocations(),
  ])
  const structuredData = await resolveStructuredData({
    pageType: 'about',
    path: PROFILE_PATH,
    title: page.seo.title,
    description: page.seo.description,
    pageSeo: page.seo.pageSeo,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Dr. Cuong', path: PROFILE_PATH },
    ],
  })

  return <><StructuredDataScript data={structuredData} /><DeepPlaneFaceliftSpecialistPage page={page} websiteSettings={{
    phonePrimary: websiteSetting?.phonePrimary,
    openingHours: websiteSetting?.openingHours,
    hospitalLocations: websiteSetting?.hospitalLocations,
  }} serviceOptions={serviceOptions} hospitalChapters={hospitalChapters} /></>
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
