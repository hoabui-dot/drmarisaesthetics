/**
 * Ping Ring Animation Component
 * 
 * iOS-style notification glow that expands outward to attract peripheral vision
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";

interface PingRingProps {
  isVisible: boolean;
  color: "red" | "blue" | "sky" | "yellow";
  size?: number;
}

const colorClasses = {
  red: "border-red-500/40",
  blue: "border-blue-600/40", 
  sky: "border-sky-500/40",
  yellow: "border-yellow-400/40",
};

export function PingRing({ isVisible, color, size = 56 }: PingRingProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`absolute inset-0 rounded-full border-2 ${colorClasses[color]}`}
          style={{
            width: size,
            height: size,
          }}
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ 
            scale: 1.8, 
            opacity: 0,
          }}
          exit={{ scale: 1, opacity: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1], // Premium easing
          }}
        />
      )}
    </AnimatePresence>
  );
}