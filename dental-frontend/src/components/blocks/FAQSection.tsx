'use client'

import type { HomepageFAQBlock } from '@/src/types/strapi'
import { MotionFaqAccordion } from '@/src/components/ui/motion-faq-accordion'
import { AnimatedSectionHeader } from '@/src/components/ui/AnimatedSectionHeader'
import { cn } from '@/src/lib/utils'
import { PerformanceAnimation } from '@/src/components/ui/PerformanceAnimation'

/**
 * FAQSection — 2026 Premium Design
 *
 * Layout  : Single column FAQ accordion
 * Accordion: glassmorphism, spring expand, icon rotate 180°
 * Icons   : semantic per question keyword (insurance→shield, emergency→alert, visit→calendar)
 * Preview : first line of answer shown before opening
 * BG      : white background
 */

interface FAQSectionProps {
  data: HomepageFAQBlock
  maxWidthClassName?: string
}

// ─── Semantic icon picker ─────────────────────────────────────────────────────

function QuestionIcon({ question }: { question: string }) {
  const q = question.toLowerCase()

  // Insurance / payment
  if (/insur|payment|cost|price|fee|cover/.test(q)) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  }
  // Emergency / pain / urgent
  if (/emerg|pain|urgent|hurt|ache|bleed/.test(q)) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  }
  // Appointment / visit / book / schedule
  if (/appoint|visit|book|schedul|when|hour|open/.test(q)) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
      </svg>
    )
  }
  // Treatment / procedure / implant / whitening
  if (/treat|procedur|implant|whiten|brace|invisalign|crown|veneer/.test(q)) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  }
  // Language / international / english
  if (/language|english|international|foreign|expat/.test(q)) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    )
  }
  // Default: question mark
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function FAQSection({ data, maxWidthClassName = 'max-w-4xl' }: FAQSectionProps) {
  if (!data.questions || data.questions.length === 0) return null

  return (
    <section
      id="faq"
      className="relative py-16 sm:py-20 md:py-28 overflow-hidden"
      style={{ background: '#FFFFFF' }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(0,120,255,0.06), transparent 65%)',
        }}
      />

      {/* Full-width header — matches max-w-7xl of all other sections */}
      <PerformanceAnimation
        preset="slide-up-subtle"
        whileInView={true}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <AnimatedSectionHeader
          title={data.title}
          subtitle={data.subtitle}
          className="mb-8 sm:mb-10 md:mb-12"
        />
      </PerformanceAnimation>

      {/* Accordion — constrained to maxWidthClassName (default max-w-4xl) */}
      <div className={cn("relative z-10 mx-auto px-4 sm:px-6 lg:px-8", maxWidthClassName)}>
        <MotionFaqAccordion
          items={data.questions.map((item) => ({ id: item.id, question: item.question, answer: item.answer }))}
          className="faq-section__accordion flex flex-col gap-3"
          defaultOpenIndex={0}
          renderIcon={(item) => <QuestionIcon question={item.question} />}
        />
      </div>
    </section>
  )
}
