/**
 * Floating Button Item Component
 * 
 * 2026 Trendy Style with Priority Attention Hierarchy:
 * - Phone (Primary): Strong attention with ringing effect + expanding rings
 * - Facebook/Zalo (Secondary): Soft floating + subtle pulse
 * - Always-colored icons (not gray)
 * - Flying stars on hover
 */

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { ContactMethod } from "@/src/types/strapi";
import { Tooltip } from "@/src/components/ui/Tooltip";
import { DynamicContactIcon } from "@/src/components/icons/ContactIcons";
import { useInteractionStates, getStaggeredDelay } from "@/src/hooks/useAttentionAnimations";
import { FlyingStars, ExpandingRings } from "./animations";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import { MotionDiv } from "@/src/components/ui/MotionDiv";

interface FloatingButtonItemProps {
  item: ContactMethod;
  index: number;
}

// Drop shadow filters matching actual icon colors from images
const dropShadowFilters: Record<string, string> = {
  blue: "drop-shadow(0 0 30px rgba(59,130,246,0.6))", // Blue glow (phone, facebook)
  green: "drop-shadow(0 0 30px rgba(34,197,94,0.6))", // Green glow (whatsapp)
  gradient: "drop-shadow(0 0 30px rgba(236,72,153,0.6))", // Pink/gradient glow (instagram)
};

type ContactAnimationColor = "blue" | "green" | "gradient" | "yellow";

function resolveAnimationColor(item: ContactMethod): ContactAnimationColor {
  const configured = item.color?.toLowerCase();
  if (configured === "blue" || configured === "green" || configured === "gradient" || configured === "yellow") {
    return configured;
  }
  if (item.type === "whatsapp") return "green";
  if (item.type === "instagram") return "gradient";
  return "blue";
}

export function FloatingButtonItem({
  item,
  index
}: FloatingButtonItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const { handlers } = useInteractionStates();
  const animationColor = resolveAnimationColor(item);

  // Priority detection
  const isPhonePrimary = item.type === "phone";
  const isSecondary = item.type === "facebook" || item.type === "zalo" || item.type === "whatsapp" || item.type === "instagram";

  // Staggered delay for natural rhythm
  const animationDelay = getStaggeredDelay(index);

  // Mobile detection for reduced animation intensity
  const { isMobile, shouldSimplify } = useMobileAnimation();

  const handleClick = () => {
    if (item.href.startsWith('tel:')) {
      window.location.href = item.href;
    } else {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    }
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

  // 🔴 PRIMARY PHONE BUTTON - STRONG ATTENTION (70%)
  const getPhonePrimaryAnimation = () => {
    if (!isPhonePrimary) return {};

    return {
      // Shake + Rotate (burst ringing then pause) - Array length is 11
      rotate: isMobile
        ? [0, 10, -10, 8, -8, 5, -5, 0, 0, 0, 0]
        : [0, 15, -15, 12, -12, 8, -8, 0, 0, 0, 0],

      // Pulse Scale matches the ringing burst timing - Array length is 6
      scale: isMobile ? [1, 1.1, 1.1, 1, 1, 1] : [1, 1.15, 1.15, 1, 1, 1],
    };
  };

  // 🔵 SECONDARY BUTTONS - SOFT ATTENTION (20%)
  const getSecondaryAnimation = () => {
    if (!isSecondary) return {};

    return {
      // Micro Rotation
      rotate: [0, 2, 0, -2, 0],
    };
  };

  // Get animation based on priority
  const getAnimation = () => {
    if (isPhonePrimary) return getPhonePrimaryAnimation();
    if (isSecondary) return getSecondaryAnimation();
    return {};
  };

  // Get transition timing based on priority
  const getTransition = (): any => {
    // Disable infinite animations on mobile/slow devices
    if (shouldSimplify) return { duration: 0.3 };

    if (isPhonePrimary) {
      return {
        rotate: {
          duration: 2.5, // 2.5s cycle per ring sequence
          repeat: Infinity,
          ease: "linear",
          delay: animationDelay,
          times: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.5, 0.7, 1], // Ring fast, then pause
        },
        scale: {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: animationDelay,
          times: [0, 0.1, 0.35, 0.5, 0.7, 1], // Grow during the ring, stay, shrink back
        },
      };
    }

    if (isSecondary) {
      return {
        rotate: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: animationDelay + 0.5,
        },
      };
    }

    return {};
  };

  return (
    // MotionDiv: on mobile → plain <div>, buttons immediately visible (no opacity:0 start)
    // on desktop → motion.div with fade+slide entrance
    <MotionDiv
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }}
      whileHover={shouldSimplify ? undefined : {
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <Tooltip
        content={item.label}
        isVisible={isHovered}
        position="left"
      >
        <div className="relative w-14 h-14 flex items-center justify-center">
          {/* 🔴 EXPANDING RINGS - Only for Phone (Primary) — Disable on mobile to save CPU */}
          {isPhonePrimary && !shouldSimplify && (
            <ExpandingRings color={animationColor} count={3} />
          )}

          {/* 🔵 SUBTLE PULSE RING - Only for Secondary */}
          {isSecondary && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: `2px solid ${item.color === 'blue'
                    ? 'rgba(59, 130, 246, 0.2)'
                    : item.color === 'green'
                      ? 'rgba(34, 197, 94, 0.2)'
                      : 'rgba(236, 72, 153, 0.2)' // gradient/instagram
                  }`,
              }}
              animate={{
                scale: [1, 1.6],
                opacity: [0.2, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: animationDelay,
                ease: "easeOut",
              }}
            />
          )}

          {/* Main Button with Priority-Based Animations - Icon Only (No Circle) */}
          <motion.button
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handlers.onMouseDown}
            onMouseUp={handlers.onMouseUp}

            // Priority-based continuous animations
            animate={getAnimation()}
            transition={getTransition()}

            // Hover State (enhanced interaction)
            whileHover={{
              scale: isPhonePrimary ? 1.12 : 1.08, // Phone gets stronger hover
              rotate: isPhonePrimary ? 5 : 3,
              transition: { duration: 0.2 }
            }}

            // Click Feedback
            whileTap={{
              scale: 0.92,
              transition: { duration: 0.1 }
            }}

            className="relative w-14 h-14 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            style={{
              filter: dropShadowFilters[item.color || 'blue'],
            }}
            aria-label={item.label}
          >
            {/* Icon - Full Size */}
            <div className="flex items-center justify-center w-full h-full relative z-10">
              {item.iconUrl ? (
                <DynamicContactIcon 
                  src={item.iconUrl} 
                  alt={item.label}
                />
              ) : (
                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  {item.type.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Flying Stars on Hover */}
            <FlyingStars
              isVisible={showStars}
              color={(item.color || 'blue') as any}
            />
          </motion.button>
        </div>
      </Tooltip>
    </MotionDiv>
  );
}
