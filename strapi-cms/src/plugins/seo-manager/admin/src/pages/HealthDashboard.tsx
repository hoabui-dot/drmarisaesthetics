import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Flex, SingleSelect, SingleSelectOption, TextInput, Typography } from '@strapi/design-system'
import { ArrowClockwise } from '@strapi/icons'
import { useFetchClient } from '@strapi/admin/strapi-admin'
import { Link } from 'react-router-dom'

type Severity = 'critical' | 'warning' | 'recommendation'
type Issue = {
  id: string; code: string; category: string; severity: Severity; title: string; description: string
  content?: string; contentType?: string; locale?: string; field?: string; path?: string
  currentValue?: unknown; adminEditUrl?: string
}
type Audit = {
  score: number
  summary: { critical: number; warnings: number; recommendations: number; passed: number; auditedPages: number; indexablePages: number; noindexPages: number; activeRedirects: number; redirectLoops: number; redirectChains: number }
  categories: Record<string, { label: string; score: number | null; issues: number; passed: number; critical: number; warning: number; recommendation: number }>
  generatedAt: string; methodology: string; issues: Issue[]
  pagination: { page: number; pageSize: number; total: number; pageCount: number }
  filters: { locales: string[]; contentTypes: string[] }
}

const emptyAudit: Audit = {
  score: 0,
  summary: { critical: 0, warnings: 0, recommendations: 0, passed: 0, auditedPages: 0, indexablePages: 0, noindexPages: 0, activeRedirects: 0, redirectLoops: 0, redirectChains: 0 },
  categories: {}, generatedAt: '', methodology: '', issues: [], pagination: { page: 1, pageSize: 25, total: 0, pageCount: 1 }, filters: { locales: [], contentTypes: [] },
}

type Props = { msg: (key: string, fallback: string) => string }

