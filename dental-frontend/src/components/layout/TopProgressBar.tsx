'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TopProgressBar Component
 * 
 * YouTube/Medium-style top progress bar for page transitions.
 * Shows loading feedback during navigation.
 */

export function TopProgressBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Reset on pathname change (navigation complete)
    setIsLoading(false);
    setProgress(0);
  }, [pathname]);

  useEffect(() => {
    if (!isLoading) return;

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Stop at 90%, complete on actual navigation
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Expose method to start loading
  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
      setProgress(0);
    };

    // Listen for custom event
    window.addEventListener('navigationStart', handleStart);
    return () => window.removeEventListener('navigationStart', handleStart);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: progress / 100, opacity: 1 }}
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 z-[100] origin-left shadow-lg shadow-primary-500/50"
          style={{ transformOrigin: 'left' }}
        />
      )}
    </AnimatePresence>
  );
}
