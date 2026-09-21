import React, { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Main,
  SingleSelect,
  SingleSelectOption,
  TextInput,
  Textarea,
  Typography,
} from '@strapi/design-system'
import { ArrowClockwise, Plus, Trash } from '@strapi/icons'
import { useFetchClient, useNotification } from '@strapi/admin/strapi-admin'
import { useIntl } from 'react-intl'
import { useTheme } from 'styled-components'
import '../styles.css'
import { HealthDashboard } from './HealthDashboard'
import { SitemapManager } from './SitemapManager'

type Tab = 'health' | 'sitemap' | 'metadata' | 'robots' | 'redirects' | 'canonicals'
type Rule = { id?: number; documentId?: string; source_path: string; destination_path: string; status_code: string; is_active: boolean; notes?: string }
type CanonicalRule = { id?: number; documentId?: string; source_path: string; canonical_url: string; is_active: boolean; notes?: string }
type RecordValue = Record<string, unknown>

const UID = {
  metadata: 'api::seo-manager-settings.seo-manager-settings',
  robots: 'api::robots-settings.robots-settings',
  redirects: 'api::redirect.redirect',
  canonicals: 'api::canonical-rule.canonical-rule',
}
const BASE = '/content-manager'
const metadataDefaults: RecordValue = {
  default_meta_title: '', meta_title_template: '', default_meta_description: '', site_name: '',
  default_open_graph_title: '', default_open_graph_description: '', structured_data_enabled: true,
  structured_data_business_type: 'MedicalClinic', sitemap_enabled: true,
}
const robotsDefaults: RecordValue = { indexing_enabled: true, rules: [], sitemap_url: '', additional_directives: '' }
const businessTypes = ['Organization', 'Dentist', 'MedicalBusiness', 'MedicalClinic', 'ProfessionalService']
const emptyRedirect: Rule = { source_path: '', destination_path: '', status_code: 'redirect_301', is_active: true, notes: '' }
const emptyCanonical: CanonicalRule = { source_path: '', canonical_url: '', is_active: true, notes: '' }

function unwrap(value: any): any {
  return value?.data?.data ?? value?.data ?? value
}

function getRows(value: any): any[] {
  const body = unwrap(value)
  const candidates = [body?.results, body?.data, body]
  return candidates.find(Array.isArray) || []
}

function isNotFound(error: unknown): boolean {
  const candidate = error as { status?: number; response?: { status?: number } } | null
  return candidate?.status === 404 || candidate?.response?.status === 404
}

