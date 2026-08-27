import Link from 'next/link'
import { Button } from '@/src/components/ui/button'

/**
 * Not Found Page
 * 
 * Displayed when a page slug doesn't exist in the CMS.
 * Triggered by notFound() function in [slug]/page.tsx
 */

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Icon */}
        <div className="text-8xl font-bold text-primary-600">
          404
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Page Not Found
          </h1>
          <p className="text-lg text-foreground-secondary">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/">
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
