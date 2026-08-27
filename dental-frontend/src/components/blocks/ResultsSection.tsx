'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { HomepageResultsSectionBlock, Media } from '@/src/types/strapi'

function mediaSource(media: Media) {
  return media?.url || ''
}

function BeforeAfterComparison({ story }: { story: HomepageResultsSectionBlock['stories'][number] }) {
  const [position, setPosition] = useState(50)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    const bounds = trackRef.current?.getBoundingClientRect()
    if (!bounds) return
    setPosition(Math.min(100, Math.max(0, ((clientX - bounds.left) / bounds.width) * 100)))
  }, [])

  useEffect(() => {
    setPosition(50)
  }, [story.id])

  useEffect(() => {
    const stopDragging = () => { dragging.current = false }
    const move = (event: PointerEvent) => {
      if (dragging.current) updatePosition(event.clientX)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stopDragging)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stopDragging)
    }
  }, [updatePosition])

  return (
    <div
      ref={trackRef}
      className="results-comparison"
      onPointerDown={(event) => {
        dragging.current = true
        updatePosition(event.clientX)
      }}
      role="group"
      aria-label="Interactive before and after comparison"
    >
      <Image src={mediaSource(story.afterImage)} alt={story.afterImage.alt || 'After treatment'} fill className="results-comparison-image" sizes="(max-width: 1023px) 100vw, 36vw" priority />
      <div className="results-comparison-before" style={{ width: `${position}%` }}>
        <Image src={mediaSource(story.beforeImage)} alt={story.beforeImage.alt || 'Before treatment'} fill className="results-comparison-image" sizes="(max-width: 1023px) 100vw, 36vw" />
      </div>
      <span className="results-comparison-label results-comparison-label-before">Before</span>
      <span className="results-comparison-label results-comparison-label-after">After</span>
      <div className="results-comparison-divider" style={{ left: `${position}%` }} aria-hidden="true">
        <span className="results-comparison-handle">↔</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label="Before and after comparison position"
        className="results-comparison-range"
      />
    </div>
  )
}

export function ResultsSection({ data }: { data: HomepageResultsSectionBlock }) {
  const stories = data.stories.slice(0, 4)
  const [activeIndex, setActiveIndex] = useState(0)
  if (!stories.length) return null

  const activeStory = stories[activeIndex]
  const previous = () => setActiveIndex((index) => Math.max(0, index - 1))
  const next = () => setActiveIndex((index) => Math.min(stories.length - 1, index + 1))

  return (
    <section id="home-results" className="results-section">
      <div className="results-container">
        <header className="results-header">
          <div className="results-heading-group">
            <p className="eyebrow">{data.eyebrow}</p>
            <h2>{data.heading}</h2>
            <p className="results-intro">{data.intro}</p>
          </div>
          <nav className="results-navigation" aria-label="Result story navigation">
            <button type="button" onClick={previous} disabled={activeIndex === 0} aria-label="Previous result">
              <ChevronLeft aria-hidden="true" />
            </button>
            <span>{String(activeIndex + 1).padStart(2, '0')}/{String(stories.length).padStart(2, '0')}</span>
            <button type="button" onClick={next} disabled={activeIndex === stories.length - 1} aria-label="Next result">
              <ChevronRight aria-hidden="true" />
            </button>
          </nav>
        </header>

        <div className="results-story-grid">
          <article className="results-story-content">
            <h3>{activeStory.title}</h3>
            <p>{activeStory.description}</p>
            <h4>What We Did</h4>
            <ul>
              {activeStory.treatments.map((treatment) => <li key={treatment}>{treatment}</li>)}
            </ul>
          </article>
          <BeforeAfterComparison story={activeStory} />
          <figure className="results-patient-media">
            <div className="results-patient-image">
              <Image src={mediaSource(activeStory.patientPortrait)} alt={activeStory.portraitAlt || activeStory.patientPortrait.alt || 'Smiling patient'} fill className="object-cover" sizes="(max-width: 1023px) 100vw, 30vw" />
            </div>
            <figcaption>“{activeStory.quote}”</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
