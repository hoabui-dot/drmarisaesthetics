import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Flex, Typography } from '@strapi/design-system'
import { ArrowClockwise, ExternalLink } from '@strapi/icons'
import { useFetchClient, useNotification } from '@strapi/admin/strapi-admin'
import { Link } from 'react-router-dom'

type SitemapItem = { url: string; path: string; label: string; group: string; contentType: string; locale: string; lastModified?: string; sitemapIncluded: boolean; adminEditUrl?: string }
type SitemapIssue = { code: string; severity: 'critical' | 'warning' | 'recommendation'; title: string; path: string; description: string }
type SitemapSource = { id: string; uid?: string; label: string; path?: string; routePattern?: string; slugField?: string; sitemapKey?: string; sitemapPath?: string; enabled: boolean; included: number; management: 'code' }
type SitemapGroup = { key: string; label: string; path: string; enabled: boolean; urlCount: number; lastModified?: string }
type Report = {
  generatedAt: string; origin: string; enabled: boolean; locale: string; locales: string[]
  items: SitemapItem[]; sitemapGroups: SitemapGroup[]; excluded: Array<{ path: string; label: string; contentType: string; locale: string; reason: string }>
  issues: SitemapIssue[]; contentTypes: SitemapSource[]; staticRoutes: SitemapSource[]
  policy?: { contentTypes?: Record<string, boolean>; staticRoutes?: Record<string, boolean> }
  summary: { total: number; included: number; excluded: number; critical: number; warnings: number; recommendations: number }
}
type Props = { msg: (key: string, fallback: string) => string }
type Policy = { contentTypes: Record<string, boolean>; staticRoutes: Record<string, boolean> }
type SitemapChildRoute = { path: string; url: string; label: string; contentType: string; lastModified?: string; included: boolean; reason?: string; adminEditUrl?: string }
type SitemapParentRoute = { key: string; label: string; path: string; staticSource?: SitemapSource; collectionSource?: SitemapSource; children: SitemapChildRoute[]; urlCount: number }

const SETTINGS_UID = 'api::seo-manager-settings.seo-manager-settings'
const emptyReport: Report = {
  generatedAt: '', origin: '', enabled: false, locale: '', locales: [], items: [], sitemapGroups: [], excluded: [], issues: [], contentTypes: [], staticRoutes: [],
  summary: { total: 0, included: 0, excluded: 0, critical: 0, warnings: 0, recommendations: 0 },
}

