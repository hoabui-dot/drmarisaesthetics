import type { Metadata } from 'next'
import Script from 'next/script'
import { Cormorant_Garamond, EB_Garamond, Instrument_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { ReCaptchaProvider } from '@/src/components/providers/ReCaptchaProvider'
import { FloatingContactWrapper } from '@/src/components/floating-contact'
import { BookingModalWrapper } from '@/src/components/booking-modal/BookingModalWrapper'
import { CallModalWrapper } from '@/src/components/call-modal'
import { Toaster } from 'sonner'

import { BRAND_LOGO_PATH } from '@/src/lib/constants/brand'
import type { ContactMethod, Footer as FooterData, Navigation } from '@/src/types/strapi'
import { getServiceNavigationOptions, getWebsiteSetting } from '@/src/lib/api/queries'
import { GlobalCtaProvider } from '@/src/components/providers/GlobalCtaProvider'
import { FALLBACK_FOOTER, FALLBACK_HEADER_NAVIGATION } from '@/src/lib/constants/site-navigation'
import { getMarketingPublicConfig } from '@/src/lib/seo/seo-manager'
import { MarketingIntegrations } from '@/src/components/marketing/MarketingIntegrations'
import { CLINIC_INFO } from '@/src/lib/constants/contact'

const instrumentSans = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-instrument-sans',
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant-garamond',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-eb-garamond',
})

const staticNavigation: Navigation = {
  navigation: FALLBACK_HEADER_NAVIGATION.map((item) => ({ ...item })),
}

const staticFooter: FooterData = {
  description: 'A surgeon-led aesthetic practice providing personalized, hospital-based cosmetic surgery care in Ho Chi Minh City.',
  contactInfo: { id: 1, address: 'City International Hospital, Ho Chi Minh City, Vietnam', phone: '+84 28 1234 5678', email: '' },
  linkGroups: FALLBACK_FOOTER.linkGroups.map((group) => ({ ...group, links: group.links.map((link) => ({ ...link })) })),
  socialLinks: [],
  copyrightText: '© 2026 DR. MARIS AESTHETICS. ALL RIGHTS RESERVED.',
  tagline: 'Surgeon-led. Hospital-based. Individually planned.',
}

