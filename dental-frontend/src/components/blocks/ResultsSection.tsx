'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { HomepageResultsSectionBlock, Media } from '@/src/types/strapi'

function mediaSource(media?: Media | { url: string }) {
  return media?.url || ''
}

/* Composite images already contain the before-and-after presentation. */
function CompositeResultImage({ story }: { story: HomepageResultsSectionBlock['stories'][number] }) {
  return (
    <div className="results-composite-image">
      <Image src={mediaSource(story.image || { url: '' })} alt={story.imageAlt || story.image?.alt || 'Composite before and after treatment result'} fill className="object-cover" sizes="(max-width: 1023px) 100vw, 36vw" priority />
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
          <CompositeResultImage story={activeStory} />
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
