/**
 * Input Component
 * 
 * A styled input field with consistent design.
 */

import * as React from 'react'
import { cn } from '@/src/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-lg border-2 border-input bg-background-secondary px-4 py-2 text-sm text-foreground',
          'placeholder:text-foreground-muted',
          'hover:border-input-hover',
          'focus-visible:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-background-muted',
          'transition-smooth',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
