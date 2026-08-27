/**
 * Textarea Component
 * 
 * A styled textarea field with consistent design.
 */

import * as React from 'react'
import { cn } from '@/src/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-lg border-2 border-input bg-background-secondary px-4 py-3 text-sm text-foreground',
          'placeholder:text-foreground-muted',
          'hover:border-input-hover',
          'focus-visible:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-background-muted',
          'transition-smooth resize-none',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
