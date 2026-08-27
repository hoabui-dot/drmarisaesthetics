/**
 * Ripple Effect Animation Component
 * 
 * Premium click feedback with radial ripple expansion
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";

interface RippleEffectProps {
  isVisible: boolean;
  color: "red" | "blue" | "sky" | "yellow";
}

const rippleColors = {
  red: "bg-white/30",
  blue: "bg-white/30",
  sky: "bg-white/30", 
  yellow: "bg-gray-900/20",
};

export function RippleEffect({ isVisible, color }: RippleEffectProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`absolute inset-0 rounded-full ${rippleColors[color]}`}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ 
            scale: 1.4, 
            opacity: 0,
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      )}
    </AnimatePresence>
  );
}