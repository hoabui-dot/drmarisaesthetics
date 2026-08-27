import { NextResponse } from 'next/server';
import { STRAPI_URL } from '@/src/lib/env';

/**
 * API Route: /api/env
 * 
 * Securely exposes specific environment variables to the client.
 * This is useful for variables that are needed on the client but
 * should be managed centrally or fetched dynamically.
 */
export async function GET() {
  return NextResponse.json({
    STRAPI_URL: STRAPI_URL,
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL || '',
    // Add other safe variables here if needed
  });
}
