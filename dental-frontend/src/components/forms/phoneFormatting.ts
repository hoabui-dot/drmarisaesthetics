import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js'
import type { CountryOption } from './CountryPicker'

export function normalizeNationalPhone(value: string, country: CountryOption) {
  const trimmed = value.trim()
  const digits = value.replace(/\D/g, '')
  const dialCode = country.dialCode.slice(1)

  if (trimmed.startsWith('+') && digits.startsWith(dialCode)) return digits.slice(dialCode.length)
  if (trimmed.startsWith('00') && digits.startsWith(`00${dialCode}`)) return digits.slice(dialCode.length + 2)
  return digits
}

export function formatNationalPhone(value: string, country: CountryOption) {
  if (!value) return ''

  const nationalFormat = new AsYouType(country.code).input(value)
  const parsed = parsePhoneNumberFromString(value, country.code)
  if (!parsed || !parsed.isValid()) return nationalFormat

  const international = parsed.formatInternational()
  const prefix = `${country.dialCode} `
  return international.startsWith(prefix) ? international.slice(prefix.length) : international
}
