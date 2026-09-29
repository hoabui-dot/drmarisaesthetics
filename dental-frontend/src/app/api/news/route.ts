import { NextRequest, NextResponse } from 'next/server'
import { getBlogListingPage } from '@/src/lib/api/listings'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const result = await getBlogListingPage({
      page: Number(searchParams.get('page') || 1),
      pageSize: Number(searchParams.get('pageSize') || 6),
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
    })
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[News API] Failed to load blog listing', error)
    return NextResponse.json({ error: 'Articles could not be loaded.' }, { status: 502 })
  }
}
