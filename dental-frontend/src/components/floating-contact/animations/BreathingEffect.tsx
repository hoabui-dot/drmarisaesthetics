/**
 * Breathing Effect Animation Component
 * 
 * Subtle scale and shadow pulse to create "alive" feeling without being annoying
 */

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BreathingEffectProps {
  children: ReactNode;
  isActive: boolean;
  color: "red" | "blue" | "sky" | "yellow";
}

const shadowColors = {
  red: "0 10px 30px rgba(239, 68, 68, 0.25)",
  blue: "0 10px 30px rgba(37, 99, 235, 0.25)",
  sky: "0 10px 30px rgba(14, 165, 233, 0.25)",
  yellow: "0 10px 30px rgba(251, 191, 36, 0.25)",
};

const shadowColorsPulse = {
  red: "0 15px 40px rgba(239, 68, 68, 0.4)",
  blue: "0 15px 40px rgba(37, 99, 235, 0.4)",
  sky: "0 15px 40px rgba(14, 165, 233, 0.4)",
  yellow: "0 15px 40px rgba(251, 191, 36, 0.4)",
};

export function BreathingEffect({ children, isActive, color }: BreathingEffectProps) {
  return (
    <motion.div
      animate={isActive ? {
        scale: [1, 1.06, 1],
        boxShadow: [
          shadowColors[color],
          shadowColorsPulse[color],
          shadowColors[color]
        ]
      } : {}}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "loop"
      }}
    >
      {children}
    </motion.div>
  );
}