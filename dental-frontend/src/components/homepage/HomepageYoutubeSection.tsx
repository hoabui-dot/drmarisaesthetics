import { getYoutubeEmbedUrl } from '@/src/lib/youtube'

type HomepageYoutubeSectionProps = {
  content: Record<string, unknown>
}

export function HomepageYoutubeSection({ content }: HomepageYoutubeSectionProps) {
  const source = typeof content.youtube_url === 'string' ? content.youtube_url : ''
  const embedUrl = getYoutubeEmbedUrl(source, { background: true })

  // Do not render a broken iframe when the CMS section is not configured yet.
  if (!embedUrl) return null

  return (
    <section className="stitch-homepage-video" aria-label="Dr. Maris Aesthetics video">
      <div className="stitch-homepage-video__frame">
        <iframe
          src={embedUrl}
          title="Dr. Maris Aesthetics video"
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  )
}
