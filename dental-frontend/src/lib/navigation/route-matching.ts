/** Normalize CMS navigation URLs and browser paths before comparing routes. */
export function normalizeNavigationPath(value: string): string {
  try {
    const path = new URL(value, 'https://navigation.local').pathname
    const normalized = path.replace(/\/+$/, '')
    return normalized || '/'
  } catch {
    return '/'
  }
}

/** Exact match for marking the link that represents the current page. */
export function isCurrentNavigationPage(pathname: string, href: string): boolean {
  return normalizeNavigationPath(pathname) === normalizeNavigationPath(href)
}

/** Segment-aware match for keeping a parent navigation item active on descendants. */
export function isNavigationPathWithin(pathname: string, href: string): boolean {
  const currentPath = normalizeNavigationPath(pathname)
  const targetPath = normalizeNavigationPath(href)

  return targetPath === '/'
    ? currentPath === '/'
    : currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
}