function formatLastModified(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const pad = (part: number) => String(part).padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

function unwrap(response: any): any { return response?.data?.data ?? response?.data ?? response }
function readPolicy(report: Report): Policy {
  const staticRoutes = { ...(report.policy?.staticRoutes || {}) }
  // `/sitemap` used to be an HTML page; keep its legacy setting out of the
  // editor after the site switches to the XML index as its only sitemap view.
  delete staticRoutes.sitemap
  return {
    contentTypes: { ...(report.policy?.contentTypes || {}), ...Object.fromEntries(report.contentTypes.map((source) => [source.uid || source.id, source.enabled])) },
    staticRoutes: { ...staticRoutes, ...Object.fromEntries(report.staticRoutes.map((source) => [source.id, source.enabled])) },
  }
}

function buildParentRoutes(report: Report): SitemapParentRoute[] {
  const staticPaths = new Set(report.staticRoutes.map((route) => route.path))
  const pairedCollections: Record<string, string> = {
    services: 'api::service.service',
    news: 'api::blog.blog',
  }
  const consumedCollections = new Set<string>()
  const childRoutesFor = (source?: SitemapSource, staticParentPath?: string): SitemapChildRoute[] => {
    if (!source) return []
    const routePrefix = (source.routePattern || '').replace(/\/:([^/]+).*$/, '')
    const prefix = staticParentPath || routePrefix
    const isRootCollection = source.uid === 'api::page.page'
    const matches = (path: string) => {
      if (isRootCollection) return path.split('/').filter(Boolean).length === 1 && !staticPaths.has(path)
      return Boolean(prefix) && path !== prefix && path.startsWith(`${prefix}/`)
    }
    const children = new Map<string, SitemapChildRoute>()
    for (const item of report.excluded) {
      if (!matches(item.path)) continue
      children.set(item.path, { path: item.path, url: `${report.origin}${item.path}`, label: item.label, contentType: item.contentType, included: false, reason: item.reason })
    }
    for (const item of report.items) {
      if (!matches(item.path)) continue
      children.set(item.path, { path: item.path, url: item.url, label: item.label, contentType: item.contentType, lastModified: item.lastModified, included: true, adminEditUrl: item.adminEditUrl })
    }
    return [...children.values()].sort((left, right) => left.path.localeCompare(right.path))
  }

  const parents: SitemapParentRoute[] = report.staticRoutes.map((route) => {
    const collectionUid = pairedCollections[route.id]
    const collectionSource = report.contentTypes.find((source) => source.uid === collectionUid)
    if (collectionUid) consumedCollections.add(collectionUid)
    const children = childRoutesFor(collectionSource, route.path)
    return {
      key: route.id,
      label: route.label,
      path: route.path,
      staticSource: route,
      collectionSource,
      children,
      urlCount: route.included + (collectionSource?.included || 0),
    }
  })

  for (const source of report.contentTypes) {
    if (consumedCollections.has(source.uid || '')) continue
    const children = childRoutesFor(source)
    parents.push({
      key: source.uid || source.id,
      label: source.label,
      path: source.routePattern || '/',
      collectionSource: source,
      children,
      urlCount: source.included,
    })
  }
  return parents
}

export function SitemapManager({ msg }: Props) {
  const { get, put, post } = useFetchClient()
  const { toggleNotification } = useNotification()
  const [report, setReport] = useState<Report>(emptyReport)
  const [policy, setPolicy] = useState<Policy>({ contentTypes: {}, staticRoutes: {} })
  const [savedPolicy, setSavedPolicy] = useState<Policy>({ contentTypes: {}, staticRoutes: {} })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [revalidating, setRevalidating] = useState(false)
  const [error, setError] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const response = await get('/seo-manager/sitemap')
      const data = { ...emptyReport, ...unwrap(response) } as Report
      const nextPolicy = readPolicy(data)
      setReport(data)
      setPolicy(nextPolicy)
      setSavedPolicy(nextPolicy)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [get])

  useEffect(() => { void load() }, [load])

  const metric = (label: string, value: number, tone?: string) => (
    <div className={`seo-health-metric ${tone ? `seo-health-metric--${tone}` : ''}`} key={label}>
      <Typography variant="pi" textColor="neutral600">{label}</Typography>
      <Typography variant="alpha" tag="p">{value}</Typography>
    </div>
  )

  const updateSource = (category: keyof Policy, id: string, enabled: boolean) => {
    setPolicy((current) => ({ ...current, [category]: { ...current[category], [id]: enabled } }))
  }

  const savePolicy = async () => {
    setSaving(true)
    try {
      await put(`/content-manager/single-types/${SETTINGS_UID}`, {
        data: { sitemap_content_types: policy.contentTypes, sitemap_static_routes: policy.staticRoutes },
      })
      await post(`/content-manager/single-types/${SETTINGS_UID}/actions/publish`, {})
    } catch {
      toggleNotification({ type: 'warning', message: msg('sitemap.policySaveError', 'Sitemap policy could not be saved. Check Content Manager permissions and try again.') })
      setSaving(false)
      return
    }

    try {
      await post('/seo-manager/sitemap/revalidate', {})
      toggleNotification({ type: 'success', message: msg('sitemap.policySaved', 'Sitemap policy saved and the frontend sitemap was revalidated.') })
      await load()
    } catch {
      setSavedPolicy(policy)
      toggleNotification({ type: 'warning', message: msg('sitemap.policySavedRevalidateError', 'Sitemap policy was saved, but frontend revalidation failed. The existing cached sitemap remains available.') })
      await load()
    } finally {
      setSaving(false)
    }
  }

  const revalidate = async () => {
    setRevalidating(true)
    try {
      await post('/seo-manager/sitemap/revalidate', {})
      toggleNotification({ type: 'success', message: msg('sitemap.revalidateSuccess', 'Sitemap successfully revalidated.') })
      await load()
    } catch {
      toggleNotification({ type: 'warning', message: msg('sitemap.revalidateError', 'Unable to revalidate sitemap. The existing cached sitemap remains available.') })
    } finally {
      setRevalidating(false)
    }
  }

  const hasPolicyChanges = JSON.stringify(policy) !== JSON.stringify(savedPolicy)
  const parentRoutes = buildParentRoutes(report)

  const sourceSwitch = (source: SitemapSource, category: keyof Policy) => {
    const id = source.uid || source.id
    const enabled = policy[category][id] ?? source.enabled
    return <label className="seo-sitemap-switch"><input type="checkbox" checked={enabled} aria-label={`${msg('sitemap.includeSource', 'Include source in sitemap')}: ${source.label}`} onChange={(event) => updateSource(category, id, event.target.checked)} /><span>{enabled ? msg('common.on', 'On') : msg('common.off', 'Off')}</span></label>
  }

  return (
    <div className="seo-sitemap-manager">
      <Flex justifyContent="space-between" alignItems="center" gap={3} marginBottom={2}>
        <div>
          <Typography variant="beta" tag="h2">{msg('sitemap.title', 'Sitemap')}</Typography>
          <Typography variant="pi" textColor="neutral600">{msg('sitemap.description', 'Manage which approved sources appear in the XML sitemap. URLs and route patterns are generated by the application.')}</Typography>
        </div>
        <Flex gap={2}>
          <Button variant="tertiary" startIcon={<ArrowClockwise />} loading={loading} onClick={() => void load()}>{msg('action.refresh', 'Refresh')}</Button>
          <Button variant="secondary" startIcon={<ArrowClockwise />} loading={revalidating} onClick={() => void revalidate()}>{msg('sitemap.revalidate', 'Revalidate Sitemap')}</Button>
        </Flex>
      </Flex>

      {error ? (
        <Box padding={5} className="seo-manager-empty">
          <Typography>{msg('sitemap.error', 'Sitemap diagnostics could not be loaded. Check your SEO Manager permissions and retry.')}</Typography>
          <Button marginTop={3} onClick={() => void load()}>{msg('action.retry', 'Retry')}</Button>
        </Box>
      ) : (
        <>
          <div className="seo-health-metrics seo-sitemap-metrics">
            {metric(msg('sitemap.included', 'Included URLs'), report.summary.included, 'passed')}
            {metric(msg('sitemap.excluded', 'Excluded URLs'), report.summary.excluded)}
            {metric(msg('health.critical', 'Critical issues'), report.summary.critical, 'critical')}
            {metric(msg('health.warnings', 'Warnings'), report.summary.warnings, 'warning')}
          </div>
          <div className="seo-sitemap-links">
            <a href={`${report.origin}/sitemap.xml`} target="_blank" rel="noreferrer">{msg('sitemap.openXml', 'Open XML sitemap')} <ExternalLink aria-hidden="true" /></a>
            <a href={`${report.origin}/robots.txt`} target="_blank" rel="noreferrer">{msg('sitemap.openRobots', 'Open robots.txt')} <ExternalLink aria-hidden="true" /></a>
          </div>
          <section className="seo-sitemap-subsection">
            <div><Typography variant="delta" tag="h3">{msg('sitemap.childSitemaps', 'Child Sitemaps')}</Typography><Typography variant="pi" textColor="neutral600">{msg('sitemap.childSitemapsHelp', 'The sitemap index references only enabled groups that currently contain eligible URLs.')}</Typography></div>
            <div className="seo-manager-table-wrap"><table className="seo-manager-table seo-health-table"><thead><tr>
              <th>{msg('sitemap.source', 'Source')}</th><th>{msg('sitemap.path', 'Sitemap')}</th><th>{msg('sitemap.urls', 'URLs')}</th><th>{msg('sitemap.status', 'Status')}</th><th>{msg('sitemap.lastModified', 'Last modified')}</th>
            </tr></thead><tbody>{report.sitemapGroups.map((group) => <tr key={group.key}>
              <td><strong>{group.label}</strong></td><td>{group.enabled ? <a href={`${report.origin}${group.path}`} target="_blank" rel="noreferrer">{group.path} <ExternalLink aria-hidden="true" /></a> : <code>{group.path}</code>}</td><td>{group.urlCount}</td><td>{group.enabled ? msg('sitemap.enabled', 'Enabled') : msg('common.off', 'Off')}</td><td>{formatLastModified(group.lastModified)}</td>
            </tr>)}</tbody></table></div>
          </section>
          <Typography variant="pi" textColor="neutral600" className="seo-sitemap-status">
            {report.enabled ? msg('sitemap.enabled', 'Enabled') : msg('sitemap.disabled', 'Disabled')} · {msg('health.generatedAt', 'Last analyzed')}: {report.generatedAt ? new Date(report.generatedAt).toLocaleString() : '—'}
          </Typography>

          <section className="seo-sitemap-subsection">
            <div><Typography variant="delta" tag="h3">{msg('sitemap.routes', 'Routes and child URLs')}</Typography><Typography variant="pi" textColor="neutral600">{msg('sitemap.routesHelp', 'Expand a parent route to inspect its child URLs. Route patterns are application-managed; switches only control sitemap inclusion.')}</Typography></div>
            {hasPolicyChanges ? <Flex justifyContent="flex-end"><Button loading={saving} onClick={() => void savePolicy()}>{msg('sitemap.savePolicy', 'Save sitemap policy')}</Button></Flex> : null}
            <div className="seo-manager-table-wrap"><table className="seo-manager-table seo-sitemap-tree-table"><thead><tr>
              <th>{msg('sitemap.source', 'Parent route')}</th><th>{msg('sitemap.path', 'Route pattern')}</th><th>{msg('sitemap.urls', 'URLs')}</th><th>{msg('sitemap.enabledLabel', 'Sitemap')}</th><th>{msg('sitemap.childRoutes', 'Child routes')}</th>
            </tr></thead><tbody>{parentRoutes.map((parent) => {
              const primarySource = parent.staticSource || parent.collectionSource
              const primaryCategory: keyof Policy = parent.staticSource ? 'staticRoutes' : 'contentTypes'
              const expanded = Boolean(expandedRows[parent.key])
              const routePattern = [parent.staticSource?.path, parent.collectionSource?.routePattern].filter(Boolean).join('\n') || parent.path
              return <React.Fragment key={parent.key}>
                <tr>
                  <td><strong>{parent.label}</strong>{parent.staticSource?.sitemapPath ? <a className="seo-sitemap-child-link" href={`${report.origin}${parent.staticSource.sitemapPath}`} target="_blank" rel="noreferrer">{parent.staticSource.sitemapPath} <ExternalLink aria-hidden="true" /></a> : null}</td>
                  <td><code className="seo-sitemap-route-pattern">{routePattern}</code></td>
                  <td>{parent.urlCount}</td>
                  <td>{primarySource ? sourceSwitch(primarySource, primaryCategory) : '—'}</td>
                  <td>{parent.children.length ? <button type="button" className="seo-sitemap-expand" aria-expanded={expanded} aria-controls={`sitemap-children-${parent.key}`} onClick={() => setExpandedRows((current) => ({ ...current, [parent.key]: !current[parent.key] }))}>{expanded ? '−' : '+'} {expanded ? msg('sitemap.hideChildren', 'Hide') : msg('sitemap.showChildren', 'Show')} ({parent.children.length})</button> : '—'}</td>
                </tr>
                {expanded ? <tr className="seo-sitemap-expanded-row"><td colSpan={5}>
                  <div id={`sitemap-children-${parent.key}`} className="seo-sitemap-child-table-panel">
                    <div className="seo-sitemap-child-table-heading"><div><strong>{parent.label} — {msg('sitemap.childRoutes', 'Child routes')}</strong><span>{parent.collectionSource?.routePattern || parent.path}</span></div>{parent.collectionSource ? sourceSwitch(parent.collectionSource, 'contentTypes') : null}</div>
                    <div className="seo-manager-table-wrap"><table className="seo-manager-table seo-sitemap-child-table"><thead><tr><th>{msg('health.columnContent', 'Content / URL')}</th><th>{msg('health.columnType', 'Type')}</th><th>{msg('sitemap.lastModified', 'Last modified')}</th><th>{msg('sitemap.status', 'Status')}</th><th>{msg('health.columnAction', 'Action')}</th></tr></thead><tbody>
                      {parent.children.map((child) => <tr key={child.path}><td><a href={child.url} target="_blank" rel="noreferrer">{child.label}</a><code className="seo-health-path">{child.path}</code></td><td>{child.contentType}</td><td>{formatLastModified(child.lastModified)}</td><td><span className={`seo-sitemap-inclusion ${child.included ? 'is-included' : 'is-excluded'}`}>{child.included ? msg('sitemap.includedStatus', 'Included') : child.reason || msg('sitemap.excludedStatus', 'Excluded')}</span></td><td>{child.adminEditUrl ? <Link to={child.adminEditUrl}>{msg('sitemap.editEntry', 'Edit')}</Link> : '—'}</td></tr>)}
                    </tbody></table></div>
                  </div>
                </td></tr> : null}
              </React.Fragment>
            })}</tbody></table></div>
            <Box padding={4} className="seo-sitemap-policy-note"><Typography variant="pi">{msg('sitemap.globalPolicyNote', 'Global indexing, entry noindex, canonical, redirect and include_in_sitemap rules remain authoritative.')}</Typography></Box>
          </section>

          {report.issues.length > 0 ? (
            <section className="seo-sitemap-subsection">
              <details className="seo-sitemap-disclosure" open><summary>{msg('sitemap.validation', 'Issues requiring attention')} ({report.issues.length})</summary>
              <div className="seo-manager-table-wrap"><table className="seo-manager-table seo-health-table"><thead><tr>
                <th>{msg('health.columnSeverity', 'Severity')}</th><th>{msg('health.columnIssue', 'Issue')}</th><th>{msg('health.columnContent', 'Path')}</th>
              </tr></thead><tbody>{report.issues.map((issue) => <tr key={`${issue.code}:${issue.path}`}>
                <td><span className={`seo-health-badge seo-health-badge--${issue.severity}`}>{msg(`severity.${issue.severity}`, issue.severity)}</span></td>
                <td><strong>{issue.title}</strong><p className="seo-sitemap-issue-description">{issue.description}</p></td><td><code>{issue.path || '—'}</code></td>
              </tr>)}</tbody></table></div></details>
            </section>
          ) : null}

          {report.excluded.length > 0 ? <details className="seo-sitemap-disclosure"><summary>{msg('sitemap.excludedDetails', 'Excluded URLs')} ({report.excluded.length})</summary>
            <div className="seo-manager-table-wrap"><table className="seo-manager-table seo-health-table"><thead><tr><th>{msg('health.columnContent', 'Content')}</th><th>{msg('health.columnType', 'Type')}</th><th>{msg('sitemap.reason', 'Exclusion reason')}</th></tr></thead><tbody>
              {report.excluded.slice(0, 100).map((item) => <tr key={`${item.locale}:${item.path}:${item.reason}`}><td>{item.label}<code className="seo-health-path">{item.path}</code></td><td>{item.contentType}</td><td>{item.reason}</td></tr>)}
            </tbody></table></div>
          </details> : null}
        </>
      )}
    </div>
  )
}
