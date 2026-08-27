'use client'

import Image from 'next/image'
import type { HomepageAboutBlock } from '@/src/types/strapi'
import { useMobileAnimation } from '@/src/hooks/useMobileAnimation'
import { PerformanceAnimation } from '@/src/components/ui/PerformanceAnimation'

interface AboutBlockProps {
  data: HomepageAboutBlock
}

export function AboutBlock({ data }: AboutBlockProps) {
  const { shouldSimplify } = useMobileAnimation()

  return (
    <section className="about-block w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content — slide-right entrance */}
          <PerformanceAnimation
            preset="slide-right"
            whileInView={true}
            duration={0.6}
            className="space-y-6"
          >
            <h2 className="text-size-about-title font-bold text-foreground">
              {data.title}
            </h2>
            <div className="text-size-body text-foreground-secondary leading-relaxed whitespace-pre-line">
              {data.content}
            </div>
          </PerformanceAnimation>

          {/* Image — slide-left entrance */}
          {data.image && (
            <PerformanceAnimation
              preset="slide-left"
              whileInView={true}
              duration={0.6}
              className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src={data.image.url}
                alt={data.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </PerformanceAnimation>
          )}
        </div>
      </div>
    </section>
  )
}
