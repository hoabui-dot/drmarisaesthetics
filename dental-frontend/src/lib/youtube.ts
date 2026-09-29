export function getYoutubeEmbedUrl(
  source: string,
  options: { autoplay?: boolean; background?: boolean } = {},
): string | null {
  try {
    const url = new URL(source.trim())
    const hostname = url.hostname.replace(/^www\./, '').toLowerCase()
    const pathSegments = url.pathname.split('/').filter(Boolean)
    let videoId = ''

    if (hostname === 'youtu.be') {
      videoId = pathSegments[0] || ''
    } else if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (url.pathname === '/watch') videoId = url.searchParams.get('v') || ''
      if (pathSegments[0] === 'shorts' || pathSegments[0] === 'embed') videoId = pathSegments[1] || ''
    }

    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return null

    const query = options.background
      ? `?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${videoId}&rel=0`
      : options.autoplay ? '?autoplay=1&rel=0' : '?rel=0'
    return `https://www.youtube.com/embed/${videoId}${query}`
  } catch {
    return null
  }
}
