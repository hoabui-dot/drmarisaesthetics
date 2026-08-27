/**
 * Living UI Animation System
 *
 * Continuous subtle animations for always-visible floating contact icons
 * Creates "active presence" feeling without being distracting
 */

"use client";

import { useState } from "react";

/**
 * Hook for managing interaction states
 */
export function useInteractionStates() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleMouseDown = () => {
    setIsPressed(true);
    setShowRipple(true);

    // Reset ripple after animation
    setTimeout(() => setShowRipple(false), 300);
  };

  const handleMouseUp = () => setIsPressed(false);

  return {
    isHovered,
    isPressed,
    showRipple,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
    },
  };
}

/**
 * Get staggered animation delay for each icon
 * Creates natural rhythm by offsetting animations
 */
export function getStaggeredDelay(index: number): number {
  const delays = [0, 0.8, 1.6, 2.4]; // phone, facebook, zalo, scroll
  return delays[index] || 0;
}
