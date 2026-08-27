/**
 * Contact Icons for Floating Contact System
 * 
 * Dynamic image-based icons using images from Strapi CMS
 * Large icons (80px) for icon-only display without circle background
 */

import React from 'react';
import Image from 'next/image';

interface IconProps {
  className?: string;
}

interface DynamicIconProps extends IconProps {
  src: string;
  alt: string;
}

/**
 * Dynamic Contact Icon Component
 * 
 * Renders contact icons from Strapi CMS icon URLs
 * Used by FloatingButtonItem to display contact method icons
 */
export function DynamicContactIcon({ src, alt, className = "w-14 h-14" }: DynamicIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={56}
      height={56}
      className={className}
      unoptimized
    />
  );
}

export function ChevronUpIcon({ className = "w-10 h-10" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m18 15-6-6-6 6"/>
    </svg>
  );
}
