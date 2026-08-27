'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ComponentProps, MouseEvent } from 'react';

/**
 * NavigationLink Component
 * 
 * Enhanced Link component that triggers the global loading state
 * before navigation. Use this instead of Next.js Link for all
 * navigation that should show loading feedback.
 * 
 * Features:
 * - Triggers TopProgressBar on click
 * - Preloads route on hover
 * - Supports all Next.js Link props
 * - Works with external links (no loading state)
 */

type NavigationLinkProps = ComponentProps<typeof Link> & {
  /**
   * Disable loading state trigger (for external links)
   */
  disableLoading?: boolean;
};

export function NavigationLink({ 
  href, 
  onClick, 
  disableLoading = false,
  children,
  ...props 
}: NavigationLinkProps) {
  const router = useRouter();

  // Check if link is external
  const isExternal = typeof href === 'string' && (
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#')
  );

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Don't trigger loading for external links or if disabled
    if (isExternal || disableLoading) {
      return;
    }

    // Trigger global loading state
    window.dispatchEvent(new Event('navigationStart'));
  };

  const handleMouseEnter = () => {
    // Preload route on hover for faster navigation
    if (!isExternal && typeof href === 'string') {
      router.prefetch(href);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </Link>
  );
}
