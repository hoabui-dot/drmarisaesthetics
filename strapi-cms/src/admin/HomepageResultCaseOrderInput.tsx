import { Box, Button, Checkbox, Field, Flex, Typography } from '@strapi/design-system'
import { useFetchClient, useNotification } from '@strapi/admin/strapi-admin'
import { useCallback, useEffect, useMemo, useState } from 'react'

type ResultCase = { caseNumber: string; title: string; subtitle?: string }
type Props = {
  name: string
  value?: unknown
  onChange: (event: { target: { name: string; type: string; value: string[] } }) => void
  disabled?: boolean
  error?: string
  hint?: string
  label?: string
  required?: boolean
}

const MAX_HOMEPAGE_CASES = 6

function extractCases(payload: any): ResultCase[] {
  const root = payload?.data?.data?.attributes || payload?.data?.attributes || payload?.data?.data || payload?.data || payload || {}
  const result = root?.attributes || root
  const entries = Array.isArray(result?.cases) ? result.cases : Array.isArray(result?.cases?.data) ? result.cases.data : []
  return entries.map((entry: any) => {
    const item = entry?.attributes || entry?.data?.attributes || entry?.data || entry || {}
    return {
      caseNumber: String(item.case_number ?? item.caseNumber ?? '').trim(),
      title: String(item.title ?? '').trim(),
      subtitle: String(item.subtitle ?? '').trim() || undefined,
    }
  }).filter((item: ResultCase) => item.caseNumber && item.title)
}

export default function HomepageResultCaseOrderInput({ name, value, onChange, disabled, error, hint, label, required }: Props) {
  const { get } = useFetchClient()
  const { toggleNotification } = useNotification()
  const [cases, setCases] = useState<ResultCase[]>([])
  const [loading, setLoading] = useState(true)
  const selectedCaseNumbers = Array.isArray(value) ? value.map(String) : []

  const loadCases = useCallback(async () => {
    setLoading(true)
    try {
      const response = await get('/content-manager/single-types/api::result.result?populate=*')
      setCases(extractCases(response?.data ?? response))
    } catch {
      setCases([])
      toggleNotification({ type: 'warning', message: 'Could not load Patient Results cases. Check Content Manager read permission and save the Result single type first.' })
    } finally {
      setLoading(false)
    }
  }, [get, toggleNotification])

  useEffect(() => { void loadCases() }, [loadCases])

  const selectedCases = useMemo(
    () => selectedCaseNumbers.map((caseNumber) => cases.find((item) => item.caseNumber === caseNumber)).filter((item): item is ResultCase => Boolean(item)),
    [cases, selectedCaseNumbers.join('|')],
  )

  const update = (caseNumbers: string[]) => onChange({ target: { name, type: 'json', value: caseNumbers } })

  const move = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= selectedCaseNumbers.length) return
    const reordered = [...selectedCaseNumbers]
    ;[reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]]
    update(reordered)
  }

  return (
    <Field.Root name={name} error={error} hint={hint} required={required} disabled={disabled}>
      <Field.Label>{label || 'Homepage patient cases'}</Field.Label>
      <Box paddingTop={2}>
        <Typography variant="pi" textColor="neutral600">Select up to {MAX_HOMEPAGE_CASES} cases. Use the arrows to set their display order.</Typography>
      </Box>
      <Box paddingTop={3} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, alignItems: 'start' }}>
        <Box minWidth={0}>
          <Typography variant="sigma">Select cases</Typography>
          <Box paddingTop={2}>
            {loading ? <Typography variant="omega">Loading Patient Results…</Typography> : cases.length ? (
              <Flex direction="column" alignItems="stretch" gap={2} role="group" aria-label={label || 'Homepage patient cases'}>
                {cases.map((item) => {
                  const checked = selectedCaseNumbers.includes(item.caseNumber)
                  const atLimit = selectedCaseNumbers.length >= MAX_HOMEPAGE_CASES
                  return (
                    <Flex key={item.caseNumber} as="label" alignItems="center" gap={3} padding={3} hasRadius background="neutral0" borderColor="neutral200" borderWidth="1px" style={{ cursor: disabled || (!checked && atLimit) ? 'not-allowed' : 'pointer' }}>
                      <Checkbox
                        checked={checked}
                        disabled={disabled || (!checked && atLimit)}
                        onCheckedChange={(nextChecked) => update(nextChecked === true ? [...selectedCaseNumbers, item.caseNumber] : selectedCaseNumbers.filter((caseNumber) => caseNumber !== item.caseNumber))}
                        aria-label={item.title}
                      />
                      <Box minWidth={0} flex="1">
                        <Typography variant="omega">{item.title}</Typography>
                      </Box>
                    </Flex>
                  )
                })}
              </Flex>
            ) : <Typography variant="omega" textColor="neutral600">No saved result cases found. Add cases in Patient Results first.</Typography>}
          </Box>
        </Box>

        <Box minWidth={0}>
          <Typography variant="sigma">Homepage display order</Typography>
          <Flex direction="column" alignItems="stretch" gap={2} paddingTop={2}>
            {selectedCases.length ? selectedCases.map((item, index) => (
              <Flex key={item.caseNumber} alignItems="center" gap={2} padding={2} hasRadius background="neutral100">
                <Typography variant="omega" style={{ flex: 1 }}>{index + 1}. {item.title}</Typography>
                <Button type="button" size="S" variant="secondary" disabled={disabled || index === 0} onClick={() => move(index, -1)} aria-label={`Move ${item.title} up`}>↑</Button>
                <Button type="button" size="S" variant="secondary" disabled={disabled || index === selectedCases.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${item.title} down`}>↓</Button>
              </Flex>
            )) : <Typography variant="pi" textColor="neutral600">Select cases to set their homepage display order.</Typography>}
          </Flex>
        </Box>
      </Box>
      <Box paddingTop={2}><Field.Hint /><Field.Error /></Box>
      <Field.Hint textColor="neutral600">{selectedCaseNumbers.length}/{MAX_HOMEPAGE_CASES} selected. An empty selection keeps the current latest-case fallback.</Field.Hint>
    </Field.Root>
  )
}
