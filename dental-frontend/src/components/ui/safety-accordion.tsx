'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { PerformanceAnimation } from '@/src/components/ui/PerformanceAnimation'

function quickPreview(answer: string): string {
  if (!answer) return ''
  const clean = answer.replace(/\n/g, ' ').trim()
  if (clean.length <= 72) return clean
  return clean.slice(0, 72).replace(/\s\S*$/, '') + '…'
}

export function QuestionIcon({ question }: { question: string }) {
  const q = question.toLowerCase()

  if (/insur|payment|cost|price|fee|cover/.test(q)) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  }
  if (/emerg|pain|urgent|hurt|ache|bleed/.test(q)) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  }
  if (/appoint|visit|book|schedul|when|hour|open/.test(q)) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  }
  if (/treat|procedur|implant|whiten|brace|invisalign|crown|veneer/.test(q)) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  }
  if (/language|english|international|foreign|expat/.test(q)) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export interface SafetyAccordionItemProps {
  title: string
  content: string
  icon?: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  index?: number
}

export function SafetyAccordionItem({
  title,
  content,
  icon,
  isOpen,
  onToggle,
  index = 0,
}: SafetyAccordionItemProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <PerformanceAnimation
      preset="slide-up-subtle"
      whileInView={true}
      delay={index * 0.07}
      className="rounded-2xl overflow-hidden"
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: isOpen
            ? 'rgba(240,249,255,0.9)'
            : hovered
              ? 'rgba(255,255,255,0.85)'
              : 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: isOpen
            ? '1px solid rgba(56,189,248,0.35)'
            : hovered
              ? '1px solid rgba(56,189,248,0.18)'
              : '1px solid rgba(0,120,255,0.08)',
          boxShadow: isOpen
            ? '0 4px 24px rgba(56,189,248,0.12)'
            : hovered
              ? '0 4px 16px rgba(0,0,0,0.05)'
              : '0 2px 8px rgba(0,0,0,0.03)',
          transition: 'background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease',
        }}
      >
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 text-left flex items-start gap-3"
        aria-expanded={isOpen}
      >
        {icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${isOpen ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white' : 'bg-primary-50 text-primary-600'}`}
          >
            {icon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-lg sm:text-xl leading-snug ${isOpen ? 'text-primary-700' : 'text-foreground'}`}>
            {title}
          </p>
          <AnimatePresence initial={false}>
            {!isOpen && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm sm:text-base md:text-lg text-foreground-secondary/70 mt-0.5 truncate"
              >
                {quickPreview(content)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div
          className={`shrink-0 mt-1 transition-transform duration-300 ease-spring-subtle ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        >
          <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-primary-500' : 'text-foreground-secondary/50'}`} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.6 }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={{ duration: 0.25 }}
              className={`px-5 pb-5 text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed whitespace-pre-line ${icon ? 'pl-[52px] sm:pl-[60px]' : ''}`}
            >
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </PerformanceAnimation>
  )
}
