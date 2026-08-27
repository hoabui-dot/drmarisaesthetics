'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMobileAnimation } from '@/src/hooks/useMobileAnimation';

interface VideoHeroBackgroundProps {
  hasVideo: boolean;
  videoUrl: string;
  posterImageUrl?: string;
  mobileBackgroundImageUrl?: string;
}

/**
 * VideoHeroBackground - Adaptive Media Layer
 * 
 * Performance:
 * - On Mobile (shouldSimplify): Skips heavy video/iframe logic entirely.
 * - On Desktop: Renders high-quality video or YouTube background.
 * - Uses poster image as a fall-back and LCP placeholder.
 */
export function VideoHeroBackground({
  hasVideo,
  videoUrl,
  posterImageUrl,
  mobileBackgroundImageUrl
}: VideoHeroBackgroundProps) {
  const { prefersReduced, isMobile } = useMobileAnimation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  // Track hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Robust Autoplay: Forcibly trigger playback on mount
  // This solves issues where React hydration or Safari strict policies interrupt native `autoPlay`
  useEffect(() => {
    if (mounted && videoRef.current && hasVideo && !prefersReduced && !isMobile) {
      videoRef.current.play();
    }
  }, [mounted, hasVideo, prefersReduced, isMobile, videoUrl]);

  // To prevent mobile devices from downloading 100MB MP4 files in the background,
  // we do NOT render the <video> tag at all during Server-Side Rendering (SSR).
  // We explicitly wait for the client to hydrate and confirm it is a desktop device.
  const shouldRenderVideo = mounted && !prefersReduced && !isMobile && hasVideo;

  // Low CPU Optimization: Show static poster image instead of video entirely
  if (prefersReduced || !hasVideo) {
    return (
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ 
          backgroundImage: mobileBackgroundImageUrl ? `url(${mobileBackgroundImageUrl})` : posterImageUrl ? `url(${posterImageUrl})` : 'none',
          backgroundColor: '#040f1c' // Primary 950 fall-back
        }}
      />
    );
  }

  // Standard Render: Uses CSS media queries to instantly show correct layer
  return (
    <>
      {/* Mobile Layer (< 768px): Shows static background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 md:hidden"
        style={{ 
          backgroundImage: mobileBackgroundImageUrl ? `url(${mobileBackgroundImageUrl})` : posterImageUrl ? `url(${posterImageUrl})` : 'none',
          backgroundColor: '#040f1c' // Primary 950 fall-back
        }}
      >
        {/* Dark overlay to ensure background image is not too light */}
        <div className="absolute inset-0 bg-primary-950/50 pointer-events-none" />
      </div>

      {/* Desktop Layer (>= 768px): Plays high-quality video (Strictly JS Rendered) */}
      <div className="absolute inset-0 z-0 hidden md:block">
        {shouldRenderVideo ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={posterImageUrl}
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ 
              backgroundImage: posterImageUrl ? `url(${posterImageUrl})` : 'none',
              backgroundColor: '#040f1c' // Primary 950 fall-back
            }}
          />
        )}
      </div>
    </>
  );
}
