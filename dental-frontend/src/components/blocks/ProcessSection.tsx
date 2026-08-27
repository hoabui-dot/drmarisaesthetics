'use client'

import { useRef, useState } from 'react'
import type { HomepageProcessBlock } from '@/src/types/strapi'
import { AnimatedSectionHeader } from '@/src/components/ui/AnimatedSectionHeader'
import { useMobileAnimation } from '@/src/hooks/useMobileAnimation'
import { PerformanceAnimation } from '@/src/components/ui/PerformanceAnimation'

/**
 * ProcessSection — 2026 Interactive Step Flow
 *
 * - Zigzag layout: odd steps left, even steps right
 * - Scroll-based step reveal: fade + slide up, staggered
 * - Gradient progress line that fills as you scroll
 * - Glassmorphism step cards (rgba white + backdrop-blur)
 * - Active step: scale 1.05 + blue glow
 * - Icon: hover rotate/bounce
 * - Background: radial blue gradient + soft blob decorations
 */

interface ProcessSectionProps {
  data: HomepageProcessBlock
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const STEP_ICONS = [
  // Calendar
  <svg key="cal" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>,
  // Clipboard
  <svg key="clip" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>,
  // Shield check
  <svg key="shield" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
  // Sparkle
  <svg key="spark" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>,
]

// ─── Gradient progress line ───────────────────────────────────────────────────

function StepCard({
  step,
  index,
  isLeft,
  isActive,
}: {
  step: HomepageProcessBlock['steps'][number]
  index: number
  isLeft: boolean
  isActive: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const { shouldSimplify } = useMobileAnimation()

  return (
    <PerformanceAnimation
      preset="slide-up-subtle"
      whileInView={true}
      delay={index * 0.1}
      className={`flex items-start md:items-center gap-4 sm:gap-6 md:gap-10 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* ── Card ── */}
      <div
        onMouseEnter={() => !shouldSimplify && setHovered(true)}
        onMouseLeave={() => !shouldSimplify && setHovered(false)}
        className={`relative flex-1 rounded-2xl p-5 sm:p-6 cursor-default transition-all duration-300 bg-white/90 ${isActive ? 'shadow-lg shadow-sky-200/50 border border-sky-200/50 scale-[1.05]' : 'shadow-sm border border-white/90 scale-100'}`}
      >
        {/* Step number badge - positioned opposite to the icon side */}
        <div className={`absolute -top-3 ${isLeft ? '-right-3' : 'md:-left-3 md:right-auto -right-3'}`}>
          <span
            className={`inline-flex items-center text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border-2 transition-all duration-300 ${
              isActive 
                ? 'border-sky-200/50 shadow-lg shadow-sky-200/50' 
                : 'border-white/90 shadow-sm'
            }`}
            style={{
              background: isActive
                ? 'linear-gradient(90deg, #3aa0ff, #007bff)'
                : 'rgba(56,189,248,0.1)',
              color: isActive ? '#fff' : '#0284c7',
            }}
          >
            Step {index + 1}
          </span>
        </div>

        {/* Active indicator */}
        {isActive && (
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs sm:text-sm md:text-base font-semibold text-primary-500 tracking-wide animate-kf-fade-in"
            >
              ● Active
            </span>
          </div>
        )}

        {/* Title with icon on mobile */}
        <div className="flex items-center gap-3 mb-1.5 mt-2">
          {/* Mobile icon - shown only on mobile, inline with title */}
          <div className="md:hidden shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #3aa0ff, #007bff)' }}
            >
              {STEP_ICONS[index % STEP_ICONS.length]}
            </div>
          </div>
          
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {step.title}
          </h3>
        </div>
        
        <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* ── Icon node (sits on the center line) - Desktop only ── */}
      <div className="relative shrink-0 hidden md:flex items-center justify-center">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white z-10 transition-all duration-300 ${isActive ? 'shadow-[0_0_0_6px_rgba(56,189,248,0.2),0_0_20px_rgba(56,189,248,0.35)] scale-110' : 'shadow-[0_0_0_3px_rgba(56,189,248,0.15)] scale-100'}`}
          style={{
            background: isActive
              ? 'linear-gradient(135deg, #3aa0ff, #007bff)'
              : 'linear-gradient(135deg, #7dd3fc, #38bdf8)',
          }}
        >
          <div
            className={`transition-transform duration-500 ${!shouldSimplify && hovered ? 'rotate-[12deg] -translate-y-1' : 'rotate-0 translate-y-0'}`}
          >
            {STEP_ICONS[index % STEP_ICONS.length]}
          </div>
        </div>
      </div>
    </PerformanceAnimation>
  )
}


// ─── Section ──────────────────────────────────────────────────────────────────

export function ProcessSection({ data }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(-1)
  const { shouldSimplify } = useMobileAnimation()

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-28 overflow-hidden"
      style={{ background: '#FFFFFF' }}
    >
      {/* ── Background radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(0,120,255,0.07), transparent 70%)',
        }}
      />

      {/* Soft blob decorations — static on mobile, animated on desktop */}
      {!shouldSimplify ? (
        <>
          <div
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none blur-[32px] animate-kf-blob-1 opacity-40"
            style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.12), transparent 70%)' }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full pointer-events-none blur-[40px] animate-kf-blob-2 opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(0,123,255,0.1), transparent 70%)' }}
          />
        </>
      ) : (
        <>
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none blur-[32px] opacity-40" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.12), transparent 70%)' }} />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full pointer-events-none blur-[40px] opacity-30" style={{ background: 'radial-gradient(circle, rgba(0,123,255,0.1), transparent 70%)' }} />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <AnimatedSectionHeader
          title={data.title}
          subtitle={data.subtitle}
          className="mb-10 sm:mb-14"
        />

        {/* ── Zigzag step flow ── */}
        <div className="relative">
          <div className="flex flex-col gap-10 sm:gap-14">
            {data.steps.map((step, index) => (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                isLeft={index % 2 === 0}
                isActive={activeStep === index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
