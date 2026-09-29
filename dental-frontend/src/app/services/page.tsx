import type { Metadata } from 'next'
import { getWebsiteSetting } from '@/src/lib/api/queries'
import { getServiceListingPage } from '@/src/lib/api/listings'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { ServicesPage } from '@/src/components/ServicesPage'

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({ path: '/services', title: 'Plastic Surgery Services | Dr. Maris Aesthetics', description: 'Explore surgeon-led plastic surgery procedures planned around anatomy, safety and long-term recovery.' })
}

export default async function ServicesPageRoute() {
  const [listing, websiteSetting] = await Promise.all([
    getServiceListingPage({ page: 1, pageSize: 6 }).catch(() => ({ items: [], total: 0, page: 1, pageSize: 6 })),
    getWebsiteSetting(),
  ])
  return <ServicesPage services={listing.items} total={listing.total} categories={websiteSetting?.serviceCategories || []} />
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
