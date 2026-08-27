'use client'

import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export type SelectOption = { label: string; value: string }

export function SelectBase({
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  ariaLabel,
  invalid = false,
  className = '',
}: {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel: string
  invalid?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', escape)
    }
  }, [])

  return (
    <div ref={rootRef} className={`select-base ${open ? 'is-open' : ''} ${invalid ? 'is-invalid' : ''} ${className}`}>
      <button type="button" className="select-base__trigger" onClick={() => setOpen((current) => !current)} aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel}>
        <span className={selected ? '' : 'is-placeholder'}>{selected?.label || placeholder}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <div className="select-base__menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option) => (
            <button type="button" role="option" aria-selected={option.value === value} className="select-base__option" key={option.value} onClick={() => { onChange(option.value); setOpen(false) }}>
              <span>{option.label}</span>
              {option.value === value ? <Check size={15} aria-hidden="true" /> : null}
            </button>
          ))}
          {!options.length ? <span className="select-base__empty">No options available</span> : null}
        </div>
      )}
    </div>
  )
}
