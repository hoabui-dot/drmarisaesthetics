import type { HomepageVideoHeroBlock } from "@/src/types/strapi";
import { VideoHeroContent } from "./VideoHeroContent";
import { VideoHeroBackground } from "./VideoHeroBackground";

interface VideoHeroProps {
  data: HomepageVideoHeroBlock;
}

/**
 * VideoHero - Optimized Server-First Component
 * 
 * Performance:
 * - Shell and layout rendered on server for instant LCP
 * - Heavy video logic isolated to VideoHeroBackground (Client Component)
 * - Critical animations moved to globals.css for 0ms start time
 */
export function VideoHero({ data }: VideoHeroProps) {
  if (!data.isActive) return null;

  const hasVideo = !!(data.videoUrl && data.videoUrl.trim() !== "");

  return (
    <section className="video-hero relative w-full min-h-screen overflow-hidden bg-primary-950">
      {/* Layer 1: Background (Client-side for video logic) */}
      <VideoHeroBackground 
        hasVideo={hasVideo}
        videoUrl={data.videoUrl}
        posterImageUrl={data.posterImage?.url}
        mobileBackgroundImageUrl={data.mobileBackgroundImage?.url}
      />

      {/* Layer 2: Multi-layer overlay (Desktop Only) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none hidden md:block"
        style={{
          background: `
            linear-gradient(180deg, rgba(5,15,30,0.4) 0%, rgba(5,15,30,0.2) 60%, rgba(5,15,30,0.4) 100%),
            radial-gradient(
              ellipse 130% 100% at 0% 50%,
              rgba(10, 20, 40, 0.50) 0%,
              rgba(10, 20, 40, 0.25) 55%,
              rgba(10, 20, 40, 0.05) 100%
            )
          `,
        }}
      />

      {/* Layer 3: Content (z-20) */}
      <div className="relative z-20 flex items-center min-h-screen pt-24 sm:pt-32 lg:pt-40 pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <VideoHeroContent
            badge="INTERNATIONAL STANDARD"
            titleLines={data.titleLines}
            subtitle={data.subtitle}
            ctaText={data.ctaText}
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="video-hero-scroll-indicator absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 w-7 sm:w-10 cursor-pointer transition-transform hover:scale-110">
        <svg className="w-full h-auto drop-shadow-2xl" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="arrowGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="holoGradient" x1="0" y1="0" x2="40" y2="80">
              <stop offset="0%" stopColor="#165197" />
              <stop offset="100%" stopColor="#4a88cc" />
            </linearGradient>
          </defs>
          <g filter="url(#arrowGlow)">
            <line x1="20" y1="10" x2="20" y2="60" stroke="url(#holoGradient)" strokeWidth="3" strokeLinecap="round" />
            <path stroke="url(#holoGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M8 48 L20 62 L32 48" />
          </g>
        </svg>
      </div>
    </section>
  );
}
