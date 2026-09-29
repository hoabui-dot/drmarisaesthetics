import type { Metadata } from 'next'
import { BlogResultsPage } from '@/src/components/BlogResultsPage'
import { getBlogListingPage } from '@/src/lib/api/listings'
import { getWebsiteSetting } from '@/src/lib/api/queries'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({
    path: '/news',
    title: 'Patient Planning Journal | Dr. Maris Aesthetics',
    description: 'Clinically grounded guidance for planning plastic surgery, recovery and revision care.',
  })
}

export default async function NewsPage() {
  const [listing, websiteSetting] = await Promise.all([
    getBlogListingPage({ page: 1, pageSize: 6 }).catch(() => ({ items: [], total: 0, page: 1, pageSize: 6 })),
    getWebsiteSetting(),
  ])
  return <BlogResultsPage posts={listing.items} total={listing.total} categories={websiteSetting?.blogCategories || []} />
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
