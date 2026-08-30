'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

/**
 * NavLink Component - 2026 Premium Design with Optimistic UI
 * 
 * Navigation link with instant feedback and smooth underline animation.
 * Features:
 * - Optimistic UI: Updates immediately on click
 * - Smooth sliding underline animation
 * - Preload on hover for faster navigation
 * - Loading state with subtle glow
 */

interface NavLinkProps {
  href: string;
  label: string;
  className?: string;
  isActive?: boolean;
  onNavigate?: (href: string) => void;
}

export function NavLink({ href, label, className = '', isActive: propIsActive, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOptimisticActive, setIsOptimisticActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine if link is active
  // For home page (/), only match exact pathname
  // For other pages, match if pathname starts with href
  const isRouterActive = href === '/' 
    ? pathname === '/' 
    : pathname.startsWith(href);
  
  const isActive = propIsActive !== undefined 
    ? propIsActive 
    : isOptimisticActive || isRouterActive;

  // Reset optimistic state when route changes
  useEffect(() => {
    if (isRouterActive) {
      setIsOptimisticActive(false);
      setIsLoading(false);
    }
  }, [isRouterActive]);

  const handleClick = (_e: React.MouseEvent<HTMLAnchorElement>) => {
    // Don't prevent default - let Next.js handle navigation
    // But update UI optimistically
    setIsOptimisticActive(true);
    setIsLoading(true);
    
    // Notify parent (Header) about navigation
    if (onNavigate) {
      onNavigate(href);
    }
    
    // Dispatch custom event for progress bar
    window.dispatchEvent(new Event('navigationStart'));
  };

  const handleMouseEnter = () => {
    // Preload route on hover
    router.prefetch(href);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`
        relative font-medium transition-colors group
        px-3 py-2 rounded-lg
        ${isActive 
          ? 'text-primary-600 hover:text-white' 
          : 'text-foreground-secondary hover:text-white'
        }
        ${isLoading ? 'animate-pulse' : ''}
        ${className}
      `.trim()}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 rounded-lg bg-smilux-primary opacity-0 scale-[0.92] transition-opacity"
        initial={{ opacity: 0, scale: 0.92 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 520, damping: 34, mass: 0.6 }}
      />
      <span className="relative z-10">{label}</span>
      
      {/* Smooth sliding underline animation */}
      <motion.span
        className={`
          absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600
          ${isLoading ? 'shadow-lg shadow-primary-500/50' : ''}
        `}
        initial={false}
        animate={{ 
          scaleX: isActive ? 1 : 0,
          opacity: isLoading ? [1, 0.7, 1] : 1
        }}
        whileHover={{ scaleX: 1, backgroundColor: 'var(--smilux-primary)' }}
        transition={{ 
          scaleX: { duration: 0.25, ease: 'easeOut' },
          opacity: { duration: 0.5, repeat: isLoading ? Infinity : 0 }
        }}
        style={{ transformOrigin: 'left' }}
      />
      
      {/* Loading glow effect */}
      {isLoading && (
        <motion.span
          className="absolute inset-0 bg-primary-100 rounded-md -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </Link>
  );
}
