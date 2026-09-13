import { NavigationLink } from "@/src/components/ui/NavigationLink";
import { BookingButton } from '@/src/components/ui/BookingButton';
import { DecorativeBadge } from '@/src/components/ui/DecorativeBadge';

interface TitleLine {
  id: number;
  text: string;
}

interface VideoHeroContentProps {
  badge?: string;
  titleLines?: TitleLine[];
  subtitle?: string;
  ctaText?: string;
}

/**
 * VideoHeroContent - Server-First Content
 * 
 * Performance:
 * - Rendered entirely on server for optimal SEO and LCP.
 * - Interactive elements (BookingButton) are hydrated separately.
 * - Animation delays handled via utility classes or CSS.
 */
export function VideoHeroContent({
  badge = "INTERNATIONAL STANDARD",
  titleLines,
  subtitle,
  ctaText = "Book Appointment",
}: VideoHeroContentProps) {
  return (
    <div className="max-w-3xl lg:max-w-4xl">
      {/* ── TRUST SIGNAL: Google Reviews ── */}
      <div className="flex items-center gap-3 mb-6 animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
        <div className="flex -space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <div className="text-[#165197] md:text-white font-medium text-sm sm:text-base drop-shadow-sm md:drop-shadow-none">
          <span className="font-bold">4.9/5</span> on Google Reviews
        </div>
        <div className="h-4 w-px bg-[#165197]/20 md:bg-white/20 hidden sm:block"></div>
        <div className="text-[#165197]/80 md:text-white/80 text-sm hidden sm:block">
          Trusted by <span className="text-[#165197] md:text-white font-semibold">2,000+</span> patients
        </div>
      </div>

      <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
        <DecorativeBadge
          text={badge}
          variant="dark"
          align="responsive"
          className="mb-5 sm:mb-6"
        />
      </div>

      <div className="!mb-10 sm:!mb-14">
        <h2 className="text-[#165197] md:text-white leading-[1.1] drop-shadow-sm md:drop-shadow-2xl mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight">
          {titleLines && titleLines.length > 0
            ? titleLines.map((line) => (
                <span key={line.id} className="block">{line.text}</span>
              ))
            : <span className="block">Video Hero Title</span>
          }
        </h2>
        {subtitle && (
          <p className="text-[#165197]/80 md:text-white/90 drop-shadow-sm md:drop-shadow-lg max-w-2xl text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-slide-up opacity-0"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="hidden sm:block">
          <BookingButton
            label={ctaText}
            className="w-full sm:w-auto px-8 sm:px-10 py-5 bg-primary-500 hover:bg-primary-600 shadow-xl shadow-primary-500/40 rounded-2xl text-lg sm:text-xl"
          />
        </div>

        <NavigationLink href="/services" className="w-full sm:w-auto">
          <button
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-5 bg-white/40 md:bg-white/10 backdrop-blur-xl hover:bg-white/60 md:hover:bg-white/20 text-[#165197] md:text-white text-lg sm:text-xl font-semibold rounded-2xl border border-[#165197]/30 md:border-white/30 transition-all duration-300 active:scale-95 whitespace-nowrap"
            style={{ transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span>Our Treatments</span>
          </button>
        </NavigationLink>
      </div>

      <div
        className="flex flex-wrap items-center gap-4 sm:gap-8 mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-[#165197]/20 md:border-white/20 animate-fade-in-up opacity-0"
        style={{ animationDelay: "0.6s" }}
      >
        {[
          { text: "Advanced Technology", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
          { text: "Absolute Safety", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
          { text: "International Quality", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2.5 text-[#165197] md:text-white/90 font-semibold md:font-medium drop-shadow-sm md:drop-shadow-md bg-white/60 md:bg-transparent border border-[#165197]/30 md:border-transparent rounded-full md:rounded-none px-4 py-2 md:p-0 backdrop-blur-sm md:backdrop-blur-none">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#165197] md:text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="text-sm sm:text-base md:text-lg">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
