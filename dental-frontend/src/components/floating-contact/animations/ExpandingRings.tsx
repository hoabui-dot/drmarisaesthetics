/**
 * Expanding Rings Animation Component
 * 
 * Creates 2-3 concentric expanding rings for "signal wave / incoming call" effect
 * Trendy 2026 style - priority attention for phone button
 */

"use client";

import { motion } from "framer-motion";

interface ExpandingRingsProps {
  color: "blue" | "green" | "gradient" | "yellow";
  count?: number;
}

const ringColors = {
  blue: "rgba(59, 130, 246, 0.4)", // Blue for phone/facebook
  green: "rgba(34, 197, 94, 0.4)", // Green for whatsapp
  gradient: "rgba(236, 72, 153, 0.4)", // Pink for instagram
  yellow: "rgba(251, 191, 36, 0.4)", // Yellow for scroll
};

export function ExpandingRings({ color, count = 3 }: ExpandingRingsProps) {
  const ringColor = ringColors[color];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* 🌟 SOFT PULSING GLOW (Inner Core) */}
      <motion.div
        className="absolute inset-0 rounded-full blur-lg"
        style={{ backgroundColor: ringColor }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 🌊 EXPANDING RINGS */}
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid ${ringColor.replace(/, [\d.]+\)/, ', 0.7)')}`,
          }}
          animate={{
            scale: [0.8, 1.8],
            opacity: [0, 0.4, 0], // Smooth fade in from 0 to prevent snap, then fade out
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: index * 0.8, // Better staggering
            ease: "easeOut",
            times: [0, 0.2, 1], // Ramp opacity up quickly then slow fade out
          }}
        />
      ))}
    </div>
  );
}
