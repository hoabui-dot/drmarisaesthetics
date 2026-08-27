/**
 * Preview Mode Banner
 * 
 * Displays a banner when preview mode is active.
 * Allows users to exit preview mode and return to published content.
 */

import Link from 'next/link'
import { Button } from '@/src/components/ui/button'

export function PreviewBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-warning-500 text-warning-foreground px-4 py-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👁️</span>
          <div>
            <p className="font-bold">Preview Mode Enabled</p>
            <p className="text-sm opacity-90">You are viewing draft content</p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="bg-background text-foreground hover:bg-background-secondary">
          <Link href="/api/exit-preview">
            Exit Preview
          </Link>
        </Button>
      </div>
    </div>
  )
}
