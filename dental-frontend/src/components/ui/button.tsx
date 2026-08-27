/**
 * Button Component
 * 
 * A versatile button component with multiple variants and sizes.
 * Built with Radix UI Slot for composition.
 */

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/src/lib/utils'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-smooth focus-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-md hover:shadow-lg',
        secondary:
          'bg-secondary-300 text-foreground hover:bg-secondary-400 active:bg-secondary-500 shadow-md hover:shadow-lg',
        outline:
          'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
        ghost:
          'text-primary-600 hover:bg-primary-50 active:bg-primary-100',
        destructive:
          'bg-destructive-500 text-destructive-foreground hover:bg-destructive-600 active:bg-destructive-700 shadow-md hover:shadow-lg',
        link:
          'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'py-2 px-5 text-xs',
        md: 'py-3 px-8 text-sm',
        lg: 'py-4 px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
