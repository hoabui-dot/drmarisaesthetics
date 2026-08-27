'use client'

import { ContactHeroSection } from '@/src/components/blocks/ContactHeroSection'
import { ContactConsultationSection } from '@/src/components/blocks/ContactConsultationSection'
import { ContactClinicLocationSection } from '@/src/components/blocks/ContactClinicLocationSection'
import type { ContactMethod } from '@/src/types/strapi'
import type { ContactPageContent } from '@/src/lib/api/queries'

interface ContactPageClientProps {
  content: ContactPageContent
  contactMethods: ContactMethod[]
  serviceOptions: Array<{ label: string; value: string }>
}

export default function ContactPageClient({ content, serviceOptions }: ContactPageClientProps) {
  if (!content?.blocks?.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="flex animate-pulse flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="font-medium text-slate-500">Loading contact experience...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white selection:bg-blue-100 selection:text-blue-900">
      {content.blocks.map((block) => {
        if (block.__component === 'contact.hero') {
          return <ContactHeroSection key={block.id} data={block.data} />
        }

        if (block.__component === 'contact.consultation-section') {
          return <ContactConsultationSection key={block.id} data={{ ...block.data, serviceOptions }} />
        }

        if (block.__component === 'contact.map-section') {
          return <ContactClinicLocationSection key={block.id} data={block.data} />
        }

        return null
      })}
    </main>
  )
}
