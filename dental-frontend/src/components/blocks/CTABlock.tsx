"use client";

import Image from "next/image";
import { NavigationLink } from "@/src/components/ui/NavigationLink";
import type { HomepageCTABlock } from "@/src/types/strapi";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";

/**
 * CTABlock — Premium 2026 Redesign
 *
 * Mobile optimizations:
 * - Replaced stagger motion.div containers with MotionDiv (plain div on mobile)
 * - Removed motion.span underline scaleX animation on mobile (layout-triggering)
 * - Human image whileInView container → MotionDiv
 */

interface CTABlockProps {
  data: HomepageCTABlock & { hideButtonOnMobile?: boolean };
}

export function CTABlock({ data }: CTABlockProps) {
  const { shouldSimplify } = useMobileAnimation();

  const isExternal =
    data.buttonLink.startsWith("http") ||
    data.buttonLink.startsWith("mailto:") ||
    data.buttonLink.startsWith("tel:");

  // Split heading to highlight specific text
  const renderHeading = () => {
    if (!data.heading) return null;

    if (data.highlightText && data.heading.includes(data.highlightText)) {
      const parts = data.heading.split(data.highlightText);
      return (
        <>
          {parts[0]}
          <span className="text-primary-500 relative inline-block">
            {data.highlightText}
            <span 
              className={`absolute bottom-1 left-0 h-2 w-full bg-primary-100 -z-10 transition-transform duration-1000 origin-left ease-out ${!shouldSimplify ? 'scale-x-100 delay-500' : 'scale-x-100'}`}
              style={!shouldSimplify ? { transform: 'scaleX(var(--underline-scale, 0))', animation: 'kf-fade-in 1s forwards 0.5s' } : {}}
            />
          </span>
          {parts[1]}
        </>
      );
    }

    return data.heading;
  };

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-20 lg:py-0">
      {/* ── BACKGROUND LAYER ── */}
      <div className="absolute inset-0 z-0">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBFF] to-[#EBF5FF]" />

        {/* Background Image (if provided from CMS) */}
        {data.backgroundImage?.url && (
          <div className="absolute inset-0">
            <Image
              src={data.backgroundImage.url}
              alt={data.backgroundImage.alt || "CTA Background"}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}
      </div>

      {/* ── CONTENT CONTAINER ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative flex flex-col lg:flex-row items-center lg:items-stretch lg:min-h-[550px] xl:min-h-[650px]">

          {/* Human Asset — MotionDiv: immediate on mobile, animated on desktop */}
          <div className="relative w-full lg:absolute lg:right-0 lg:bottom-0 lg:w-1/2 lg:h-full z-20 flex items-center justify-center lg:justify-end mb-10 lg:mb-0">
            <PerformanceAnimation
              preset="scale-in"
              whileInView={true}
              duration={1.0}
              className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-full lg:h-[75%] self-end pointer-events-none"
            >
              <div className="relative w-full h-full drop-shadow-[0_25px_45px_rgba(30,58,95,0.2)]">
                {data.humanImage?.url && (
                  <Image
                    src={data.humanImage.url}
                    alt={data.humanImage.alt || "Dental Professional"}
                    fill
                    className="object-contain object-bottom transform"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={true}
                  />
                )}
              </div>
            </PerformanceAnimation>
          </div>

          {/* CTA Text Column — MotionDiv: immediate on mobile, stagger on desktop */}
          <PerformanceAnimation
            preset="slide-up"
            whileInView={true}
            duration={0.7}
            className="w-full lg:w-[50%] flex flex-col justify-center text-center lg:text-left py-4 sm:py-8 lg:py-20 relative z-30"
          >
            <div className="space-y-6 sm:space-y-8 mx-auto lg:mx-0">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-foreground leading-[1.15] tracking-tight">
                  {renderHeading()}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-[#4A6D95] font-normal leading-relaxed mx-auto lg:mx-0">
                  {data.subheading ||
                    "Experience patient-centered care with our English-speaking experts. Your journey to a perfect smile starts with a single click."}
                </p>
              </div>

              <div className={`flex flex-col sm:flex-row justify-center lg:justify-start gap-4 ${data.hideButtonOnMobile ? 'hidden lg:flex' : ''}`}>
                {isExternal ? (
                  <a
                    href={data.buttonLink}
                    className="group relative inline-flex items-center justify-center px-10 py-5 rounded-2xl text-white font-bold text-sm sm:text-base md:text-xl overflow-hidden shadow-xl hover:shadow-primary-500/30 transition-all duration-300 whitespace-nowrap"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F] to-[#2B5A8E] group-hover:scale-105 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center gap-2">
                      {data.buttonLabel}
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </a>
                ) : (
                  <NavigationLink
                    href={data.buttonLink}
                    className="group relative inline-flex items-center justify-center px-10 py-5 rounded-2xl text-white font-bold text-sm sm:text-base md:text-xl overflow-hidden shadow-xl hover:shadow-primary-500/30 transition-all duration-300 whitespace-nowrap"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F] to-[#2B5A8E] group-hover:scale-105 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center gap-2">
                      {data.buttonLabel}
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </NavigationLink>
                )}
              </div>
            </div>
          </PerformanceAnimation>
        </div>
      </div>
    </section>
  );
}
