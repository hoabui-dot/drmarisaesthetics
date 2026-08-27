'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useBookingModal } from '@/src/components/booking-modal/BookingModalContext';
import { useMobileAnimation } from '@/src/hooks/useMobileAnimation';
import { cn } from '@/src/lib/utils';

interface BookingButtonProps {
  label?: string;
  subtitle?: string;
  className?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}

/**
 * BookingButton - A standardized CTA button for dental bookings.
 *
 * Ensures the font size is at least 20px on desktop (md:text-xl)
 * and automatically integrates with the BookingModal.
 *
 * Mobile optimization:
 * - whileHover/whileTap scale is kept (it's interaction-driven, not infinite)
 * - Infinite arrow animation is disabled on mobile to save CPU
 */
export const BookingButton = ({
  label = 'Book a Consultation',
  subtitle,
  className,
  showIcon = true,
  fullWidth = false,
}: BookingButtonProps) => {
  const { open: openBookingModal } = useBookingModal();
  const { shouldSimplify } = useMobileAnimation();

  return (
    <motion.button
      whileHover={shouldSimplify ? undefined : { scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={openBookingModal}
      className={cn(
        "px-8 py-4 bg-[#165197] text-white rounded-2xl font-bold text-sm sm:text-base md:text-xl flex flex-col items-center justify-center shadow-xl shadow-[#165197]/25 transition-all whitespace-nowrap",
        fullWidth ? "w-full" : "w-auto",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2 w-full">
        <span>{label}</span>
        {showIcon && (
          // On mobile: static arrow (no infinite x-bounce)
          // On desktop: infinite gentle bounce
          shouldSimplify ? (
            <ArrowRight className="w-5 h-5 shrink-0" />
          ) : (
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ArrowRight className="w-5 h-5 shrink-0" />
            </motion.span>
          )
        )}
      </div>
      {subtitle && (
        <span className="text-[10px] sm:text-xs text-sky-100 font-normal mt-0.5">
          {subtitle}
        </span>
      )}
    </motion.button>
  );
};