export function HealthDashboard({ msg }: Props) {
  const { get } = useFetchClient()
  const [audit, setAudit] = useState<Audit>(emptyAudit)
  const [severity, setSeverity] = useState('')
  const [category, setCategory] = useState('')
  const [contentType, setContentType] = useState('')
  const [locale, setLocale] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), pageSize: '25' })
    if (severity) params.set('severity', severity)
    if (category) params.set('category', category)
    if (contentType) params.set('contentType', contentType)
    if (locale) params.set('locale', locale)
    if (search.trim()) params.set('search', search.trim())
    return params.toString()
  }, [page, severity, category, contentType, locale, search])

  const load = useCallback(async (forceRefresh = false) => {
    setLoading(true)
    setError(false)
    try {
      const response = await get(`/seo-manager/health?${query}${forceRefresh ? '&refresh=true' : ''}`)
      setAudit(response?.data?.data || response?.data || emptyAudit)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [get, query])

  useEffect(() => { void load() }, [load])

  const clearFilters = () => {
    setSeverity(''); setCategory(''); setContentType(''); setLocale(''); setSearch(''); setPage(1)
  }
  const metric = (label: string, value: React.ReactNode, tone?: string) => (
    <div className={`seo-health-metric ${tone ? `seo-health-metric--${tone}` : ''}`} key={label}>
      <Typography variant="pi" textColor="neutral600">{label}</Typography>
      <Typography variant="alpha" tag="p">{value}</Typography>
    </div>
  )

  return (
    <div className="seo-health-dashboard">
      <Flex justifyContent="space-between" alignItems="center" gap={3} marginBottom={5}>
        <div>
          <Typography variant="beta" tag="h2">{msg('health.title', 'SEO Health')}</Typography>
          <Typography variant="pi" textColor="neutral600">{msg('health.subtitle', 'First-party checks of published CMS content and the current frontend SEO configuration.')}</Typography>
        </div>
        <Button variant="tertiary" startIcon={<ArrowClockwise />} loading={loading} onClick={() => void load(true)}>{msg('action.runAudit', 'Run audit')}</Button>
      </Flex>

      {error ? (
        <Box padding={5} className="seo-manager-empty">
          <Typography>{msg('health.error', 'SEO health could not be loaded. Check your permissions and try again.')}</Typography>
          <Button marginTop={3} onClick={() => void load()}>{msg('action.retry', 'Retry')}</Button>
        </Box>
      ) : (
        <>
          <div className="seo-health-overview">
            <div className="seo-health-score">
              <Typography variant="pi" textColor="neutral600">{msg('health.score', 'SEO Health')}</Typography>
              <Typography variant="alpha" tag="p">{loading ? '—' : `${audit.score}%`}</Typography>
              <Typography variant="pi" textColor="neutral600">{msg('health.scoreNote', 'Informational, first-party audit — not a search ranking score.')}</Typography>
            </div>
            <div className="seo-health-metrics">
              {metric(msg('health.critical', 'Critical issues'), loading ? '—' : audit.summary.critical, 'critical')}
              {metric(msg('health.warnings', 'Warnings'), loading ? '—' : audit.summary.warnings, 'warning')}
              {metric(msg('health.recommendations', 'Recommendations'), loading ? '—' : audit.summary.recommendations)}
              {metric(msg('health.passed', 'Passed checks'), loading ? '—' : audit.summary.passed, 'passed')}
              {metric(msg('health.indexable', 'Indexable pages'), loading ? '—' : audit.summary.indexablePages)}
              {metric(msg('health.noindex', 'Noindex pages'), loading ? '—' : audit.summary.noindexPages)}
            </div>
          </div>

          <div className="seo-health-category-grid">
            {Object.entries(audit.categories).filter(([, value]) => value.score !== null || value.issues > 0).map(([key, value]) => (
              <button className="seo-health-category" key={key} type="button" onClick={() => { setCategory(key); setPage(1) }}>
                <Flex justifyContent="space-between" gap={2}>
                  <Typography fontWeight="bold">{value.label}</Typography>
                  <Typography fontWeight="bold">{value.score === null ? '—' : `${value.score}%`}</Typography>
                </Flex>
                <div className="seo-health-progress"><span style={{ width: `${value.score ?? 0}%` }} /></div>
                <Typography variant="pi" textColor="neutral600">{value.issues} {msg('health.openIssues', 'open issues')}</Typography>
              </button>
            ))}
          </div>

          <section className="seo-health-issues">
            <Flex justifyContent="space-between" alignItems="center" marginBottom={3}>
              <div><Typography variant="delta" tag="h3" className="seo-health-issues-title">{msg('health.issueList', 'SEO issues')}</Typography><Typography variant="pi" textColor="neutral600" className="seo-health-results-count">{audit.pagination.total} {msg('health.results', 'matching issues')}</Typography></div>
              {(severity || category || contentType || locale || search) ? <Button variant="tertiary" onClick={clearFilters}>{msg('action.clearFilters', 'Clear filters')}</Button> : null}
            </Flex>
            <div className="seo-health-filters">
              <SingleSelect aria-label={msg('health.filterSeverity', 'Filter by severity')} value={severity} onChange={(value: string) => { setSeverity(value); setPage(1) }}>
                <SingleSelectOption value="">{msg('filter.allSeverity', 'All severities')}</SingleSelectOption>
                <SingleSelectOption value="critical">{msg('severity.critical', 'Critical')}</SingleSelectOption>
                <SingleSelectOption value="warning">{msg('severity.warning', 'Warning')}</SingleSelectOption>
                <SingleSelectOption value="recommendation">{msg('severity.recommendation', 'Recommendation')}</SingleSelectOption>
              </SingleSelect>
              <SingleSelect aria-label={msg('health.filterCategory', 'Filter by category')} value={category} onChange={(value: string) => { setCategory(value); setPage(1) }}>
                <SingleSelectOption value="">{msg('filter.allCategories', 'All categories')}</SingleSelectOption>
                {Object.entries(audit.categories).map(([key, value]) => <SingleSelectOption key={key} value={key}>{value.label}</SingleSelectOption>)}
              </SingleSelect>
              <SingleSelect aria-label={msg('health.filterType', 'Filter by content type')} value={contentType} onChange={(value: string) => { setContentType(value); setPage(1) }}>
                <SingleSelectOption value="">{msg('filter.allTypes', 'All content types')}</SingleSelectOption>
                {audit.filters.contentTypes.map((value) => <SingleSelectOption key={value} value={value}>{value}</SingleSelectOption>)}
              </SingleSelect>
              <SingleSelect aria-label={msg('health.filterLocale', 'Filter by locale')} value={locale} onChange={(value: string) => { setLocale(value); setPage(1) }}>
                <SingleSelectOption value="">{msg('filter.allLocales', 'All locales')}</SingleSelectOption>
                {audit.filters.locales.map((value) => <SingleSelectOption key={value} value={value}>{value.toUpperCase()}</SingleSelectOption>)}
              </SingleSelect>
              <TextInput aria-label={msg('health.search', 'Search issues')} placeholder={msg('health.searchPlaceholder', 'Search page, path or issue')} value={search} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setSearch(event.target.value); setPage(1) }} />
            </div>

            {loading ? <Box padding={5}><Typography>{msg('status.loadingAudit', 'Analyzing current SEO data…')}</Typography></Box> : audit.issues.length === 0 ? (
              <Box padding={5} className="seo-manager-empty"><Typography variant="delta">{audit.summary.auditedPages === 0 ? msg('health.noDataTitle', 'No published content to analyze') : msg('health.emptyTitle', 'No SEO issues found')}</Typography><Typography variant="pi" textColor="neutral600">{audit.summary.auditedPages === 0 ? msg('health.noDataDescription', 'Publish SEO-enabled content to begin the audit.') : msg('health.emptyDescription', 'All checks currently run by this dashboard pass for the selected filters.')}</Typography></Box>
            ) : (
              <div className="seo-manager-table-wrap"><table className="seo-manager-table seo-health-table"><thead><tr>
                <th>{msg('health.columnSeverity', 'Severity')}</th><th>{msg('health.columnIssue', 'Issue')}</th><th>{msg('health.columnContent', 'Content')}</th><th>{msg('health.columnType', 'Type')}</th><th>{msg('health.columnLocale', 'Locale')}</th><th>{msg('health.columnField', 'Field')}</th><th>{msg('health.columnAction', 'Action')}</th>
              </tr></thead><tbody>{audit.issues.map((issue) => <tr key={issue.id}>
                <td><span className={`seo-health-badge seo-health-badge--${issue.severity}`}>{msg(`severity.${issue.severity}`, issue.severity)}</span></td>
                <td><details className="seo-health-detail"><summary>{issue.title}</summary><p>{issue.description}</p>{issue.currentValue !== undefined ? <pre>{typeof issue.currentValue === 'string' ? issue.currentValue : JSON.stringify(issue.currentValue, null, 2)}</pre> : null}</details></td>
                <td>{issue.content || issue.path || '—'}{issue.path ? <code className="seo-health-path">{issue.path}</code> : null}</td><td>{issue.contentType || '—'}</td><td>{issue.locale?.toUpperCase() || '—'}</td><td><code>{issue.field || '—'}</code></td>
                <td>{issue.adminEditUrl ? <Link className="seo-health-action" to={issue.adminEditUrl}>{msg('action.open', 'Open')}</Link> : '—'}</td>
              </tr>)}</tbody></table></div>
            )}
            <Flex justifyContent="space-between" alignItems="center" marginTop={3}>
              <Typography variant="pi" textColor="neutral600">{msg('health.page', 'Page')} {audit.pagination.page} / {audit.pagination.pageCount}</Typography>
              <Flex gap={2}><Button size="S" variant="tertiary" disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))}>{msg('action.previous', 'Previous')}</Button><Button size="S" variant="tertiary" disabled={page >= audit.pagination.pageCount || loading} onClick={() => setPage((value) => value + 1)}>{msg('action.next', 'Next')}</Button></Flex>
            </Flex>
          </section>
          {audit.generatedAt ? <Typography variant="pi" textColor="neutral600">{msg('health.generatedAt', 'Last analyzed')}: {new Date(audit.generatedAt).toLocaleString()}</Typography> : null}
          <Typography variant="pi" textColor="neutral600" className="seo-health-methodology">{audit.methodology}</Typography>
        </>
      )}
    </div>
  )
}
