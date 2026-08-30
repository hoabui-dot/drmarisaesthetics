'use client'

import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@/src/lib/utils'

export type MotionFaqItem = {
  id?: string | number
  question: string
  answer: string
  icon?: ReactNode
}

type MotionFaqAccordionProps = {
  items: MotionFaqItem[]
  className?: string
  itemClassName?: string
  triggerClassName?: string
  contentClassName?: string
  defaultOpenIndex?: number
  allowMultiple?: boolean
  renderIcon?: (item: MotionFaqItem, index: number) => ReactNode
}

/** Radix-based FAQ primitive with motion.dev-style measured height animation. */
export function MotionFaqAccordion({
  items,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
  defaultOpenIndex,
  allowMultiple = false,
  renderIcon,
}: MotionFaqAccordionProps) {
  const defaultValue = defaultOpenIndex === undefined ? undefined : `faq-${defaultOpenIndex}`

  if (allowMultiple) {
    return (
      <AccordionPrimitive.Root type="multiple" defaultValue={defaultValue ? [defaultValue] : undefined} className={cn('motion-faq-accordion', className)}>
        {items.map((item, index) => <Item key={item.id ?? item.question} item={item} index={index} itemClassName={itemClassName} triggerClassName={triggerClassName} contentClassName={contentClassName} renderIcon={renderIcon} />)}
      </AccordionPrimitive.Root>
    )
  }

  return (
    <AccordionPrimitive.Root type="single" collapsible defaultValue={defaultValue} className={cn('motion-faq-accordion', className)}>
      {items.map((item, index) => <Item key={item.id ?? item.question} item={item} index={index} itemClassName={itemClassName} triggerClassName={triggerClassName} contentClassName={contentClassName} renderIcon={renderIcon} />)}
    </AccordionPrimitive.Root>
  )
}

function Item({ item, index, itemClassName, triggerClassName, contentClassName, renderIcon }: Omit<MotionFaqAccordionProps, 'items' | 'className' | 'defaultOpenIndex' | 'allowMultiple'> & { item: MotionFaqItem; index: number }) {
  return (
    <AccordionPrimitive.Item value={`faq-${index}`} className={cn('motion-faq-accordion__item', itemClassName)}>
      <AccordionPrimitive.Header className="motion-faq-accordion__header">
        <AccordionPrimitive.Trigger className={cn('motion-faq-accordion__trigger', triggerClassName)}>
          {renderIcon ? <span className="motion-faq-accordion__leading-icon" aria-hidden="true">{renderIcon(item, index)}</span> : null}
          <span className="motion-faq-accordion__question">{item.question}</span>
          <ChevronDown className="motion-faq-accordion__chevron" size={18} aria-hidden="true" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className={cn('motion-faq-accordion__content', contentClassName)}>
        <div className="motion-faq-accordion__content-inner">
          <p>{item.answer}</p>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}
