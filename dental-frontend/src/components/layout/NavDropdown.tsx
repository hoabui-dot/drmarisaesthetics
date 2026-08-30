'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import type { NavChild } from '@/src/types/strapi';

/**
 * NavDropdown Component - 2026 Premium Design with Optimistic UI
 * 
 * Navigation dropdown menu with instant feedback and smooth animations.
 * Features optimistic UI updates and preloading.
 */

interface NavDropdownProps {
  label: string;
  href: string;
  children: NavChild[];
  isActive?: boolean;
  onNavigate?: (href: string) => void;
}

export function NavDropdown({ label, href, children, isActive: propIsActive, onNavigate }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isOptimisticActive, setIsOptimisticActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Determine active states with hierarchy: child overrides parent
  // Check if we're on the exact parent page
  const isOnParentPage = href === '/' 
    ? pathname === '/' 
    : pathname === href;
  
  // Check if any child is active
  const isChildActive = children.some(child => 
    child.href === '/' 
      ? pathname === '/' 
      : pathname.startsWith(child.href)
  );
  
  // Parent shows text color when parent OR child is active
  // But underline ONLY when on parent page (not child pages)
  const showParentTextActive = isOnParentPage || isChildActive;
  const showParentUnderline = isOnParentPage && !isChildActive;
  
  const isActive = propIsActive !== undefined 
    ? propIsActive 
    : isOptimisticActive || showParentTextActive;

  // Reset optimistic state when route changes
  useEffect(() => {
    if (showParentTextActive) {
      setIsOptimisticActive(false);
      setIsLoading(false);
    }
  }, [showParentTextActive]);

  const handleParentClick = () => {
    setIsOptimisticActive(true);
    setIsLoading(true);
    
    if (onNavigate) {
      onNavigate(href);
    }
    
    window.dispatchEvent(new Event('navigationStart'));
  };

  const handleChildClick = (childHref: string) => {
    setIsOptimisticActive(true);
    setIsLoading(true);
    
    if (onNavigate) {
      onNavigate(childHref);
    }
    
    window.dispatchEvent(new Event('navigationStart'));
  };

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsOpen(true);
    // Preload parent route
    router.prefetch(href);
    // Preload all child routes
    children.forEach(child => router.prefetch(child.href));
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setIsOpen(false), 90);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOpen(false);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsOpen(true)}
      onBlur={handleBlur}
    >
      {/* Parent Link */}
      <Link
        href={href}
        onClick={handleParentClick}
        style={{ fontSize: '18px' }}
        className={`
          relative font-medium transition-colors flex items-center gap-1
          px-3 py-2 rounded-lg
          ${isActive 
            ? 'text-primary-600 hover:text-white' 
            : 'text-foreground-secondary hover:text-white'
          }
          ${isLoading ? 'animate-pulse' : ''}
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
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
        
        {/* Smooth sliding underline animation - ONLY show when on parent page, NOT child pages */}
        {(showParentUnderline || isOpen) && <motion.span
          layoutId="global-header-nav-indicator"
          className={`absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 ${isLoading ? 'shadow-lg shadow-primary-500/50' : ''}`}
          transition={{ type: 'spring', stiffness: 520, damping: 36, mass: 0.7 }}
        />}
        
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

      {/* Dropdown Menu */}
      <AnimatePresence mode="wait">
        {isOpen && children.length > 0 && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              closed: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.16, ease: 'easeIn' } },
              open: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 32, mass: 0.8, staggerChildren: 0.045, delayChildren: 0.03 } },
            }}
            className="absolute top-full left-1/2 z-50 w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 pt-3"
          >
            {/* Invisible bridge to cover the gap */}
            <div className="absolute inset-x-0 top-0 h-3" aria-hidden="true" />
            
            {/* Actual dropdown content */}
            <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white/95 p-2 shadow-2xl backdrop-blur-xl">
              <div className={`grid gap-1 ${children.length > 3 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {children.map((child) => {
                const isChildActive = child.href === '/' 
                  ? pathname === '/' 
                  : pathname.startsWith(child.href);
                
                return (
                  <motion.div
                    key={child.id}
                    variants={{
                      closed: { opacity: 0, y: -6 },
                      open: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 500, damping: 34 } },
                    }}
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Link
                      href={child.href}
                      onClick={() => handleChildClick(child.href)}
                      className={`
                        block rounded-xl px-4 py-3 text-base whitespace-nowrap transition-colors duration-200
                        relative overflow-hidden group/item
                        ${isChildActive
                          ? 'text-white bg-smilux-primary font-medium'
                          : 'text-foreground-secondary hover:text-white'
                        }
                      `.trim()}
                    >
                      {/* Hover background effect */}
                      <span className="pointer-events-none absolute inset-0 rounded-xl bg-smilux-primary opacity-0 transition-opacity duration-200 group-hover/item:opacity-100" />
                      
                      <span className="relative z-10 flex items-center gap-2">
                        {isChildActive && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-1.5 h-1.5 rounded-full bg-primary-500"
                          />
                        )}
                        {child.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