const staticContactMethods: ContactMethod[] = [
  { id: 1, type: 'phone', label: 'Call our team', href: 'tel:+842812345678', order: 1, isActive: true },
  { id: 2, type: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/842812345678', order: 2, isActive: true },
]

function buildNavigation(serviceOptions: Array<{ value: string; label: string }>, configuredNavigation?: Navigation['navigation']): Navigation {
  const sourceNavigation = configuredNavigation?.length ? configuredNavigation : staticNavigation.navigation
  return {
    ...staticNavigation,
    // Repeatable component array order in Website Settings is the canonical
    // menu order. Do not sort these items or replace configured dropdowns.
    navigation: sourceNavigation.map((item) => {
      if (item.href === '/services') {
        const optionsBySlug = new Map(serviceOptions.map((service) => [service.value, service]))
        const configuredChildren = item.children || []
        const configuredSlugs = new Set<string>()
        const orderedConfiguredChildren = configuredChildren.map((child) => {
          const pathname = child.href.split(/[?#]/, 1)[0].replace(/\/+$/, '')
          const slug = pathname.startsWith('/services/') ? pathname.slice('/services/'.length) : ''
          const service = optionsBySlug.get(slug)
          if (service) configuredSlugs.add(slug)
          return service ? { ...child, label: service.label } : child
        })
        const addedServices = serviceOptions
          .filter((service) => !configuredSlugs.has(service.value))
          .map((service, index) => ({
            id: 7000 + index,
            label: service.label,
            href: `/services/${service.value}`,
          }))

        return {
          ...item,
          isClickable: item.isClickable !== false,
          children: [...orderedConfiguredChildren, ...addedServices],
        }
      }

      if (item.href === '/our-team') {
        return {
          ...item,
          isClickable: false,
          // Website Settings repeatable-component order is authoritative here
          // too. Previously this branch rebuilt the submenu from array indexes,
          // which silently replaced the editor's child order with a fixed list.
          children: item.children?.length ? item.children : [
            { id: 8001, label: 'Dr. Huy', href: '/our-team/dr-huy' },
            { id: 8002, label: 'Dr. Cuong', href: '/our-team/dr-cuong' },
          ],
        }
      }

      return item
    }),
  }
}

/**
 * Root Layout
 * 
 * This layout wraps all pages in the application.
 * Provides global fonts, styling configuration, header navigation, and footer.
 */

const baseMetadata: Metadata = {
  title: {
    template: '%s',
    default: `${CLINIC_INFO.name} - Surgeon-Led Cosmetic Surgery`,
  },
  description: 'Surgeon-led, hospital-based cosmetic surgery in Ho Chi Minh City for international patients.',
  icons: {
    icon: BRAND_LOGO_PATH,
    shortcut: BRAND_LOGO_PATH,
    apple: BRAND_LOGO_PATH,
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const marketing = await getMarketingPublicConfig()
  const google = marketing.verifications.find((item) => item.provider === 'google_search_console' && item.method === 'meta_tag')?.token
  const bing = marketing.verifications.find((item) => item.provider === 'bing_webmaster' && item.method === 'meta_tag')?.token
  return {
    ...baseMetadata,
    verification: {
      ...(google ? { google } : {}),
      ...(bing ? { other: { 'msvalidate.01': bing } } : {}),
    },
  }
}

// Contact methods are read from Strapi at request time. The CMS URL is a
// runtime container secret/configuration value and must not be evaluated while
// the standalone image is being built.
export const dynamic = 'force-dynamic'

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const [websiteSetting, serviceOptions, marketing] = await Promise.all([getWebsiteSetting(), getServiceNavigationOptions(), getMarketingPublicConfig()]);
  const navigation = buildNavigation(serviceOptions, websiteSetting?.headerNavigation);
  const settingsContactMethods = websiteSetting?.contactMethods?.map((method) => ({
    id: method.id || 0,
    type: method.type,
    label: method.label,
    href: method.href,
    icon: method.icon,
    iconUrl: method.icon?.url,
    color: method.color,
    order: method.order || 0,
    isActive: method.isActive !== false,
  })) || [];
  const settingsEmail = websiteSetting?.contactMethods
    ?.find((method) => method.type.toLowerCase() === 'email' && method.isActive !== false)
    ?.href.replace(/^mailto:/i, '').split('?')[0].trim() || '';
  const contactMethods = settingsContactMethods.length > 0 ? settingsContactMethods : staticContactMethods;
  const footer: FooterData = websiteSetting ? {
    ...staticFooter,
    description: websiteSetting?.footerDescription || FALLBACK_FOOTER.description,
    linkGroups: websiteSetting?.footerLinkGroups?.length ? websiteSetting.footerLinkGroups : staticFooter.linkGroups,
    contactInfo: {
      ...staticFooter.contactInfo,
      address: staticFooter.contactInfo.address,
      phone: websiteSetting.phonePrimary || staticFooter.contactInfo.phone,
      email: settingsEmail,
    },
    copyrightText: websiteSetting?.footerCopyrightText || FALLBACK_FOOTER.copyrightText,
    tagline: websiteSetting?.footerTagline || FALLBACK_FOOTER.tagline,
    socialLinks: websiteSetting.socialLinks.map((link, index) => ({
      id: link.id || index + 1,
      platform: link.platform,
      url: link.url,
      iconClass: link.iconClass,
    })),
  } : staticFooter;
  return (
    <html lang="vi" className={`${instrumentSans.variable} ${cormorantGaramond.variable} ${ebGaramond.variable}`}>
      {process.env.NODE_ENV === 'production' && <>
        <Script id="drmaris-google-tag" src="https://www.googletagmanager.com/gtag/js?id=G-RHDCNF8W7B" strategy="afterInteractive" />
        <Script id="drmaris-google-tag-config" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RHDCNF8W7B');
          window.gtag = window.gtag || gtag;
          window.__drmarisGtagInitialized = true;
          window.__drmarisGoogleTagIds = Array.from(new Set([...(window.__drmarisGoogleTagIds || []), 'G-RHDCNF8W7B']));
        `}</Script>
      </>}
      <body className="antialiased flex flex-col min-h-screen">
        <MarketingIntegrations integrations={marketing.integrations} />
        <ReCaptchaProvider>
          <BookingModalWrapper serviceOptions={serviceOptions} bookingForm={websiteSetting?.bookingForm}>
            <CallModalWrapper>
            <Header navigation={navigation} logoSrc={websiteSetting?.logo?.url} />
            <GlobalCtaProvider value={websiteSetting?.globalCta}>
              <main className="flex-1 overflow-x-clip">
                {children}
              </main>
            </GlobalCtaProvider>
            <Footer footer={footer} logoSrc={websiteSetting?.logo?.url} hospitalLocations={websiteSetting?.hospitalLocations} />

            {/* Global Features */}
            <FloatingContactWrapper contactMethods={contactMethods} />

            {/* Global Toast Notifications */}
            <Toaster 
              position="bottom-right" 
              richColors 
              closeButton 
              toastOptions={{
                className: 'max-sm:mb-20 max-sm:mx-auto',
              }}
            />
            </CallModalWrapper>
          </BookingModalWrapper>
        </ReCaptchaProvider>
      </body>
    </html>
  )
}
