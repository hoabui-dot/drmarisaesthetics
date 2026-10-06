import React, { useCallback, useEffect, useState } from 'react'
import { Button, Flex, Modal, SingleSelect, SingleSelectOption, TextInput, Toggle, Typography } from '@strapi/design-system'
import { Plus, Trash } from '@strapi/icons'
import { useFetchClient, useNotification } from '@strapi/admin/strapi-admin'

type Kind = 'verification' | 'tracking'
type Row = Record<string, any>
const API_BASE = '/seo-manager/marketing/config'
const providers: Record<Kind, Array<[string, string]>> = {
  verification: [['google_search_console', 'Google Search Console'], ['bing_webmaster', 'Bing Webmaster Tools']],
  tracking: [['google_tag_manager', 'Google Tag Manager'], ['google_analytics_4', 'Google Analytics 4'], ['google_ads', 'Google Ads'], ['meta_pixel', 'Meta Pixel'], ['openai_ads', 'OpenAI Ads Pixel']],
}

function unwrap(response: any): any { return response?.data?.data ?? response?.data ?? response }
function empty(kind: Kind): Row {
  return kind === 'verification'
    ? { internal_name: '', provider: 'google_search_console', verification_method: 'meta_tag', verification_token: '', enabled: true }
    : { internal_name: '', provider: 'google_tag_manager', public_id: '', enabled: false }
}
function validId(provider: string, value: string): boolean {
  if (provider === 'google_tag_manager') return /^GTM-[A-Z0-9]+$/i.test(value)
  if (provider === 'google_analytics_4') return /^G-[A-Z0-9]+$/i.test(value)
  if (provider === 'google_ads') return /^AW-[0-9]+$/i.test(value)
  if (provider === 'meta_pixel') return /^[0-9]{5,20}$/.test(value)
  return /^[A-Za-z0-9_-]{8,128}$/.test(value)
}

