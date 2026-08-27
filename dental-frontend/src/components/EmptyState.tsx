/**
 * Empty State Component
 * 
 * Displays when no content is available.
 */

import { Button } from '@/src/components/ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: {
    label: string
    href: string
  }
}

export function EmptyState({
  title = 'No content available',
  description = 'This page doesn\'t have any content yet.',
  action,
}: EmptyStateProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-6xl">📄</div>
        <h2 className="text-2xl font-bold text-foreground">
          {title}
        </h2>
        <p className="text-foreground-secondary">
          {description}
        </p>
        {action && (
          <Button asChild>
            <Link href={action.href}>
              {action.label}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
