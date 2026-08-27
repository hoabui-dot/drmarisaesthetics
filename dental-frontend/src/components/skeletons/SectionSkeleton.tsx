'use client';

import React from 'react';

interface SectionSkeletonProps {
  /**
   * Override the responsive min-height with a fixed value.
   * Only use this when you know the exact height at all breakpoints.
   * Prefer using `mobileHeight` and `desktopHeight` for responsive control.
   * 
   * @deprecated Prefer leaving this unset and using the responsive defaults.
   */
  height?: string;
  /**
   * Tailwind min-h class for mobile (applied from xs→md).
   * Defaults to 'min-h-[240px]'
   */
  mobileHeight?: string;
  /**
   * Tailwind min-h class for desktop (applied from md→).
   * Defaults to 'min-h-[480px]'
   */
  desktopHeight?: string;
  className?: string;
  hasHeader?: boolean;
  /**
   * Number of skeleton card columns to show.
   * Defaults to 3 (1 col mobile, 3 col desktop).
   */
  cols?: 1 | 2 | 3;
}

const colClass: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
};

/**
 * SectionSkeleton
 *
 * Responsive skeleton component to represent a lazy-loaded section.
 * Prevents CLS by reserving realistic space at every breakpoint.
 *
 * Height strategy:
 *  - Uses responsive Tailwind classes by default (mobileHeight / desktopHeight).
 *  - You can still pass a raw `height` for a fully fixed override (legacy).
 */
export function SectionSkeleton({
  height,
  mobileHeight = 'min-h-[240px]',
  desktopHeight = 'md:min-h-[480px]',
  className = '',
  hasHeader = true,
  cols = 3,
}: SectionSkeletonProps) {
  // If a legacy fixed height is passed, use it via inline style; otherwise use responsive classes.
  const inlineStyle = height ? { minHeight: height } : undefined;
  const responsiveHeightClass = height ? '' : `${mobileHeight} ${desktopHeight}`;

  return (
    <section
      className={`relative w-full overflow-hidden bg-background py-10 sm:py-16 ${responsiveHeightClass} ${className}`}
      style={inlineStyle}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {hasHeader && (
          <div className="mb-8 sm:mb-12 space-y-3 max-w-2xl mx-auto text-center">
            {/* Badge placeholder */}
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full w-20 mx-auto animate-pulse" />
            {/* Title placeholder */}
            <div className="h-8 sm:h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-3/4 mx-auto animate-pulse" />
            {/* Subtitle placeholder */}
            <div className="h-4 sm:h-5 bg-neutral-100 dark:bg-neutral-900 rounded w-1/2 mx-auto animate-pulse" />
          </div>
        )}

        <div className={`grid ${colClass[cols]} gap-4 sm:gap-6 lg:gap-8`}>
          {Array.from({ length: cols }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 p-4 sm:p-6 border border-neutral-100 dark:border-neutral-900 rounded-2xl"
            >
              {/* Image placeholder — shorter on mobile */}
              <div className="h-32 sm:h-40 md:h-48 bg-neutral-100 dark:bg-neutral-900 rounded-xl animate-pulse" />
              <div className="h-5 bg-neutral-100 dark:bg-neutral-900 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-neutral-100 dark:bg-neutral-900 rounded w-full animate-pulse" />
              <div className="h-4 bg-neutral-100 dark:bg-neutral-900 rounded w-5/6 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Decorative blobs — cheap, GPU-composited */}
      <div className="absolute top-0 right-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-primary-50/20 blur-[80px] sm:blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] bg-blue-50/20 blur-[60px] sm:blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
    </section>
  );
}
