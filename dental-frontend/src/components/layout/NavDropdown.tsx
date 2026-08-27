'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
    setIsOpen(true);
    // Preload parent route
    router.prefetch(href);
    // Preload all child routes
    children.forEach(child => router.prefetch(child.href));
  };

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsOpen(false)}
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
            ? 'text-primary-600' 
            : 'text-foreground-secondary hover:text-primary-500'
          }
          ${isLoading ? 'animate-pulse' : ''}
        `.trim()}
      >
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
        <motion.span
          className={`
            absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600
            ${isLoading ? 'shadow-lg shadow-primary-500/50' : ''}
          `}
          initial={false}
          animate={{ 
            scaleX: showParentUnderline ? 1 : 0,
            opacity: isLoading ? [1, 0.7, 1] : 1
          }}
          whileHover={{ scaleX: isChildActive ? 0 : 1 }}
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

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 pt-2 w-max"
          >
            {/* Invisible bridge to cover the gap */}
            <div className="absolute top-0 left-0 right-0 h-2" />
            
            {/* Actual dropdown content */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary-50 py-3 overflow-hidden">
              {children.map((child, index) => {
                const isChildActive = child.href === '/' 
                  ? pathname === '/' 
                  : pathname.startsWith(child.href);
                
                return (
                  <motion.div
                    key={child.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={child.href}
                      onClick={() => handleChildClick(child.href)}
                      className={`
                        block px-5 py-3 text-lg whitespace-nowrap transition-all duration-200
                        relative overflow-hidden group/item
                        ${isChildActive
                          ? 'text-primary-600 bg-primary-50 font-medium'
                          : 'text-foreground-secondary hover:text-primary-500'
                        }
                      `.trim()}
                    >
                      {/* Hover background effect */}
                      <span className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200" />
                      
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