export function MarketingManager({ msg }: { msg: (key: string, fallback: string) => string }) {
  const { get, post, put, del } = useFetchClient()
  const { toggleNotification } = useNotification()
  const [kind, setKind] = useState<Kind>('verification')
  const [rows, setRows] = useState<Row[]>([])
  const [edit, setEdit] = useState<Row | null>(null)
  const [context, setContext] = useState({ frontendUrl: '', hostname: '', nodeEnvironment: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [response, site] = await Promise.all([
        get(`${API_BASE}/${kind}`),
        get('/seo-manager/marketing/site-context').catch(() => null),
      ])
      const body = unwrap(response)
      setRows(Array.isArray(body) ? body : Array.isArray(body?.results) ? body.results : [])
      if (site) setContext(unwrap(site))
    } catch {
      setRows([])
      toggleNotification({ type: 'warning', message: msg('marketing.loadError', 'Marketing settings could not be loaded. Check the SEO Manager permission.') })
    } finally { setLoading(false) }
  }, [get, kind, msg, toggleNotification])

  useEffect(() => { void load() }, [load])

  const save = async () => {
    if (!edit || !String(edit.internal_name || '').trim()) return
    if (kind === 'verification' && !String(edit.verification_token || '').trim()) return
    if (kind === 'tracking' && !validId(edit.provider, String(edit.public_id || '').trim())) {
      toggleNotification({ type: 'warning', message: msg('marketing.invalidId', 'Enter a valid provider ID before saving.') })
      return
    }
    setSaving(true)
    try {
      const payload = { ...edit }
      const documentId = payload.documentId
      for (const key of ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt']) delete payload[key]
      if (documentId) await put(`${API_BASE}/${kind}/${documentId}`, { data: payload })
      else await post(`${API_BASE}/${kind}`, { data: payload })
      setEdit(null)
      toggleNotification({ type: 'success', message: msg('marketing.saved', 'Configuration saved and published.') })
      await load()
    } catch {
      toggleNotification({ type: 'warning', message: msg('marketing.saveError', 'Could not save this configuration. Check the provider ID and permissions.') })
    } finally { setSaving(false) }
  }

  const remove = async (row: Row) => {
    if (!row.documentId || !window.confirm(msg('marketing.confirmDelete', 'Delete this configuration?'))) return
    try {
      await del(`${API_BASE}/${kind}/${row.documentId}`)
      await load()
    } catch { toggleNotification({ type: 'warning', message: msg('marketing.deleteError', 'Could not delete this configuration.') }) }
  }

  const input = (label: string, field: string, value: unknown) => (
    <label className="seo-manager-field"><Typography variant="pi" fontWeight="bold">{label}</Typography><TextInput value={String(value ?? '')} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEdit((current) => current ? { ...current, [field]: event.target.value } : current)} /></label>
  )

  return <div className="seo-manager-marketing">
    <Flex justifyContent="space-between" alignItems="center" gap={3} marginBottom={4}>
      <div><Typography variant="delta" tag="h2">{msg('marketing.title', 'SEO & Marketing')}</Typography><Typography variant="pi" textColor="neutral600">{msg('marketing.description', 'Configure search-engine ownership verification and approved tracking providers.')}</Typography></div>
      <Button startIcon={<Plus />} onClick={() => setEdit(empty(kind))}>{msg('marketing.add', 'Add configuration')}</Button>
    </Flex>
    {kind === 'verification' && <div className="seo-manager-panel" style={{ marginBottom: 16 }}><Typography variant="pi" fontWeight="bold">{msg('marketing.siteContext', 'Verification target')}</Typography><Typography variant="pi">{context.frontendUrl || msg('marketing.siteContextMissing', 'Set FRONTEND_URL in Strapi runtime environment.')}{context.hostname ? ` (${context.hostname})` : ''}</Typography></div>}
    <div className="seo-manager-tabs" role="tablist">
      <button type="button" className={kind === 'verification' ? 'is-active' : ''} onClick={() => setKind('verification')}>{msg('marketing.verification', 'Site Verification')}</button>
      <button type="button" className={kind === 'tracking' ? 'is-active' : ''} onClick={() => setKind('tracking')}>{msg('marketing.integrations', 'Tracking Integrations')}</button>
    </div>
    {loading ? <Typography variant="pi">{msg('marketing.loading', 'Loading…')}</Typography> : rows.length ? <div className="seo-manager-table-wrap"><table className="seo-manager-table"><thead><tr><th>{msg('marketing.name', 'Name')}</th><th>{msg('marketing.provider', 'Provider')}</th><th>{msg('marketing.value', 'Verification token / Public ID')}</th><th>{msg('marketing.status', 'Status')}</th><th /></tr></thead><tbody>{rows.map((row) => <tr key={row.documentId || row.id}><td>{row.internal_name}</td><td>{providers[kind].find(([value]) => value === row.provider)?.[1] || row.provider}</td><td><code>{kind === 'verification' ? row.verification_token : row.public_id}</code></td><td>{row.enabled ? msg('marketing.enabled', 'Enabled') : msg('marketing.disabled', 'Disabled')}</td><td><Flex gap={2}><Button size="S" variant="secondary" onClick={() => setEdit({ ...row })}>{msg('marketing.edit', 'Edit')}</Button><Button size="S" variant="tertiary" onClick={() => void remove(row)}>{msg('marketing.delete', 'Delete')}</Button></Flex></td></tr>)}</tbody></table></div> : <div className="seo-manager-empty"><Typography variant="pi" textColor="neutral600">{msg('marketing.empty', 'No configurations yet.')}</Typography></div>}

    <Modal.Root open={Boolean(edit)} onOpenChange={(open) => { if (!open) setEdit(null) }}>
      <Modal.Content>
        <Modal.Header><Modal.Title>{edit?.documentId ? msg('marketing.editTitle', 'Edit configuration') : msg('marketing.createTitle', 'Add configuration')}</Modal.Title></Modal.Header>
        <Modal.Body><div className="seo-manager-fields">
          {input(msg('marketing.internalName', 'Internal name'), 'internal_name', edit?.internal_name)}
          <label className="seo-manager-field"><Typography variant="pi" fontWeight="bold">{msg('marketing.provider', 'Provider')}</Typography><SingleSelect value={String(edit?.provider || providers[kind][0][0])} onChange={(provider) => setEdit((current) => current ? { ...current, provider, ...(kind === 'tracking' ? { public_id: '' } : {}) } : current)}>{providers[kind].map(([value, label]) => <SingleSelectOption key={value} value={value}>{label}</SingleSelectOption>)}</SingleSelect></label>
          {kind === 'verification' ? input(msg('marketing.verificationToken', 'Verification token'), 'verification_token', edit?.verification_token) : input(msg('marketing.publicId', 'Provider public ID'), 'public_id', edit?.public_id)}
          <label className="seo-manager-toggle"><Toggle checked={edit?.enabled === true} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEdit((current) => current ? { ...current, enabled: event.target.checked } : current)}>{msg('marketing.enabled', 'Enabled')}</Toggle></label>
        </div></Modal.Body>
        <Modal.Footer><Button variant="tertiary" onClick={() => setEdit(null)}>{msg('marketing.cancel', 'Cancel')}</Button><Button loading={saving} onClick={() => void save()}>{msg('marketing.save', 'Save and publish')}</Button></Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  </div>
}
