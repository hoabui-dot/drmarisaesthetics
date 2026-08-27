import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/src/components/layout/Header'
import { Footer } from '@/src/components/layout/Footer'
import { ReCaptchaProvider } from '@/src/components/providers/ReCaptchaProvider'
import { FloatingContactWrapper } from '@/src/components/floating-contact'
import { BookingModalWrapper } from '@/src/components/booking-modal/BookingModalWrapper'
import { CallModalWrapper } from '@/src/components/call-modal'
import { getNavigation, getFooter, getContactMethods } from '@/src/lib/api/queries'
import { Toaster } from 'sonner'
import { PromotionModal } from '@/src/components/blocks/PromotionModal'
import { CLINIC_INFO } from '@/src/lib/constants/contact'

import { NEXT_PUBLIC_STRAPI_URL } from '@/src/lib/env'

/**
 * Root Layout
 * 
 * This layout wraps all pages in the application.
 * Provides global fonts, styling configuration, header navigation, and footer.
 */

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: `${CLINIC_INFO.name} - Professional Dental Services`,
  },
  description: 'Professional dental services including dental implants, teeth whitening, and braces',
  icons: {
    icon: `${NEXT_PUBLIC_STRAPI_URL}/uploads/logo_37125485af.png`,
    shortcut: `${NEXT_PUBLIC_STRAPI_URL}/uploads/logo_37125485af.png`,
    apple: `${NEXT_PUBLIC_STRAPI_URL}/uploads/logo_37125485af.png`,
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // Fetch navigation data for header
  const navigation = await getNavigation();

  // Fetch footer data
  const footer = await getFooter();

  // Fetch contact methods for floating contact widget
  const contactMethods = await getContactMethods();

  // Extract service options from navigation (children of the "Services" or "Dịch vụ" nav item)
  const servicesNav = navigation.navigation.find(
    (item) => item.label.toLowerCase() === 'services' || item.label.toLowerCase() === 'dịch vụ' || item.href === '/services'
  );
  const serviceOptions = servicesNav?.children?.map((child) => child.label) || [];

  return (
    <html lang="vi">
      <body className="antialiased flex flex-col min-h-screen font-sans">
        <ReCaptchaProvider>
          <BookingModalWrapper serviceOptions={serviceOptions}>
            <CallModalWrapper>
            <Header navigation={navigation} />
            <main className="flex-1 overflow-x-clip">
              {children}
            </main>
            <Footer footer={footer} />

            {/* Global Features */}
            <FloatingContactWrapper contactMethods={contactMethods} />
            <PromotionModal />

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
