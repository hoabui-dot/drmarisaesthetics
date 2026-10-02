'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { getYoutubeEmbedUrl, getYoutubeVideoAspectRatio, getYoutubeVideoId } from '@/src/lib/youtube'

export interface CustomerVideoTestimonialProps {
  youtubeUrl: string
  quote: string
  customerName?: string
  customerDescription?: string
  thumbnailUrl?: string
  className?: string
}

function resolveThumbnailUrl(value: string | undefined, videoId: string): string {
  const candidate = value?.trim()
  if (candidate) {
    if (candidate.startsWith('/uploads/')) return `/api/strapi-media${candidate}`
    if (candidate.startsWith('/api/strapi-media/') || (candidate.startsWith('/') && !candidate.startsWith('//'))) return candidate
    try {
      const url = new URL(candidate)
      if (url.protocol === 'https:') return url.toString()
    } catch {
      // Invalid custom thumbnail URLs fall back to the YouTube preview.
    }
  }
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function CustomerVideoTestimonial({
  youtubeUrl,
  quote,
  customerName,
  customerDescription,
  thumbnailUrl,
  className = '',
}: CustomerVideoTestimonialProps) {
  const videoId = getYoutubeVideoId(youtubeUrl)
  const playerUrl = getYoutubeEmbedUrl(youtubeUrl, { autoplay: true })
  const videoAspectRatio = getYoutubeVideoAspectRatio(youtubeUrl)
  const [isPlaying, setIsPlaying] = useState(false)
  const normalizedQuote = quote.trim()

  if (!videoId || !playerUrl || !normalizedQuote) return null

  const thumbnail = resolveThumbnailUrl(thumbnailUrl, videoId)
  const sectionClassName = ['stitch-homepage-testimonial', className].filter(Boolean).join(' ')

  return (
    <section className={sectionClassName} aria-label="Customer video testimonial">
      <div className="stitch-homepage-testimonial__inner">
        <div className="stitch-homepage-testimonial__media" data-video-orientation={videoAspectRatio === '9 / 16' ? 'portrait' : 'landscape'}>
          <div className="stitch-homepage-testimonial__frame" style={{ aspectRatio: videoAspectRatio }}>
          {isPlaying ? (
            <iframe
              src={playerUrl}
              title={`Customer video testimonial${customerName ? ` from ${customerName}` : ''}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              // YouTube requires an HTTP Referer for embedded playback. An
              // explicit origin policy also survives stricter site/CDN-wide
              // referrer policies such as `same-origin` without exposing the
              // current page path or query string.
              referrerPolicy="origin"
            />
          ) : (
            <>
              {/* Native image keeps custom CMS thumbnails and YouTube previews simple and responsive. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbnail} alt="" loading="lazy" decoding="async" />
              <button
                className="stitch-homepage-testimonial__play"
                type="button"
                aria-label={`Play customer video testimonial${customerName ? ` from ${customerName}` : ''}`}
                onClick={() => setIsPlaying(true)}
              >
                <Play size={28} fill="currentColor" aria-hidden="true" />
              </button>
            </>
          )}
          </div>
        </div>

        <div className="stitch-homepage-testimonial__content">
          <div className="stitch-homepage-testimonial__quote-wrap">
            <blockquote>{normalizedQuote}</blockquote>
            <span className="stitch-homepage-testimonial__quotation" aria-hidden="true">“</span>
          </div>
          {(customerName || customerDescription) && (
            <footer>
              {customerName && <cite>{customerName}</cite>}
              {customerDescription && <p>{customerDescription}</p>}
            </footer>
          )}
        </div>
      </div>
    </section>
  )
}
