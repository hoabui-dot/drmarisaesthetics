'use client'

import { MotionFaqAccordion, type MotionFaqItem } from '@/src/components/ui/motion-faq-accordion'
import { cn } from '@/src/lib/utils'

type CommonFaqAccordionProps = {
  items: MotionFaqItem[]
  className?: string
  defaultOpenIndex?: number
  allowMultiple?: boolean
}

/** Shared accordion presentation for all page-level FAQ sections. */
export function CommonFaqAccordion({
  items,
  className,
  defaultOpenIndex = 0,
  allowMultiple = false,
}: CommonFaqAccordionProps) {
  return (
    <MotionFaqAccordion
      items={items}
      className={cn('faq-common-accordion', className)}
      defaultOpenIndex={defaultOpenIndex}
      allowMultiple={allowMultiple}
    />
  )
}
