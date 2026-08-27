/**
 * Premium Tooltip Component
 * 
 * Minimal, high-end tooltip for floating contact system
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  isVisible: boolean;
  position?: "left" | "right" | "top" | "bottom";
}

export function Tooltip({ 
  children, 
  content, 
  isVisible, 
  position = "left" 
}: TooltipProps) {
  const positionClasses = {
    left: "right-full mr-3 top-1/2 -translate-y-1/2",
    right: "left-full ml-3 top-1/2 -translate-y-1/2", 
    top: "bottom-full mb-3 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-3 left-1/2 -translate-x-1/2"
  };

  const arrowClasses = {
    left: "left-full top-1/2 -translate-y-1/2 border-l-white border-l-4 border-y-transparent border-y-4 border-r-0",
    right: "right-full top-1/2 -translate-y-1/2 border-r-white border-r-4 border-y-transparent border-y-4 border-l-0",
    top: "top-full left-1/2 -translate-x-1/2 border-t-white border-t-4 border-x-transparent border-x-4 border-b-0",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-white border-b-4 border-x-transparent border-x-4 border-t-0"
  };

  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 0 }}
            transition={{ 
              duration: 0.15,
              ease: [0.16, 1, 0.3, 1] // Premium easing
            }}
            className={`absolute z-50 ${positionClasses[position]}`}
          >
            <div className="bg-white text-gray-900 text-xs font-medium px-3 py-2 rounded-md shadow-lg border border-gray-100 whitespace-nowrap">
              {content}
              {/* Arrow */}
              <div className={`absolute ${arrowClasses[position]}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}