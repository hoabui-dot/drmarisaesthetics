import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getCustomersPage } from '@/src/lib/api/queries'
import { PreviewBanner } from '@/src/components/PreviewBanner'
import { CustomerContent } from './CustomerContent'

/**
 * Customer Page
 * 
 * Dedicated page for customer testimonials, success stories, and benefits.
 * Similar structure to About Us page with custom rendering for CMS JSON content.
 */

export async function generateMetadata(): Promise<Metadata> {
    try {
        const { isEnabled: isDraftMode } = await draftMode()
        const { page } = await getCustomersPage(isDraftMode)

        const title = page?.title || 'Our Customers - Saigon International Dental Clinic'
        const description = page?.description || 'Discover why thousands of patients trust Saigon International Dental Clinic'

        return {
            title: isDraftMode ? `[PREVIEW] ${title}` : title,
            description,
            openGraph: {
                title,
                description,
                type: 'website',
                url: `${process.env.NEXT_PUBLIC_SERVER_URL}/customers`,
            },
        }
    } catch (error) {
        return {
            title: 'Our Customers',
            description: 'Discover why thousands of patients trust Saigon International Dental Clinic',
        }
    }
}

export default async function CustomerPage() {
    try {
        const { isEnabled: isDraftMode } = await draftMode()
        const { page, content } = await getCustomersPage(isDraftMode)

        return (
            <>
                {isDraftMode && <PreviewBanner />}

                <main className={isDraftMode ? "min-h-screen bg-background pt-20" : "min-h-screen bg-background"}>
                    <CustomerContent content={content} />
                </main>
            </>
        )
    } catch (error) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full text-center space-y-4 px-4">
                    <div className="text-6xl">!</div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Error Loading Page
                    </h1>
                    <p className="text-foreground-secondary">
                        We encountered an error while loading the Customer page. Please try again later.
                    </p>
                </div>
            </main>
        )
    }
}

// Disable all caching for this page to guarantee instant updates from CMS
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const dynamicParams = true;
