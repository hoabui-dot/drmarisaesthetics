import type { Metadata } from 'next'
import { buildSeoMetadata } from '@/src/lib/seo/seo-manager'
import { resolveStructuredData, StructuredDataScript } from '@/src/lib/seo/structured-data'
import { StitchAboutUs } from '@/src/components/StitchAestheticPage'
import { getAboutPage } from '@/src/lib/api/queries'

/**
 * About Us Page
 *
 * Fetches content from the dedicated "About Page" single type in Strapi.
 * Renders the CMS-controlled About Us section order via AboutUsContent.
 */

export async function generateMetadata(): Promise<Metadata> {
    const title = 'About Us - DR. MARIS AESTHETICS'
    const description =
        'Learn about DR. MARIS AESTHETICS and our surgeon-led, hospital-based approach to cosmetic surgery in Vietnam.'

    return buildSeoMetadata({ path: '/about-us', title, description })
}

export default async function AboutUsPage() {
    try {
        const aboutPage = await getAboutPage()
        const structuredData = await resolveStructuredData({
            pageType: 'about', path: '/about-us',
            title: 'About Us - DR. MARIS AESTHETICS',
            description: 'Learn about DR. MARIS AESTHETICS and our surgeon-led, hospital-based approach to cosmetic surgery in Vietnam.',
            breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'About Us', path: '/about-us' }],
        })

        return (
            <>
                <StructuredDataScript data={structuredData} />
                <main className="min-h-screen bg-background">
                    <StitchAboutUs heroImage={aboutPage?.hero?.backgroundImage} content={aboutPage} />
                </main>
            </>
        )
    } catch (error) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full text-center space-y-4 px-4">
                    <div className="text-size-error-icon">⚠️</div>
                    <h2 className="text-size-error-title font-bold text-foreground">Error Loading Page</h2>
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
