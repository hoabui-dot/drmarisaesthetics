'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSpring, useMotionValue } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { HomepageCombinedTestimonialResultBlock } from '@/src/types/strapi'
import { Button } from '@/src/components/ui/button'
import { AnimatedSectionHeader } from '@/src/components/ui/AnimatedSectionHeader'
import { useMobileAnimation } from '@/src/hooks/useMobileAnimation'
import { PerformanceAnimation } from '@/src/components/ui/PerformanceAnimation'

interface CombinedTestimonialResultProps {
  data: HomepageCombinedTestimonialResultBlock
}

type Item = HomepageCombinedTestimonialResultBlock['items'][number]

// Avatar background colors cycling
const AVATAR_COLORS = [
  'linear-gradient(135deg, #fbc2eb, #a18cd1)',
  'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
  'linear-gradient(135deg, #d4fc79, #96e6a1)',
  'linear-gradient(135deg, #ffecd2, #fcb69f)',
]

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-200'} fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Before/After Slider Component ───────────────────────────────────────────
function BeforeAfterSlider({ item }: { item: Item }) {
  const before = (item.beforeImage && item.beforeImage.url) ? item.beforeImage : {
    url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=60',
    alt: 'Before cosmetic surgery'
  }
  const after = (item.afterImage && item.afterImage.url) ? item.afterImage : {
    url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=60',
    alt: 'After cosmetic surgery'
  }

  const positionMV = useMotionValue(50)
  const springPos = useSpring(positionMV, { stiffness: 200, damping: 30 })
  const [displayPos, setDisplayPos] = useState(50)
  const [hovered, setHovered] = useState(false)

  const isDraggingRef = useRef(false)

  useEffect(() => {
    const unsub = springPos.on('change', (v) => setDisplayPos(v))
    return () => unsub()
  }, [springPos])

  useEffect(() => {
    positionMV.set(50)
  }, [item, positionMV])

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* After image - Background */}
      <div className="absolute inset-0">
        <Image src={after.url} alt={after.alt || 'After result'} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" priority />
      </div>

      {/* Before image - Foreground */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${displayPos}%` }}
      >
        <div className="absolute inset-0" style={{ width: `${100 / Math.max(displayPos / 100, 0.01)}%` }}>
          <Image src={before.url} alt={before.alt || 'Before result'} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
        </div>
      </div>

      {/* Scan line Glow */}
      <div
        className="absolute inset-y-0 w-[1px] pointer-events-none z-10"
        style={{
          left: `${displayPos}%`,
          background: 'rgba(255,255,255,0.8)',
          boxShadow: '0 0 20px 2px rgba(22, 81, 151, 0.4)',
        }}
      />

      {/* Labels - Glass Pill Style 2026 */}
      <div className="absolute top-6 left-6 z-20 bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 shadow-sm">
        <span className="text-xs sm:text-sm md:text-base text-foreground text-[10px] font-bold tracking-[0.1em] uppercase">Before</span>
      </div>
      <div className="absolute top-6 right-6 z-20 bg-primary-500/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary-400/30 shadow-sm">
        <span className="text-xs sm:text-sm md:text-base text-foreground text-[10px] font-bold tracking-[0.1em] uppercase">After</span>
      </div>

      {/* Slider Handle - Glass Circle 2026 */}
      <div
        className="absolute top-1/2 z-20 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
        style={{ left: `${displayPos}%` }}
      >
        <div
          className={`w-12 h-12 rounded-full bg-white/80 flex items-center justify-center border border-white/50 shadow-md transition-transform duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}
        >
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      </div>

      {/* Interaction Layer */}
      <input
        type="range"
        min="0"
        max="100"
        value={displayPos}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => positionMV.set(Number(e.target.value))}
        onMouseDown={() => { isDraggingRef.current = true }}
        onMouseUp={() => { isDraggingRef.current = false }}
        onTouchStart={() => { isDraggingRef.current = true }}
        onTouchEnd={() => { isDraggingRef.current = false }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
      />
    </div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────
export function CombinedTestimonialResult({ data }: CombinedTestimonialResultProps) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const { shouldSimplify } = useMobileAnimation()
  const items = data.items || []
  const total = items.length

  // Drag state
  const dragStartX = useRef(0)
  const dragCurrentX = useRef(0)
  const isDragging = useRef(false)

  const next = useCallback(() => {
    setActive((i) => (i + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + total) % total)
  }, [total])

  // Handle drag start
  const handleDragStart = useCallback((clientX: number) => {
    isDragging.current = true
    dragStartX.current = clientX
    dragCurrentX.current = clientX
    setPaused(true)
  }, [])

  // Handle drag move
  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging.current) return
    dragCurrentX.current = clientX
  }, [])

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    
    const diff = dragCurrentX.current - dragStartX.current
    const threshold = 50 // minimum pixels to trigger slide change
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Dragged right -> go to previous
        prev()
      } else {
        // Dragged left -> go to next
        next()
      }
    }
    
    setPaused(false)
  }, [next, prev])

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleDragStart(e.clientX)
  }, [handleDragStart])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleDragMove(e.clientX)
  }, [handleDragMove])

  const handleMouseUp = useCallback(() => {
    handleDragEnd()
  }, [handleDragEnd])

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)
  }, [handleDragStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX)
  }, [handleDragMove])

  const handleTouchEnd = useCallback(() => {
    handleDragEnd()
  }, [handleDragEnd])

  // Autoplay
  useEffect(() => {
    if (paused || total <= 1) return
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [paused, next, total])

  if (total === 0) return null

  const activeItem = items[active]

  return (
    <section
      className="relative py-12 sm:py-20 md:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[60%] h-[80%] bg-primary-400/5 blur-[120px] rounded-full -z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <AnimatedSectionHeader
          title={data.title}
          subtitle={data.subtitle}
          className="mb-8 sm:mb-10 md:mb-12"
        />

        {/* Carousel Container with Drag Support */}
        <div 
          className="relative"
        >
          {/* Left Arrow - Center of carousel */}
          {total > 1 && (
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-white shadow-lg flex items-center justify-center text-primary-600 hover:bg-white hover:scale-110 transition-all duration-300 -translate-x-1/2"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
            </button>
          )}

          {/* Right Arrow - Center of carousel */}
          {total > 1 && (
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-white shadow-lg flex items-center justify-center text-primary-600 hover:bg-white hover:scale-110 transition-all duration-300 translate-x-1/2"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
            </button>
          )}

        {/* Column Layout - Forced Equal height using items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 sm:gap-12 lg:gap-[60px] items-stretch max-w-7xl mx-auto">

          {/* LEFT COLUMN: Testimonial (No Dots) */}
          <div 
            className="order-2 lg:order-1 flex flex-col gap-4"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Testimonial Card - normal flow (not absolute), min-height set */}
              <PerformanceAnimation
                preset="slide-up-subtle"
                whileInView={true}
                className="bg-white p-6 sm:p-8 lg:p-12 rounded-[24px] sm:rounded-[32px] border border-neutral-100 shadow-md flex flex-col gap-4 min-h-[280px] sm:min-h-[360px] relative transition-transform duration-300 hover:-translate-y-2"
              >
                {/* Stars */}
                <Stars rating={activeItem.rating} />

                {/* Quote text - lightweight CSS crossfade */}
                <div className="flex-1 flex items-start sm:items-center relative">
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className={`w-full transition-all duration-500 ease-out ${
                        i === active 
                          ? 'opacity-100 translate-x-0 relative z-10' 
                          : 'opacity-0 absolute inset-0 pointer-events-none ' + (i < active ? '-translate-x-4' : 'translate-x-4')
                      }`}
                    >
                      <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-foreground leading-relaxed">
                        &ldquo;{item.content}&rdquo;
                      </h3>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 sm:gap-4 border-t border-neutral-100/50 pt-4 sm:pt-6 mt-auto">
                  <div
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-white text-base sm:text-lg shrink-0 shadow-sm transition-transform duration-500"
                    style={{ 
                      background: AVATAR_COLORS[active % AVATAR_COLORS.length],
                      transform: `scale(${paused ? 0.98 : 1})`
                    }}
                  >
                    {activeItem.customerName?.charAt(0) || 'C'}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    {/* Line 1: Name */}
                    <div className="mb-1.5">
                      <p className="font-bold text-sm sm:text-base md:text-lg text-foreground leading-none truncate">
                        {activeItem.customerName}
                      </p>
                    </div>

                    {/* Line 2: Country & View Results (Flex Space-Between) */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center text-neutral-500 font-medium text-[11px] sm:text-[13px]">
                        {activeItem.country || 'International Patient'}
                      </div>

                      <Button asChild variant="outline" size="sm" className="hidden sm:flex h-8 rounded-xl border-neutral-200 px-5 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-all duration-300 shrink-0 text-xs font-bold">
                        <Link href="/results">View Result</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Button - only shows on small screens below the info */}
                <Button asChild variant="outline" size="sm" className="sm:hidden w-full rounded-xl border-neutral-200 hover:bg-primary-50 hover:text-primary-600 transition-all duration-300 mt-2">
                  <Link href="/results">View Results</Link>
                </Button>
              </PerformanceAnimation>
          </div>

          {/* RIGHT COLUMN: Visual Result with GPU-accelerated CSS crossfade */}
          <div className="order-1 lg:order-2 relative group">
            <div className="absolute inset-0 bg-primary-400/10 blur-[100px] rounded-full scale-110 -z-10 translate-x-12" />

            <PerformanceAnimation
              preset="scale-in"
              whileInView={true}
              className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-white/20"
            >
              {/* CSS crossfade between slides — GPU accelerated via opacity and transform */}
              <div className="relative w-full h-full">
                {items.map((item, i) => (
                  <div
                    key={i}
                    style={{ willChange: 'opacity, transform' }}
                    className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      i === active 
                        ? 'opacity-100 scale-100 visible' 
                        : 'opacity-0 scale-105 invisible pointer-events-none'
                    }`}
                  >
                    <BeforeAfterSlider item={item} />
                  </div>
                ))}
              </div>
            </PerformanceAnimation>
          </div>

        </div>
        </div>
      </div>
    </section>
  )
}
