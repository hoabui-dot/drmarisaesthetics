import type { Metadata } from 'next'
import { DeepPlaneFaceliftSpecialistPage } from '@/src/components/DeepPlaneFaceliftSpecialistPage'
import { getDeepPlaneFaceliftSpecialist, getServiceOptions, getWebsiteSetting } from '@/src/lib/api/queries'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDeepPlaneFaceliftSpecialist()
  return {
    title: page.seo.title,
    description: page.seo.description,
  }
}

export default async function DeepPlaneFaceliftSpecialistRoute() {
  const [page, websiteSetting, serviceOptions] = await Promise.all([getDeepPlaneFaceliftSpecialist(), getWebsiteSetting(), getServiceOptions()])
  return <DeepPlaneFaceliftSpecialistPage page={page} websiteSettings={{ address: websiteSetting?.address, phonePrimary: websiteSetting?.phonePrimary, openingHours: websiteSetting?.openingHours, mapLatitude: websiteSetting?.mapLatitude, mapLongitude: websiteSetting?.mapLongitude, mapZoom: websiteSetting?.mapZoom }} serviceOptions={serviceOptions} />
}