export const App = () => {
  const { get, put, post, del } = useFetchClient()
  const { toggleNotification } = useNotification()
  const { formatMessage } = useIntl()
  const theme = useTheme() as { colors: Record<string, string>; shadows?: Record<string, string> }
  const themeStyle = {
    '--seo-manager-page-background': theme.colors.neutral100,
    '--seo-manager-surface': theme.colors.neutral0,
    '--seo-manager-text': theme.colors.neutral800,
    '--seo-manager-muted': theme.colors.neutral600,
    '--seo-manager-border': theme.colors.neutral200,
    '--seo-manager-border-subtle': theme.colors.neutral150,
    '--seo-manager-border-strong': theme.colors.neutral300,
    '--seo-manager-accent': theme.colors.primary600,
    '--seo-health-critical': theme.colors.danger600 || '#a61b13',
    '--seo-health-warning': theme.colors.warning600 || '#8a4b08',
    '--seo-health-success': theme.colors.success600 || '#328048',
    '--seo-manager-table-header': theme.colors.neutral100,
    '--seo-manager-shadow': theme.shadows?.popupShadow || 'none',
  } as React.CSSProperties
  const [tab, setTab] = useState<Tab>(() => {
    const requested = new URLSearchParams(window.location.search).get('tab')
    return requested === 'sitemap' || requested === 'redirects' || requested === 'canonicals' || requested === 'robots' || requested === 'metadata' ? requested : 'health'
  })
  const [metadata, setMetadata] = useState<RecordValue>(metadataDefaults)
  const [robots, setRobots] = useState<RecordValue>(robotsDefaults)
  const [redirects, setRedirects] = useState<Rule[]>([])
  const [canonicals, setCanonicals] = useState<CanonicalRule[]>([])
  const [edit, setEdit] = useState<Rule | CanonicalRule | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const msg = useCallback((key: string, fallback: string) => formatMessage({ id: `seo-manager.${key}`, defaultMessage: fallback }), [formatMessage])

  const loadCollection = useCallback(async (uid: string) => {
    const rows: any[] = []
    let page = 1
    let pageCount = 1
    do {
      const response = await get(`${BASE}/collection-types/${uid}?page=${page}&pageSize=100&sort=source_path:asc&status=published`)
      rows.push(...getRows(response))
      const body = unwrap(response)
      pageCount = Number(body?.pagination?.pageCount || 1)
      page += 1
    } while (page <= pageCount)
    return rows
  }, [get])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const loadSingle = async (uid: string) => {
        try {
          return await get(`${BASE}/single-types/${uid}`)
        } catch (error) {
          // New Strapi single types return 404 until their first draft exists.
          // Treat that as an empty editable state instead of hiding all four
          // management sections behind one failed Promise.all().
          if (isNotFound(error)) return null
          throw error
        }
      }
      const [metadataResponse, robotsResponse, redirectsResponse, canonicalsResponse] = await Promise.all([
        loadSingle(UID.metadata),
        loadSingle(UID.robots),
        loadCollection(UID.redirects),
        loadCollection(UID.canonicals),
      ])
      setMetadata({ ...metadataDefaults, ...(unwrap(metadataResponse) || {}) })
      const robotsData = unwrap(robotsResponse) || {}
      setRobots({ ...robotsDefaults, ...robotsData, rules: Array.isArray(robotsData.rules) ? robotsData.rules : [] })
      setRedirects(redirectsResponse)
      setCanonicals(canonicalsResponse)
    } catch {
      toggleNotification({ type: 'warning', message: msg('error.load', 'SEO settings could not be loaded. Check your Content Manager permissions and try again.') })
    } finally {
      setLoading(false)
    }
  }, [get, loadCollection, toggleNotification, msg])

  useEffect(() => { void load() }, [load])

  const saveSingle = async (kind: 'metadata' | 'robots') => {
    setSaving(true)
    try {
      const uid = UID[kind]
      await put(`${BASE}/single-types/${uid}`, { data: kind === 'metadata' ? metadata : robots })
      await post(`${BASE}/single-types/${uid}/actions/publish`, {})
      toggleNotification({ type: 'success', message: msg('success.settings', 'SEO settings saved and published.') })
      await load()
    } catch {
      toggleNotification({ type: 'warning', message: msg('error.save', 'Could not save these SEO settings. Check Content Manager permissions and try again.') })
    } finally {
      setSaving(false)
    }
  }

  const saveRule = async () => {
    if (!edit) return
    const isRedirect = 'destination_path' in edit
    const kind = isRedirect ? 'redirects' : 'canonicals'
    const uid = UID[kind]
    setSaving(true)
    try {
      const payload: Record<string, unknown> = { ...edit }
      delete payload.id
      delete payload.documentId
      delete payload.publishedAt
      delete payload.createdAt
      delete payload.updatedAt
      const documentId = edit.documentId
      if (documentId) {
        await put(`${BASE}/collection-types/${uid}/${documentId}`, { data: payload })
        await post(`${BASE}/collection-types/${uid}/${documentId}/actions/publish`, {})
      } else {
        const response = await post(`${BASE}/collection-types/${uid}`, { data: payload })
        const created = unwrap(response)
        const createdDocumentId = created?.documentId || created?.data?.documentId
        if (createdDocumentId) await post(`${BASE}/collection-types/${uid}/${createdDocumentId}/actions/publish`, {})
      }
      setEdit(null)
      toggleNotification({ type: 'success', message: msg('success.rule', 'SEO rule saved and published.') })
      await load()
    } catch {
      toggleNotification({ type: 'warning', message: msg('error.rule', 'Could not save this rule. Verify the path and your permissions, then try again.') })
    } finally {
      setSaving(false)
    }
  }

  const removeRule = async (item: Rule | CanonicalRule, kind: 'redirects' | 'canonicals') => {
    if (!item.documentId || !window.confirm(msg('confirm.delete', 'Delete this SEO rule? This cannot be undone.'))) return
    try {
      await del(`${BASE}/collection-types/${UID[kind]}/${item.documentId}`)
      toggleNotification({ type: 'success', message: msg('success.delete', 'SEO rule deleted.') })
      await load()
    } catch {
      toggleNotification({ type: 'warning', message: msg('error.delete', 'Could not delete this SEO rule.') })
    }
  }

  const field = (label: string, value: unknown, onChange: (value: string) => void, options?: string[]) => (
    <label className="seo-manager-field">
      <Typography variant="pi" fontWeight="bold">{label}</Typography>
      {options ? (
        <SingleSelect value={String(value ?? '')} onChange={onChange} aria-label={label}>
          {options.map((option) => <SingleSelectOption key={option} value={option}>{option}</SingleSelectOption>)}
        </SingleSelect>
      ) : <TextInput value={String(value ?? '')} onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)} aria-label={label} />}
    </label>
  )
  const area = (label: string, value: unknown, onChange: (value: string) => void, maxLength?: number) => (
    <label className="seo-manager-field seo-manager-field--wide">
      <Typography variant="pi" fontWeight="bold">{label}</Typography>
      <Textarea value={String(value ?? '')} maxLength={maxLength} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)} aria-label={label} />
    </label>
  )
  const toggle = (key: string, label: string, state: RecordValue, setter: (value: RecordValue) => void) => (
    <label className="seo-manager-toggle"><input type="checkbox" checked={Boolean(state[key])} onChange={(event) => setter({ ...state, [key]: event.target.checked })} />{label}</label>
  )

  const renderSettings = () => tab === 'metadata' ? (
    <>
      <div className="seo-manager-fields">
        {field(msg('field.defaultTitle', 'Default meta title'), metadata.default_meta_title, (value) => setMetadata({ ...metadata, default_meta_title: value }))}
        {field(msg('field.siteName', 'Site name'), metadata.site_name, (value) => setMetadata({ ...metadata, site_name: value }))}
        {field(msg('field.titleTemplate', 'Meta title template'), metadata.meta_title_template, (value) => setMetadata({ ...metadata, meta_title_template: value }))}
        {field(msg('field.structuredType', 'Structured data business type'), metadata.structured_data_business_type, (value) => setMetadata({ ...metadata, structured_data_business_type: value }), businessTypes)}
        {area(msg('field.defaultDescription', 'Default meta description'), metadata.default_meta_description, (value) => setMetadata({ ...metadata, default_meta_description: value }), 160)}
        {field(msg('field.ogTitle', 'Default Open Graph title'), metadata.default_open_graph_title, (value) => setMetadata({ ...metadata, default_open_graph_title: value }))}
        {area(msg('field.ogDescription', 'Default Open Graph description'), metadata.default_open_graph_description, (value) => setMetadata({ ...metadata, default_open_graph_description: value }), 200)}
      </div>
      <div className="seo-manager-toggles">
        {toggle('structured_data_enabled', msg('field.structuredEnabled', 'Enable structured data'), metadata, setMetadata)}
        {toggle('sitemap_enabled', msg('field.sitemapEnabled', 'Enable sitemap'), metadata, setMetadata)}
      </div>
      <Flex justifyContent="flex-end" marginTop={5}><Button loading={saving} onClick={() => void saveSingle('metadata')}>{msg('action.save', 'Save and publish')}</Button></Flex>
    </>
  ) : (
    <>
      <div className="seo-manager-fields">
        <Typography variant="pi" textColor="neutral600">{msg('robots.sitemapManagedByFrontend', 'The public sitemap URL is generated from the frontend NEXT_PUBLIC_SERVER_URL environment setting.')}</Typography>
        {area(msg('field.additionalDirectives', 'Additional directives'), robots.additional_directives, (value) => setRobots({ ...robots, additional_directives: value }), 4000)}
      </div>
      {toggle('indexing_enabled', msg('field.indexingEnabled', 'Allow search engine indexing'), robots, setRobots)}
      <Box marginTop={5} className="seo-manager-subsection">
        <Flex justifyContent="space-between" alignItems="center" marginBottom={3}>
          <Typography variant="delta" tag="h2">{msg('robots.rules', 'Crawler rules')}</Typography>
          <Button variant="tertiary" startIcon={<Plus />} onClick={() => setRobots({ ...robots, rules: [...(robots.rules as RecordValue[]), { user_agent: '*', allow: '/', disallow: '' }] })}>{msg('action.addRule', 'Add rule')}</Button>
        </Flex>
        {(robots.rules as RecordValue[]).map((rule, index) => (
          <div className="seo-manager-rule" key={String(rule.id || index)}>
            {field(msg('field.userAgent', 'User agent'), rule.user_agent, (value) => { const rules = [...robots.rules as RecordValue[]]; rules[index] = { ...rule, user_agent: value }; setRobots({ ...robots, rules }) })}
            {area(msg('field.allowPaths', 'Allow paths (one per line)'), rule.allow, (value) => { const rules = [...robots.rules as RecordValue[]]; rules[index] = { ...rule, allow: value }; setRobots({ ...robots, rules }) })}
            {area(msg('field.disallowPaths', 'Disallow paths (one per line)'), rule.disallow, (value) => { const rules = [...robots.rules as RecordValue[]]; rules[index] = { ...rule, disallow: value }; setRobots({ ...robots, rules }) })}
            <Button variant="tertiary" onClick={() => setRobots({ ...robots, rules: (robots.rules as RecordValue[]).filter((_, ruleIndex) => ruleIndex !== index) })} aria-label={msg('action.removeRule', 'Remove rule')}><Trash /></Button>
          </div>
        ))}
      </Box>
      <Flex justifyContent="flex-end" marginTop={5}><Button loading={saving} onClick={() => void saveSingle('robots')}>{msg('action.save', 'Save and publish')}</Button></Flex>
    </>
  )

  const renderRuleList = (kind: 'redirects' | 'canonicals') => {
    const isRedirect = kind === 'redirects'
    const rows = (isRedirect ? redirects : canonicals) as (Rule | CanonicalRule)[]
    return (
      <>
        <Flex justifyContent="space-between" alignItems="center" marginBottom={4}>
          <div><Typography variant="delta" tag="h2">{msg(isRedirect ? 'redirects.title' : 'canonicals.title', isRedirect ? 'Redirect rules' : 'Canonical rules')}</Typography><Typography variant="pi" textColor="neutral600">{msg(isRedirect ? 'redirects.description' : 'canonicals.description', isRedirect ? 'Manage permanent and temporary URL redirects.' : 'Set canonical URL overrides for public paths.')}</Typography></div>
          <Button startIcon={<Plus />} onClick={() => setEdit(isRedirect ? { ...emptyRedirect } : { ...emptyCanonical })}>{msg('action.add', 'Add rule')}</Button>
        </Flex>
        {loading ? <Typography>{msg('status.loading', 'Loading SEO rules…')}</Typography> : rows.length === 0 ? <Box padding={5} className="seo-manager-empty"><Typography>{msg('status.empty', 'No rules yet. Add a rule to get started.')}</Typography></Box> : (
          <div className="seo-manager-table-wrap"><table className="seo-manager-table"><thead><tr><th>{msg('field.sourcePath', 'Source path')}</th><th>{isRedirect ? msg('field.destinationPath', 'Destination') : msg('field.canonicalUrl', 'Canonical URL')}</th>{isRedirect ? <th>{msg('field.statusCode', 'Status')}</th> : null}<th>{msg('field.active', 'Active')}</th><th>{msg('field.actions', 'Actions')}</th></tr></thead><tbody>
            {rows.map((item) => <tr key={item.documentId || item.id}>
              <td><code>{item.source_path}</code></td><td>{isRedirect ? (item as Rule).destination_path : (item as CanonicalRule).canonical_url}</td>
              {isRedirect ? <td>{(item as Rule).status_code.replace('redirect_', '')}</td> : null}
              <td>{item.is_active ? msg('common.yes', 'Yes') : msg('common.no', 'No')}</td>
              <td><Flex gap={2}><Button size="S" variant="tertiary" onClick={() => setEdit({ ...item })}>{msg('action.edit', 'Edit')}</Button><Button size="S" variant="danger-light" onClick={() => void removeRule(item, kind)} aria-label={msg('action.delete', 'Delete')}>{msg('action.delete', 'Delete')}</Button></Flex></td>
            </tr>)}
          </tbody></table></div>
        )}
        {edit && ((isRedirect && 'destination_path' in edit) || (!isRedirect && 'canonical_url' in edit)) ? (
          <div className="seo-manager-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEdit(null) }}>
            <section className="seo-manager-modal" role="dialog" aria-modal="true" aria-labelledby="seo-manager-modal-title">
              <Typography variant="beta" tag="h2" id="seo-manager-modal-title">{msg(edit.documentId ? 'action.editRule' : 'action.newRule', edit.documentId ? 'Edit rule' : 'New rule')}</Typography>
              <div className="seo-manager-fields">
                {field(msg('field.sourcePath', 'Source path'), edit.source_path, (value) => setEdit({ ...edit, source_path: value }))}
                {isRedirect ? field(msg('field.destinationPath', 'Destination path'), (edit as Rule).destination_path, (value) => setEdit({ ...edit, destination_path: value })) : field(msg('field.canonicalUrl', 'Canonical URL'), (edit as CanonicalRule).canonical_url, (value) => setEdit({ ...edit, canonical_url: value }))}
                {isRedirect ? field(msg('field.statusCode', 'Status code'), (edit as Rule).status_code, (value) => setEdit({ ...edit, status_code: value }), ['redirect_301', 'redirect_302', 'redirect_307', 'redirect_308']) : null}
                {area(msg('field.notes', 'Notes'), edit.notes, (value) => setEdit({ ...edit, notes: value }))}
              </div>
              <label className="seo-manager-toggle"><input type="checkbox" checked={Boolean(edit.is_active)} onChange={(event) => setEdit({ ...edit, is_active: event.target.checked })} />{msg('field.active', 'Active')}</label>
              <Flex justifyContent="flex-end" gap={2} marginTop={5}><Button variant="tertiary" onClick={() => setEdit(null)}>{msg('action.cancel', 'Cancel')}</Button><Button loading={saving} onClick={() => void saveRule()}>{msg('action.savePublish', 'Save and publish')}</Button></Flex>
            </section>
          </div>
        ) : null}
      </>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'health', label: msg('tab.health', 'SEO Health') },
    { id: 'sitemap', label: msg('tab.sitemap', 'Sitemap') },
    { id: 'metadata', label: msg('tab.metadata', 'Metadata') },
    { id: 'robots', label: msg('tab.robots', 'Robots.txt') },
    { id: 'redirects', label: msg('tab.redirects', 'Redirects') },
    { id: 'canonicals', label: msg('tab.canonicals', 'Canonical rules') },
  ]

  return (
    <Main className="seo-manager-page" style={themeStyle}>
      <Box padding={8} className="seo-manager-hero">
        <Flex justifyContent="space-between" alignItems="center" gap={4}>
          <div><Typography variant="alpha" tag="h1">{msg('page.title', 'SEO Manager')}</Typography><Typography variant="epsilon" textColor="neutral600" marginTop={2}>{msg('page.description', 'Manage site-wide search settings, crawler rules, redirects and canonical URLs in one place.')}</Typography></div>
          {tab !== 'health' ? <Button variant="tertiary" startIcon={<ArrowClockwise />} onClick={() => void load()} loading={loading}>{msg('action.refresh', 'Refresh')}</Button> : null}
        </Flex>
      </Box>
      <Box paddingLeft={8} paddingRight={8} paddingTop={5} paddingBottom={8}>
        <nav className="seo-manager-tabs" aria-label={msg('page.sections', 'SEO management sections')}>
          {tabs.map((item) => <button key={item.id} type="button" className={tab === item.id ? 'is-active' : ''} onClick={() => setTab(item.id)}>{item.label}</button>)}
        </nav>
        <section className="seo-manager-panel">
          {tab === 'health' ? <HealthDashboard msg={msg} /> : tab === 'sitemap' ? <SitemapManager msg={msg} /> : tab === 'metadata' || tab === 'robots' ? renderSettings() : renderRuleList(tab)}
        </section>
      </Box>
    </Main>
  )
}

export default App
