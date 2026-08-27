import Image from 'next/image'
import type { HomepagePressSectionBlock } from '@/src/types/strapi'

export function PressSection({ data }: { data: HomepagePressSectionBlock }) {
  const logos = data.logos.filter((logo) => logo.url)
  if (!logos.length) return null
  const track = [...logos, ...logos]

  return (
    <section id="home-press" className="press-section">
      <div className="press-container">
        <header className="press-header">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2>{data.heading}</h2>
        </header>
        <div className="press-slider" aria-label="Featured press publications">
          <button type="button" className="press-control" aria-label="Previous publications" aria-hidden="true" tabIndex={-1}>‹</button>
          <div className="press-viewport">
            <div className="press-track">
              {track.map((logo, index) => <div className="press-logo-slot" key={`${logo.url}-${index}`}><Image src={logo.url} alt={logo.alt || data.heading} width={logo.width || 180} height={logo.height || 64} className="press-logo" /></div>)}
            </div>
          </div>
          <button type="button" className="press-control" aria-label="Next publications" aria-hidden="true" tabIndex={-1}>›</button>
        </div>
      </div>
    </section>
  )
}
