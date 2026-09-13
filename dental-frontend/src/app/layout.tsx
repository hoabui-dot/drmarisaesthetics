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
import { getWebsiteSetting } from '@/src/lib/api/queries'
import { GlobalCtaProvider } from '@/src/components/providers/GlobalCtaProvider'

const staticNavigation: Navigation = {
  navigation: [
    { id: 1, label: 'About', href: '/about-us' },
    { id: 2, label: 'Our Team', href: '/our-team' },
    { id: 3, label: 'Face', href: '/face/rhinoplasty', children: [
      { id: 31, label: 'Rhinoplasty', href: '/face/rhinoplasty' },
    ] },
    { id: 4, label: 'Treatments', href: '/treatments' },
    { id: 7, label: 'Services', href: '/services', children: [
      { id: 71, label: 'Blepharoplasty', href: '/services/blepharoplasty' },
      { id: 72, label: 'Breast Augmentation', href: '/services/breast-augmentation' },
      { id: 73, label: 'Buttock Augmentation', href: '/services/buttock-augmentation' },
      { id: 74, label: 'Facelift', href: '/services/facelift' },
      { id: 75, label: 'Gastric Sleeve', href: '/services/gastric-sleeve' },
      { id: 76, label: 'Labiaplasty', href: '/services/labiaplasty' },
      { id: 77, label: 'Liposuction', href: '/services/liposuction' },
      { id: 78, label: 'Rhinoplasty', href: '/services/rhinoplasty' },
    ] },
    { id: 5, label: 'Results', href: '/results' },
    { id: 6, label: 'Contact', href: '/contact' },
  ],
  ctaText: 'BOOK A CONSULTATION',
  ctaLink: '/contact#form-section',
}

const staticFooter: FooterData = {
  description: 'A surgeon-led aesthetic practice providing personalized, hospital-based cosmetic surgery care in Ho Chi Minh City.',
  contactInfo: { id: 1, address: 'City International Hospital, Ho Chi Minh City, Vietnam', phone: '+84 28 1234 5678', email: 'concierge@drmarisaesthetics.com' },
  links: [],
  linkGroups: [
    { id: 1, heading: 'EXPLORE', links: [{ id: 1, label: 'About Us', href: '/about-us' }, { id: 2, label: 'Our Team', href: '/our-team' }, { id: 3, label: 'Patient Results', href: '/results' }] },
    { id: 2, heading: 'PATIENTS', links: [{ id: 4, label: 'Rhinoplasty', href: '/face/rhinoplasty' }, { id: 5, label: 'Contact & Consultation', href: '/contact' }, { id: 6, label: 'Medical Disclaimer', href: '/medical-disclaimer' }] },
  ],
  socialLinks: [],
  appointmentLabel: 'BOOK A CONSULTATION',
  appointmentHref: '/contact#form-section',
  copyrightText: '© 2026 DR. MARIS AESTHETICS. ALL RIGHTS RESERVED.',
  tagline: 'Surgeon-led. Hospital-based. Individually planned.',
}

const staticContactMethods: ContactMethod[] = [
  { id: 1, type: 'phone', label: 'Call our team', href: 'tel:+842812345678', order: 1, isActive: true },
  { id: 2, type: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/842812345678', order: 2, isActive: true },
]

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
  const navigation = staticNavigation;
  const websiteSetting = await getWebsiteSetting();
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
    contactInfo: {
      ...staticFooter.contactInfo,
      address: websiteSetting.address || staticFooter.contactInfo.address,
      phone: websiteSetting.phonePrimary || staticFooter.contactInfo.phone,
      email: websiteSetting.email || staticFooter.contactInfo.email,
    },
    socialLinks: websiteSetting.socialLinks.map((link, index) => ({
      id: link.id || index + 1,
      platform: link.platform,
      url: link.url,
      iconClass: link.iconClass,
    })),
  } : staticFooter;
  const serviceOptions = ['Rhinoplasty', 'Revision Surgery', 'Facial Contouring', 'Breast Surgery'];

  return (
    <html lang="vi">
      <body className="antialiased flex flex-col min-h-screen">
        <ReCaptchaProvider>
          <BookingModalWrapper serviceOptions={serviceOptions}>
            <CallModalWrapper>
            <Header navigation={navigation} logoSrc={websiteSetting?.logo?.url} />
            <GlobalCtaProvider value={websiteSetting?.globalCta}>
              <main className="flex-1 overflow-x-clip">
                {children}
              </main>
            </GlobalCtaProvider>
            <Footer footer={footer} logoSrc={websiteSetting?.logo?.url} />

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
