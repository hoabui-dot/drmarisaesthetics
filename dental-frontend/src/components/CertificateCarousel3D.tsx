'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'

interface Certificate {
  id: number
  title: string
  organization: string
  imageUrl: string
  badgeUrl?: string
}

interface CertificateCarousel3DProps {
  certificates: Certificate[]
  radius?: number
}

export function CertificateCarousel3D({
  certificates,
  radius = 400
}: CertificateCarousel3DProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [currentRadius, setCurrentRadius] = useState(radius)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<Certificate | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCurrentRadius(150)
      } else if (window.innerWidth < 1024) {
        setCurrentRadius(220)
      } else {
        setCurrentRadius(radius)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [radius])

  const totalItems = certificates.length

  // Calculate position for each card
  const getCardTransform = (index: number) => {
    let relativeIndex = index - activeIndex
    if (relativeIndex > totalItems / 2) relativeIndex -= totalItems
    if (relativeIndex < -totalItems / 2) relativeIndex += totalItems

    // Hardcode angle for visual balance: side cards are closer, like ±35deg
    const theta = relativeIndex === 0 ? 0 : Math.sign(relativeIndex) * (35 + (Math.abs(relativeIndex) - 1) * 20)
    const thetaRad = (theta * Math.PI) / 180

    // Bring radius closer for side cards to avoid clipping
    const actualRadius = currentRadius - 100

    const x = actualRadius * Math.sin(thetaRad)
    // Z is relative to center. Center will pop out more
    const z = actualRadius * Math.cos(thetaRad) - actualRadius + (relativeIndex === 0 ? 100 : -100)

    // Ensure center has highest zIndex
    const zIndex = Math.round(100 * Math.cos(thetaRad))

    return {
      x,
      z,
      rotateY: theta,
      isActive: relativeIndex === 0,
      zIndex
    }
  }

  // Navigation handlers
  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalItems)
  }

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems)
  }

  const goToIndex = (index: number) => {
    setActiveIndex(index)
  }

  // Open lightbox
  const openLightbox = (certificate: Certificate) => {
    setLightboxImage(certificate)
    setLightboxOpen(true)
  }

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false)
    setLightboxImage(null)
  }

  // Drag handler
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    const threshold = 50
    if (info.offset.x > threshold) {
      goToPrev()
    } else if (info.offset.x < -threshold) {
      goToNext()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') {
          closeLightbox()
        }
        return
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems)
      }
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % totalItems)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [totalItems, lightboxOpen])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxOpen])

  return (
    <div className="relative w-full overflow-visible py-20 flex flex-col items-center">
      {/* 3D Stage Container */}
      <div
        ref={containerRef}
        className="relative mx-auto w-full"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
          height: '420px',
        }}
      >
        {/* 3D Carousel Wrapper */}
        <motion.div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          {certificates.map((certificate, index) => {
            const transform = getCardTransform(index)
            const isActive = transform.isActive

            return (
              <motion.div
                key={certificate.id}
                className="absolute top-1/2 left-1/2 cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
                suppressHydrationWarning
                initial={false}
                animate={{
                  x: transform.x,
                  z: transform.z,
                  rotateY: transform.rotateY,
                  scale: isActive ? 1.05 : 0.85,
                  opacity: 1,
                  y: '-50%',
                  zIndex: transform.zIndex,
                }}
                transition={{
                  type: 'tween',
                  ease: [0.4, 0, 0.2, 1],
                  duration: 0.6,
                }}
                onClick={() => {
                  if (!isDragging) {
                    if (isActive) {
                      openLightbox(certificate)
                    } else {
                      goToIndex(index)
                    }
                  }
                }}
              >
                <div className="relative -translate-x-1/2 group" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Certificate Card */}
                  <div
                    className="certificate-card relative w-[220px] sm:w-[260px] md:w-[300px] h-[300px] sm:h-[350px] md:h-[400px] rounded-[28px] overflow-hidden"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      background: 'linear-gradient(135deg, #ffffff 0%, #ebf5ff 100%)',
                      border: '1px solid rgba(100, 150, 255, 0.2)',
                      boxShadow: isActive
                        ? '0 30px 60px -12px rgba(0,0,0,0.25), 0 18px 36px -18px rgba(0,0,0,0.3)'
                        : '0 10px 20px -5px rgba(0,0,0,0.1)',
                      transition: 'box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {/* Rim Lighting */}
                    <div
                      className="absolute inset-0 rounded-[32px] pointer-events-none"
                      style={{
                        boxShadow: 'inset 0 0 20px rgba(255,255,255,0.8)',
                      }}
                    />

                    {/* Certificate Image as Background */}
                    <div className="relative h-full w-full">
                      <Image
                        src={certificate.imageUrl}
                        alt={certificate.title}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Gradient Overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Zoom Indicator - Only show on active card */}
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                            <ZoomIn className="w-8 h-8 text-primary-600" />
                          </div>
                        </div>
                      )}

                      {/* Text Content Card - Bottom Right with Premium Design */}
                      <motion.div 
                        className="absolute bottom-6 right-6 bg-white rounded-2xl p-4 shadow-2xl max-w-[220px] border-2 border-primary-100"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: 0.2,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                          transition: { duration: 0.2 }
                        }}
                      >
                        {/* Decorative Corner Accent */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary-500/10 to-transparent rounded-tr-2xl rounded-bl-full" />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <h3 className="text-sm font-bold mb-2 text-slate-900 leading-tight line-clamp-2">
                            {certificate.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-300 rounded-full" />
                            <p className="text-xs text-slate-700 font-semibold line-clamp-2 flex-1">
                              {certificate.organization}
                            </p>
                          </div>
                        </div>

                        {/* Shine Effect on Hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-2xl"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                      </motion.div>

                      {/* Floating Animation for Active Card */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          animate={{
                            y: [0, -8, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      )}
                    </div>

                    {/* Grayscale Filter for Inactive */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-slate-500/10" style={{ filter: 'grayscale(0.3)' }} />
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-12">
        <button
          onClick={goToPrev}
          className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
          aria-label="Previous certificate"
        >
          <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dot Indicators */}
        <div className="flex gap-2">
          {certificates.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`h-2 rounded-full transition-all ${index === activeIndex
                  ? 'w-8 bg-primary-600'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              aria-label={`Go to certificate ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
          aria-label="Next certificate"
        >
          <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Active Certificate Info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-slate-500 font-medium">
            {activeIndex + 1} / {totalItems}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8"
            onClick={closeLightbox}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-10 w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Container - Full Screen, Image Only */}
              <div className="relative w-full aspect-[4/3] max-h-[85vh]">
                {/* Close Button - Inside Image Container */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center justify-center group"
                  aria-label="Close lightbox"
                >
                  <X className="w-6 h-6 text-slate-700 group-hover:text-slate-900 group-hover:rotate-90 transition-all duration-300" />
                </button>

                <Image
                  src={lightboxImage.imageUrl}
                  alt={lightboxImage.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Hint Text */}
              <p className="text-center text-white/60 text-sm mt-4">
                Press ESC or click outside to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
