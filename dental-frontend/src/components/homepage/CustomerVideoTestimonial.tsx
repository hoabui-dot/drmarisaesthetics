'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { getYoutubeEmbedUrl, getYoutubeVideoAspectRatio, getYoutubeVideoId } from '@/src/lib/youtube'

export interface CustomerVideoTestimonialProps {
  youtubeUrl: string
  title: string
  subtitle?: string
  quote: string
  customerName?: string
  customerDescription?: string
  thumbnailUrl?: string
  stories?: PatientVideoStory[]
  className?: string
}

export interface PatientVideoStory {
  id: string
  youtubeUrl: string
  title?: string
  quote?: string
  source?: string
  description?: string
  thumbnailUrl?: string
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
  title,
  subtitle,
  quote,
  customerName,
  customerDescription,
  thumbnailUrl,
  stories = [],
  className = '',
}: CustomerVideoTestimonialProps) {
  const validStories = stories.filter((story) => getYoutubeVideoId(story.youtubeUrl))
  const storyList = validStories.length ? validStories : (youtubeUrl ? [{
    id: 'legacy-story', youtubeUrl, title: '', quote, source: customerName,
    description: customerDescription, thumbnailUrl,
  }] : [])
  const [activeStoryId, setActiveStoryId] = useState(storyList[0]?.id ?? '')
  const activeStory = storyList.find((story) => story.id === activeStoryId) ?? storyList[0]
  const [isPlaying, setIsPlaying] = useState(false)

  if (!activeStory) return null

  const videoId = getYoutubeVideoId(activeStory.youtubeUrl)
  const playerUrl = getYoutubeEmbedUrl(activeStory.youtubeUrl, { autoplay: true })
  const videoAspectRatio = getYoutubeVideoAspectRatio(activeStory.youtubeUrl)
  if (!videoId || !playerUrl) return null

  const thumbnail = resolveThumbnailUrl(activeStory.thumbnailUrl, videoId)
  const sectionClassName = ['stitch-homepage-testimonial', className].filter(Boolean).join(' ')
  const selectStory = (storyId: string) => {
    if (storyId === activeStory.id) return
    setIsPlaying(false)
    setActiveStoryId(storyId)
  }

  return (
    <section className={sectionClassName} aria-label="Customer video testimonial">
      <header className="stitch-section-heading stitch-homepage-testimonial__heading">
        <h2>{title.trim() || 'A patient’s perspective'}</h2>
        {subtitle?.trim() && <p className="stitch-lead">{subtitle.trim()}</p>}
      </header>
      <div className="stitch-homepage-testimonial__inner" key={activeStory.id}>
        <div className="stitch-homepage-testimonial__media" data-video-orientation={videoAspectRatio === '9 / 16' ? 'portrait' : 'landscape'}>
          <div className="stitch-homepage-testimonial__frame" style={{ aspectRatio: videoAspectRatio }}>
          {isPlaying ? (
            <iframe
              src={playerUrl}
              title={activeStory.title || `Patient story${activeStory.source ? ` from ${activeStory.source}` : ''}`}
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
                aria-label={`Play patient story${activeStory.source ? ` from ${activeStory.source}` : ''}`}
                onClick={() => setIsPlaying(true)}
              >
                <Play size={28} fill="currentColor" aria-hidden="true" />
              </button>
            </>
          )}
          </div>
        </div>

        <div className="stitch-homepage-testimonial__story">
          <div className="stitch-homepage-testimonial__content">
            <div className="stitch-homepage-testimonial__quote-wrap">
              {activeStory.title && <h3>{activeStory.title}</h3>}
              {activeStory.quote && <blockquote>{activeStory.quote}</blockquote>}
              <span className="stitch-homepage-testimonial__quotation" aria-hidden="true">“</span>
            </div>
            {(activeStory.source || activeStory.description) && (
              <footer>
                {activeStory.source && <cite>{activeStory.source}</cite>}
                {activeStory.description && <p>{activeStory.description}</p>}
              </footer>
            )}
          </div>
          {storyList.length > 1 && (
            <nav className="stitch-homepage-testimonial__playlist" aria-label="Choose a patient story">
              {storyList.map((story, index) => {
                const storyVideoId = getYoutubeVideoId(story.youtubeUrl)
                if (!storyVideoId) return null
                return (
                  <button
                    className="stitch-homepage-testimonial__story-card"
                    type="button"
                    key={story.id}
                    aria-pressed={story.id === activeStory.id}
                    aria-label={`Show story ${index + 1}${story.title ? `: ${story.title}` : ''}`}
                    onClick={() => selectStory(story.id)}
                  >
                    <span className="stitch-homepage-testimonial__story-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resolveThumbnailUrl(story.thumbnailUrl, storyVideoId)} alt="" loading="lazy" decoding="async" />
                      <span aria-hidden="true"><Play size={15} fill="currentColor" /></span>
                    </span>
                    <span className="stitch-homepage-testimonial__story-label">{story.title || story.source || `Patient story ${index + 1}`}</span>
                  </button>
                )
              })}
            </nav>
          )}
        </div>
      </div>
    </section>
  )
}
