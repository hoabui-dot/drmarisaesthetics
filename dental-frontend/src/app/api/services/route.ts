import { NextRequest, NextResponse } from 'next/server'
import { getServiceListingPage } from '@/src/lib/api/listings'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const result = await getServiceListingPage({
      page: Number(searchParams.get('page') || 1),
      pageSize: Number(searchParams.get('pageSize') || 6),
      category: searchParams.get('category') || undefined,
    })
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[Services API] Failed to load service listing', error)
    return NextResponse.json({ error: 'Services could not be loaded.' }, { status: 502 })
  }
}
