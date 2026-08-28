import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getAboutPage } from '@/src/lib/api/queries'
import { PreviewBanner } from '@/src/components/PreviewBanner'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data'
import { StitchAboutUs } from '@/src/components/StitchAestheticPage'

/**
 * About Us Page
 *
 * Fetches content from the dedicated "About Page" single type in Strapi.
 * Renders the CMS-controlled About Us section order via AboutUsContent.
 */

export async function generateMetadata(): Promise<Metadata> {
    const title = 'About Us - Saigon International Dental Clinic'
    const description =
        'Learn about Saigon International Dental Clinic — 15+ years of trusted dental care for international patients in Vietnam. Transparent pricing, elite specialists, guaranteed results.'

    const content = await getAboutPage()
    return buildSeoMetadata({ path: '/about-us', pageSeo: content?.seo, title, description })
}

export default async function AboutUsPage() {
    try {
        const { isEnabled: isDraftMode } = await draftMode()
        const content = await getAboutPage(isDraftMode)

        if (!content) {
            notFound()
        }

        // Ensure content is an object, not a string
        const parsedContent = typeof content === 'string' ? JSON.parse(content) : content
        const structuredData = await resolveStructuredData({
            pageType: 'about', path: '/about-us', pageSeo: parsedContent?.seo,
            title: 'About Us - Saigon International Dental Clinic',
            description: 'Learn about Saigon International Dental Clinic — 15+ years of trusted dental care for international patients in Vietnam.',
            breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'About Us', path: '/about-us' }],
        })

        return (
            <>
                <StructuredDataScript data={structuredData} />
                {isDraftMode && <PreviewBanner />}
                <main className={isDraftMode ? 'min-h-screen bg-background pt-20' : 'min-h-screen bg-background'}>
                    <StitchAboutUs />
                </main>
            </>
        )
    } catch (error) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full text-center space-y-4 px-4">
                    <div className="text-size-error-icon">⚠️</div>
                    <h1 className="text-size-error-title font-bold text-foreground">Error Loading Page</h1>
                    <p className="text-foreground-secondary">
                        We encountered an error loading the About Us page. Please try again later.
                    </p>
                    <pre className="text-size-error-debug text-left bg-gray-100 p-4 rounded overflow-auto max-h-40">
                        {error instanceof Error ? error.message : String(error)}
                    </pre>
                </div>
            </main>
        )
    }
}

// Disable all caching for this page to guarantee instant updates from CMS
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
