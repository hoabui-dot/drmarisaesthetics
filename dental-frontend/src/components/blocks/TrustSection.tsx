'use client';

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { X } from 'lucide-react'
import type { HomepageTrustBlock } from '@/src/types/strapi'
import { AnimatedSectionHeader } from '@/src/components/ui/AnimatedSectionHeader'
import { useMobileAnimation } from '@/src/hooks/useMobileAnimation'
import { PerformanceAnimation } from '@/src/components/ui/PerformanceAnimation'

interface TrustSectionProps {
  data: HomepageTrustBlock
}

// Counting animation hook
function useCountAnimation(end: number, duration: number = 2000, shouldStart: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!shouldStart) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, shouldStart])

  return count
}

// Stat Card Component with counting animation
function StatCard({ stat, index, shouldSimplify }: { stat: any; index: number; shouldSimplify: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  // Extract number from stat.number (remove commas, +, etc.)
  const numericValue = parseInt(stat.number.toString().replace(/[^0-9]/g, '')) || 0
  const animatedCount = useCountAnimation(numericValue, 2000, isInView)
  
  // Format the animated count with commas
  const formattedCount = animatedCount.toLocaleString()

  return (
    <div
      ref={ref}
      className={`group text-center p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-primary-100 flex flex-col items-center justify-center gap-3 w-full h-full ${!shouldSimplify ? 'animate-kf-float' : ''}`}
      style={!shouldSimplify ? { animationDelay: `${index * 0.5}s` } : {}}
    >
      {stat.icon && (
        <div className="relative w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center">
          <Image
            src={stat.icon.url}
            alt={stat.icon.alt || `Icon for ${stat.label}`}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 56px, 80px"
          />
        </div>
      )}
      <div className="text-xl min-[375px]:text-2xl sm:text-3xl lg:text-[38px] font-bold text-primary-600 leading-none flex items-baseline justify-center whitespace-nowrap">
        <span>{formattedCount}</span>
        {stat.suffix && (
          <span className="text-base min-[375px]:text-lg sm:text-xl lg:text-2xl ml-0.5">{stat.suffix}</span>
        )}
      </div>
      <div className="text-xs sm:text-sm md:text-base text-foreground-secondary font-semibold tracking-widest break-words w-full">
        {stat.label}
      </div>
    </div>
  )
}

export function TrustSection({ data }: TrustSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedAlt, setSelectedAlt] = useState<string>('')
  const { shouldSimplify } = useMobileAnimation()

  const closeLightbox = () => {
    setSelectedImage(null)
    setSelectedAlt('')
  }

  return (
    <section className="trust-section relative w-full overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32">
      {/* Static background — no animated gradient on mobile */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)'
          }}
        />
        {/* Only animate background on desktop */}
        {!shouldSimplify && (
          <>
            <div
              className="absolute inset-0 opacity-30 animate-kf-bg-shift-1"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.2) 0%, transparent 50%)`,
                backgroundSize: '200% 200%',
              }}
            />
            <div
              className="absolute inset-0 opacity-20 animate-kf-bg-shift-2"
              style={{
                backgroundImage: `radial-gradient(circle at 60% 30%, rgba(14, 165, 233, 0.25) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(56, 189, 248, 0.15) 0%, transparent 50%)`,
                backgroundSize: '200% 200%',
              }}
            />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <AnimatedSectionHeader
          title={data.title}
          subtitle={data.subtitle}
          className="mb-8 sm:mb-10 md:mb-12 max-w-5xl mx-auto w-full"
          subtitleClassName="px-2"
          titleClassName="px-4"
        />

        {/* Statistics Grid */}
        {data.stats && data.stats.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 min-[375px]:gap-4 sm:gap-6 md:gap-8 mb-20">
            {data.stats.map((stat, index) => (
              <PerformanceAnimation
                key={stat.id}
                preset="slide-up-subtle"
                whileInView={true}
                delay={index * 0.08}
                className="relative h-full flex"
              >
                <StatCard stat={stat} index={index} shouldSimplify={shouldSimplify} />
              </PerformanceAnimation>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            className="max-w-5xl mx-auto"
          >
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 md:gap-8">
              {data.certifications.map((cert, index) => (
                <PerformanceAnimation
                  key={cert.id}
                  preset="scale-in"
                  whileInView={true}
                  delay={index * 0.08}
                  onClick={() => {
                    if (cert.image) {
                      setSelectedImage(cert.image.url)
                      setSelectedAlt(cert.image.alt || cert.name)
                    }
                  }}
                  className={`group flex items-center justify-center p-3 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-primary-50 flex-shrink-0 ${cert.image ? 'cursor-pointer hover:scale-110' : ''}`}
                >
                  {cert.image ? (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 grayscale group-hover:grayscale-0 transition-[filter] duration-300">
                      <Image
                        src={cert.image.url}
                        alt={cert.image.alt || cert.name}
                        fill
                        className="object-contain pointer-events-none"
                        sizes="96px"
                      />
                    </div>
                  ) : (
                    <div className="text-center px-4">
                      <p className="text-xs sm:text-sm md:text-base font-semibold text-foreground group-hover:text-primary-600 transition-colors">
                        {cert.name}
                      </p>
                    </div>
                  )}
                </PerformanceAnimation>
              ))}
            </div>
          </PerformanceAnimation>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors z-50 flex items-center justify-center cursor-pointer"
              aria-label="Close image"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[85vh] h-[85vh] flex items-center justify-center rounded-2xl overflow-hidden p-2 sm:p-4"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="relative w-full h-full bg-white rounded-xl sm:rounded-2xl flex p-4 sm:p-6 md:p-8">
                <Image
                  src={selectedImage}
                  alt={selectedAlt}
                  fill
                  className="object-contain p-2 sm:p-4"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative elements — static divs on mobile, animated on desktop */}
      {!shouldSimplify ? (
        <>
          <div
            className="absolute top-20 left-10 w-48 h-48 sm:w-64 sm:h-64 bg-primary-400/30 rounded-full blur-3xl z-0 pointer-events-none animate-kf-blob-1"
          />
          <div
            className="absolute bottom-20 right-10 w-56 h-56 sm:w-80 sm:h-80 bg-primary-500/20 rounded-full blur-3xl z-0 pointer-events-none animate-kf-blob-2"
          />
        </>
      ) : (
        <>
          <div className="absolute top-20 left-10 w-48 h-48 bg-primary-400/15 rounded-full blur-3xl z-0 pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-56 h-56 bg-primary-500/10 rounded-full blur-3xl z-0 pointer-events-none" />
        </>
      )}
    </section>
  )
}
