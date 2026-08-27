/**
 * Scroll to Top Button Component
 * 
 * 2026 Trendy Style - Utility button with minimal animation (10% attention)
 * - Minimal bounce
 * - Arrow animation with opacity fade
 * - Clean, not distracting
 */

"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Tooltip } from "@/src/components/ui/Tooltip";
import { ArrowUp } from "lucide-react";
import { useInteractionStates, getStaggeredDelay } from "@/src/hooks/useAttentionAnimations";
import { FlyingStars } from "./animations";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";

interface ScrollTopButtonProps {
  label: string;
  index: number;
}

export function ScrollTopButton({ label, index }: ScrollTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const { handlers } = useInteractionStates();

  // Staggered delay for natural rhythm
  const animationDelay = getStaggeredDelay(index);

  // Mobile detection
  const { isMobile } = useMobileAnimation();

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling 400px
      setIsVisible(window.scrollY > 400);
    };

    // Check initial scroll position
    toggleVisibility();

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowStars(true);
    handlers.onMouseEnter();

    // Hide stars after animation completes
    setTimeout(() => setShowStars(false), 800);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    handlers.onMouseLeave();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20,
        scale: isVisible ? 1 : 0.8
      }}
      transition={{
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={isVisible ? "block" : "hidden"}
    >
      <Tooltip
        content={label}
        isVisible={isHovered}
        position="left"
      >
        <div className="relative flex items-center justify-center w-14 h-14">
          {/* Main Button with Minimal Bounce (10% attention) - Icon Only */}
          <motion.button
            onClick={scrollToTop}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handlers.onMouseDown}
            onMouseUp={handlers.onMouseUp}

            // 🟡 MINIMAL BOUNCE - Utility button (10% attention)
            animate={isVisible ? {
              y: isMobile ? [0, -3, 0] : [0, -4, 0],
            } : {}}
            transition={{
              y: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: animationDelay,
              },
            }}

            // Hover State
            whileHover={{
              scale: 1.08,
              y: -6,
              rotate: -5,
              transition: { duration: 0.2 }
            }}

            // Click Feedback
            whileTap={{
              scale: 0.92,
              transition: { duration: 0.1 }
            }}

            className="
              relative w-[44px] h-[44px] bg-white hover:bg-primary-50 rounded-full
              border border-primary-100/50
              shadow-[0_8px_24px_rgba(22,81,151,0.12)] hover:shadow-[0_8px_24px_rgba(22,81,151,0.2)]
              transition-all duration-300 ease-out flex items-center justify-center
              focus:outline-none focus:ring-2 focus:ring-primary-500/50 
            "
            aria-label={label}
          >
            {/* Arrow with opacity fade animation */}
            <motion.div
              animate={{
                y: [0, -2, 0],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: animationDelay + 0.5,
              }}
              className="flex items-center justify-center w-full h-full relative z-10"
            >
              <ArrowUp className="w-4 h-4 text-primary-600 stroke-[2.5]" />
            </motion.div>

            {/* Flying Stars on Hover */}
            <FlyingStars
              isVisible={showStars}
              color="blue"
            />
          </motion.button>
        </div>
      </Tooltip>
    </motion.div>
  );
}