import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const dynamic = 'force-dynamic'

/**
 * Enables Next.js draft mode for the Strapi Preview Button plugin.
 *
 * The CMS config registers only content types with a verified frontend route.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const secret = searchParams.get('secret')
  const expectedSecret = process.env.NEXT_PREVIEW_SECRET
  const slug = searchParams.get('slug')
  const type = searchParams.get('type') || 'page'

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: 'Invalid preview secret' }, { status: 401 })
  }

  const routes: Record<string, string> = {
    homepage: '/',
    'about-page': '/about-us',
    'contact-page': '/contact',
  }
  const target = routes[type] || (type === 'blog' && slug ? `/news/${encodeURIComponent(slug)}` : null)
    || (type === 'page' && slug ? `/${encodeURIComponent(slug)}` : null)

  if (!target) {
    return NextResponse.json({ error: 'A valid preview type and slug are required' }, { status: 400 })
  }

  // The deployed preview URL is currently served over HTTP. Next's built-in
  // draftMode().enable() always adds `Secure` in production, so a browser
  // opening http://100.68.50.41:1234 would receive a cookie it cannot send
  // back. Read the same build-time bypass id Next uses and set the cookie with
  // the correct security attributes for the actual origin.
  const manifestPath = join(process.cwd(), '.next', 'prerender-manifest.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const previewModeId = manifest?.preview?.previewModeId

  if (!previewModeId) {
    return NextResponse.json({ error: 'Preview mode is not configured' }, { status: 500 })
  }

  const isHttps = request.nextUrl.protocol === 'https:'
  const response = new NextResponse(null, {
    status: 307,
    headers: { Location: target },
  })
  response.cookies.set('__prerender_bypass', previewModeId, {
    httpOnly: true,
    sameSite: isHttps ? 'none' : 'lax',
    secure: isHttps,
    path: '/',
  })
  return response
}
