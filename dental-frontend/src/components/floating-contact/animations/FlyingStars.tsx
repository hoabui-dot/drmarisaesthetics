/**
 * Flying Stars Animation Component
 * 
 * Creates flying stars effect on hover that disappear after animation
 * Trendy 2026 style micro-interaction
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FlyingStarsProps {
  isVisible: boolean;
  color: "blue" | "green" | "gradient" | "yellow";
}

const starColors = {
  blue: "#3b82f6", // Blue for phone/facebook
  green: "#22c55e", // Green for whatsapp
  gradient: "#ec4899", // Pink for instagram
  yellow: "#fbbf24", // Yellow for scroll
};

export function FlyingStars({ isVisible, color }: FlyingStarsProps) {
  const starColor = starColors[color];
  
  // Generate 5 stars at different angles
  const stars = [
    { angle: 0, delay: 0 },      // Top
    { angle: 72, delay: 0.05 },  // Top-right
    { angle: 144, delay: 0.1 },  // Bottom-right
    { angle: 216, delay: 0.15 }, // Bottom-left
    { angle: 288, delay: 0.2 },  // Top-left
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="absolute inset-0 pointer-events-none">
          {stars.map((star, index) => {
            // Calculate position based on angle
            const radian = (star.angle * Math.PI) / 180;
            const distance = 40; // Distance stars fly out
            const x = Math.cos(radian) * distance;
            const y = Math.sin(radian) * distance;

            return (
              <motion.div
                key={index}
                className="absolute top-1/2 left-1/2"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x,
                  y,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180],
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: star.delay,
                  ease: "easeOut",
                }}
              >
                {/* Star SVG */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill={starColor}
                  style={{
                    filter: `drop-shadow(0 0 4px ${starColor})`,
                  }}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
