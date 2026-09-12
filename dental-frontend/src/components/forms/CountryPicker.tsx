'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentType, type SVGProps } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { countries } from 'country-flag-icons'
import * as FlagIcons from 'country-flag-icons/react/3x2'
import { getCountryCallingCode, type CountryCode } from 'libphonenumber-js'

export type CountryOption = {
  code: CountryCode
  name: string
  dialCode: string
}

const flagComponents = FlagIcons as unknown as Record<string, ComponentType<SVGProps<SVGSVGElement>>>

export function CountryFlag({ code, label }: { code: CountryCode; label?: string }) {
  const Flag = flagComponents[code]
  return Flag ? <Flag className="country-picker__flag" role="img" aria-label={label} /> : <span className="country-picker__flag-fallback" aria-hidden="true">{code}</span>
}

const countryNames = new Intl.DisplayNames(['en'], { type: 'region' })

export const countryOptions: CountryOption[] = countries
  .filter((code): code is CountryCode => /^[A-Z]{2}$/.test(code))
  .map((code) => {
    try {
      return { code, name: countryNames.of(code) || code, dialCode: `+${getCountryCallingCode(code)}` }
    } catch {
      return null
    }
  })
  .filter((country): country is CountryOption => country !== null)
  .sort((a, b) => a.name.localeCompare(b.name))

export const defaultCountry = (countryOptions.find((country) => country.code === 'VN') || countryOptions[0])!

type CountryPickerProps = {
  value: CountryOption
  onChange: (country: CountryOption) => void
  label: string
  error?: string
  className?: string
}

export function CountryPicker({ value, onChange, label, error, className = '' }: CountryPickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom')
  const pickerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const listId = `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-options`
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return normalized ? countryOptions.filter((country) => `${country.name} ${country.code} ${country.dialCode}`.toLowerCase().includes(normalized)) : countryOptions
  }, [query])

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent) => { if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) setOpen(false) }
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.removeEventListener('mousedown', closeOnOutside); document.removeEventListener('keydown', closeOnEscape) }
  }, [])

  useLayoutEffect(() => {
    if (!open || !pickerRef.current || !menuRef.current) return
    const updatePlacement = () => {
      if (!pickerRef.current || !menuRef.current) return
      const triggerRect = pickerRef.current.getBoundingClientRect()
      const menuHeight = Math.min(menuRef.current.scrollHeight, window.innerHeight * 0.62)
      const spaceBelow = window.innerHeight - triggerRect.bottom
      const spaceAbove = triggerRect.top
      setPlacement(spaceBelow < menuHeight + 12 && spaceAbove > spaceBelow ? 'top' : 'bottom')
    }
    updatePlacement()
    window.addEventListener('resize', updatePlacement)
    window.addEventListener('scroll', updatePlacement, true)
    return () => { window.removeEventListener('resize', updatePlacement); window.removeEventListener('scroll', updatePlacement, true) }
  }, [open, matches.length])

  return <div ref={pickerRef} className={`booking-country-picker ${className}`}>
    <button type="button" className={`booking-country-picker__trigger${error ? ' is-invalid' : ''}`} onClick={() => setOpen((current) => !current)} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-label={`${label}: ${value.name}`}>
      <CountryFlag code={value.code} label={value.name} /><span>{value.code}</span><ChevronDown size={14} aria-hidden="true" />
    </button>
    {open ? <div ref={menuRef} id={listId} className={`booking-country-picker__menu is-${placement}`} role="listbox" aria-label={label}>
      <div className="booking-country-picker__search"><Search size={14} aria-hidden="true" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search country or code" aria-label={`Search ${label}`} /></div>
      <div className="booking-country-picker__options">{matches.map((country) => <button type="button" role="option" aria-selected={country.code === value.code} key={country.code} onClick={() => { onChange(country); setOpen(false); setQuery('') }}><CountryFlag code={country.code} label={country.name} /><span>{country.name} ({country.dialCode})</span>{country.code === value.code ? <Check size={14} aria-hidden="true" /> : null}</button>)}{!matches.length ? <p>No countries found</p> : null}</div>
    </div> : null}
  </div>
}
