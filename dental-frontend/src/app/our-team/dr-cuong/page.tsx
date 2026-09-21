import type { Metadata } from 'next'
import { DeepPlaneFaceliftSpecialistPage } from '@/src/components/DeepPlaneFaceliftSpecialistPage'
import { getDeepPlaneFaceliftSpecialist, getServiceOptions, getWebsiteSetting } from '@/src/lib/api/queries'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'

const PROFILE_PATH = '/our-team/dr-cuong'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDeepPlaneFaceliftSpecialist()
  return buildSeoMetadata({ path: PROFILE_PATH, title: page.seo.title, description: page.seo.description })
}

export default async function DrCuongProfileRoute() {
  const [page, websiteSetting, serviceOptions] = await Promise.all([
    getDeepPlaneFaceliftSpecialist(),
    getWebsiteSetting(),
    getServiceOptions(),
  ])

  return <DeepPlaneFaceliftSpecialistPage page={page} websiteSettings={{
    address: websiteSetting?.address,
    phonePrimary: websiteSetting?.phonePrimary,
    openingHours: websiteSetting?.openingHours,
    mapLatitude: websiteSetting?.mapLatitude,
    mapLongitude: websiteSetting?.mapLongitude,
    mapZoom: websiteSetting?.mapZoom,
  }} serviceOptions={serviceOptions} />
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
