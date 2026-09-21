import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { ReCaptchaProvider } from '@/src/components/providers/ReCaptchaProvider'
import { FloatingContactWrapper } from '@/src/components/floating-contact'
import { BookingModalWrapper } from '@/src/components/booking-modal/BookingModalWrapper'
import { CallModalWrapper } from '@/src/components/call-modal'
import { Toaster } from 'sonner'
import { CLINIC_INFO } from '@/src/lib/constants/contact'

import { BRAND_LOGO_PATH } from '@/src/lib/constants/brand'
import type { ContactMethod, Footer as FooterData, Navigation } from '@/src/types/strapi'
import { getServiceNavigationOptions, getWebsiteSetting } from '@/src/lib/api/queries'
import { GlobalCtaProvider } from '@/src/components/providers/GlobalCtaProvider'
import { FALLBACK_FOOTER, FALLBACK_HEADER_NAVIGATION } from '@/src/lib/constants/site-navigation'

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
    navigation: sourceNavigation.map((item) => item.href === '/services'
      ? {
          ...item,
          isClickable: item.isClickable !== false,
          children: serviceOptions.map((service, index) => ({
            id: 7000 + index,
            label: service.label,
            href: `/services/${service.value}`,
          })),
        }
      : item.href === '/our-team'
        ? {
            ...item,
            isClickable: false,
            children: [
              { id: 8001, label: 'Dr. Huy', href: '/our-team/dr-huy' },
              { id: 8002, label: 'Dr. Cuong', href: '/our-team/dr-cuong' },
            ],
          }
        : item),
  }
}

/**
 * Root Layout
 * 
 * This layout wraps all pages in the application.
 * Provides global fonts, styling configuration, header navigation, and footer.
 */

export const metadata: Metadata = {
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

// Contact methods are read from Strapi at request time. The CMS URL is a
// runtime container secret/configuration value and must not be evaluated while
// the standalone image is being built.
export const dynamic = 'force-dynamic'

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const [websiteSetting, serviceOptions] = await Promise.all([getWebsiteSetting(), getServiceNavigationOptions()]);
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
  const contactMethods = settingsContactMethods.length > 0 ? settingsContactMethods : staticContactMethods;
  const footer: FooterData = websiteSetting ? {
    ...staticFooter,
    description: websiteSetting?.footerDescription || FALLBACK_FOOTER.description,
    linkGroups: websiteSetting?.footerLinkGroups?.length ? websiteSetting.footerLinkGroups : staticFooter.linkGroups,
    contactInfo: {
      ...staticFooter.contactInfo,
      address: websiteSetting.address || staticFooter.contactInfo.address,
      phone: websiteSetting.phonePrimary || staticFooter.contactInfo.phone,
      email: '',
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
    <html lang="vi">
      <body className="antialiased flex flex-col min-h-screen">
        <ReCaptchaProvider>
          <BookingModalWrapper serviceOptions={serviceOptions} bookingForm={websiteSetting?.bookingForm}>
            <CallModalWrapper>
            <Header navigation={navigation} logoSrc={websiteSetting?.logo?.url} />
            <GlobalCtaProvider value={websiteSetting?.globalCta}>
              <main className="flex-1 overflow-x-clip">
                {children}
              </main>
            </GlobalCtaProvider>
            <Footer footer={footer} logoSrc={websiteSetting?.logo?.url} mapLatitude={websiteSetting?.mapLatitude} mapLongitude={websiteSetting?.mapLongitude} mapZoom={websiteSetting?.mapZoom} />

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
