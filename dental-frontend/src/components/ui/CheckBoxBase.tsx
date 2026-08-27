'use client'

import { Check } from 'lucide-react'

export function CheckBoxBase({ checked, onChange, children, required = false }: { checked: boolean; onChange: (checked: boolean) => void; children: React.ReactNode; required?: boolean }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} aria-required={required} className={`checkbox-base ${checked ? 'is-checked' : ''}`} onClick={() => onChange(!checked)}>
      <span className="checkbox-base__box" aria-hidden="true">{checked ? <Check size={13} strokeWidth={3} /> : null}</span>
      <span>{children}</span>
    </button>
  )
}
