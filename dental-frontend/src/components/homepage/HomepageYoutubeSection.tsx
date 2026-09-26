import { getYoutubeEmbedUrl } from '@/src/lib/youtube'

type HomepageYoutubeSectionProps = {
  content: Record<string, unknown>
}

export function HomepageYoutubeSection({ content }: HomepageYoutubeSectionProps) {
  const source = typeof content.youtube_url === 'string' ? content.youtube_url : ''
  const embedUrl = getYoutubeEmbedUrl(source)

  // Do not render a broken iframe when the CMS section is not configured yet.
  if (!embedUrl) return null

  const eyebrow = typeof content.eyebrow === 'string' && content.eyebrow.trim()
    ? content.eyebrow.trim()
    : 'WATCH OUR APPROACH'
  const title = typeof content.title === 'string' && content.title.trim()
    ? content.title.trim()
    : 'A closer look at our surgical approach.'
  const description = typeof content.description === 'string' ? content.description.trim() : ''

  return (
    <section className="stitch-section stitch-homepage-video" aria-labelledby="homepage-video-title">
      <div className="stitch-container">
        <div className="stitch-section-heading stitch-section-heading--center">
          <span className="stitch-kicker">{eyebrow}</span>
          <h2 id="homepage-video-title">{title}</h2>
          {description ? <p className="stitch-lead">{description}</p> : null}
        </div>
        <div className="stitch-homepage-video__frame">
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
