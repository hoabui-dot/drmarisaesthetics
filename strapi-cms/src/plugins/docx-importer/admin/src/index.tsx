import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Modal, Radio, Typography } from '@strapi/design-system';
import { File } from '@strapi/icons';
import { useNotification } from '@strapi/strapi/admin';
import { useForm } from '@strapi/admin/strapi-admin';
import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/content-manager/strapi-admin';
import { useLocation, useNavigate } from 'react-router-dom';
import { installWordTableClipboardBridge } from './clipboard';

const SERVICE_MODEL = 'api::service.service';
const PENDING_IMPORT_KEY = 'docx-importer:pending-service';

type ImportSummary = { fileName: string; fileSize: number; blockCount: number; blockTypes: Record<string, number>; warnings: string[] };
type ImportResponse = { data?: { blocks?: unknown[]; summary?: ImportSummary }; error?: { message?: string } };
const formatBytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

type ImportDocxModalProps = { onClose: () => void; onApply: (blocks: unknown[], summary: ImportSummary) => void };

const ImportDocxModal = ({ onClose, onApply }: ImportDocxModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [clipboardContent, setClipboardContent] = useState('');
  const [mode, setMode] = useState<'replace' | 'append'>('replace');
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [blocks, setBlocks] = useState<unknown[] | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'ready' | 'error'>('idle');
  const [error, setError] = useState('');
  const blockSummary = useMemo(() => summary ? Object.entries(summary.blockTypes).map(([type, count]) => `${count} ${type}`).join(' · ') : '', [summary]);

  const parse = async () => {
    if (!file && !clipboardContent.trim()) return;
    setStatus('processing');
    setError('');
    try {
      const response = file
        ? await fetch('/docx-importer/transform', (() => { const body = new FormData(); body.append('file', file); return { method: 'POST', body, credentials: 'include' }; })())
        : await fetch('/docx-importer/transform-clipboard', { method: 'POST', body: JSON.stringify({ html: clipboardContent }), credentials: 'include', headers: { 'Content-Type': 'application/json' } });
      const payload = await response.json() as ImportResponse;
      if (!response.ok || !payload.data?.blocks || !payload.data.summary) throw new Error(payload.error?.message || 'The DOCX file could not be imported.');
      setBlocks(payload.data.blocks);
      setSummary(payload.data.summary);
      setStatus('ready');
    } catch (reason) {
      setStatus('error');
      setError(reason instanceof Error ? reason.message : 'The DOCX file could not be imported.');
    }
  };

  const apply = () => { if (blocks && summary) onApply(blocks, summary); };

  return <>
    <Modal.Body>
      {status !== 'ready' ? <>
        <Typography id="docx-import-title" variant="epsilon">Choose a .docx file. The imported content will be placed in a new Service form.</Typography>
        <input aria-label="DOCX file" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => { setFile(event.target.files?.[0] || null); setClipboardContent(''); setStatus('idle'); }} />
        <Typography marginTop={4} variant="pi">Or paste content copied from Word, Google Docs or Markdown below. Clipboard HTML is converted to Better Blocks before preview.</Typography>
        <textarea aria-label="Paste Word or Markdown content" rows={6} value={clipboardContent} onChange={(event) => { setClipboardContent(event.target.value); setFile(null); setStatus('idle'); }} onPaste={(event) => {
          const html = event.clipboardData.getData('text/html');
          if (html) { event.preventDefault(); setClipboardContent(html); }
        }} placeholder="Paste Word / Markdown content here" />
        <Flex gap={4} marginTop={4} direction="column" alignItems="start">
          <Radio label="Replace imported content" selected={mode === 'replace'} onChange={() => setMode('replace')} value="replace" />
          <Radio label="Append imported content" selected={mode === 'append'} onChange={() => setMode('append')} value="append" />
        </Flex>
        {file ? <Typography marginTop={4}>{file.name} · {formatBytes(file.size)}</Typography> : null}
        {clipboardContent ? <Typography marginTop={4}>Clipboard content ready to import.</Typography> : null}
      </> : <>
        <Typography id="docx-import-title" variant="epsilon">Import summary</Typography>
        <Typography marginTop={3}>{summary?.fileName} · {summary ? formatBytes(summary.fileSize) : ''}</Typography>
        <Typography marginTop={2}>{summary?.blockCount} blocks · {blockSummary}</Typography>
        {summary?.warnings.length ? <Typography marginTop={3} textColor="warning600">Warnings: {summary.warnings.join(' ')}</Typography> : <Typography marginTop={3} textColor="success600">No conversion warnings.</Typography>}
      </>}
      {error ? <Typography marginTop={3} textColor="danger600">{error}</Typography> : null}
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onClose} variant="tertiary">Cancel</Button>
      {status === 'ready' ? <Button onClick={apply}>Continue to Create Service</Button> : <Button onClick={parse} disabled={(!file && !clipboardContent.trim()) || status === 'processing'} loading={status === 'processing'}>Import &amp; Preview</Button>}
    </Modal.Footer>
  </>;
};

const ListImportAction = () => {
  const { model } = useContentManagerContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  if (model !== SERVICE_MODEL) return null;

  const handleApply = (blocks: unknown[], summary: ImportSummary) => {
    sessionStorage.setItem(PENDING_IMPORT_KEY, JSON.stringify({ blocks, summary, createdAt: Date.now() }));
    setOpen(false);
    navigate(`/content-manager/collection-types/${SERVICE_MODEL}/create`);
  };

  return <>
    <Button startIcon={<File />} variant="secondary" onClick={() => setOpen(true)}>Import DOCX</Button>
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Content>
        <Modal.Header><Modal.Title>Import DOCX to New Service</Modal.Title></Modal.Header>
        {open ? <ImportDocxModal onClose={() => setOpen(false)} onApply={handleApply} /> : null}
      </Modal.Content>
    </Modal.Root>
  </>;
};

const PendingServiceImportHydrator = () => {
  const { model, id } = useContentManagerContext();
  const location = useLocation();
  const { onChange } = useForm('DOCX service import', (state) => ({ onChange: state.onChange }));
  useEffect(() => {
    if (model !== SERVICE_MODEL || id !== 'create') return;
    const raw = sessionStorage.getItem(PENDING_IMPORT_KEY);
    if (!raw) return;
    try {
      const pending = JSON.parse(raw) as { blocks?: unknown[] };
      if (Array.isArray(pending.blocks)) onChange('contentBetterBlocks', pending.blocks);
    } finally {
      sessionStorage.removeItem(PENDING_IMPORT_KEY);
    }
  }, [id, location.pathname, model, onChange]);
  return null;
};

const ClipboardBridgeMount = () => {
  const { toggleNotification } = useNotification();
  useEffect(() => installWordTableClipboardBridge({ notify: toggleNotification }), [toggleNotification]);
  return null;
};

export default {
  register() {},
  bootstrap(app: { getPlugin: (name: string) => { injectComponent: (container: string, block: string, component: { name: string; Component: React.ComponentType }) => void } }) {
    installWordTableClipboardBridge();
    const contentManager = app.getPlugin('content-manager');
    contentManager.injectComponent('listView', 'actions', { name: 'docx-importer-list-action', Component: ListImportAction });
    contentManager.injectComponent('editView', 'informations', { name: 'docx-importer-pending-hydrator', Component: PendingServiceImportHydrator });
    contentManager.injectComponent('editView', 'informations', { name: 'docx-importer-clipboard-bridge', Component: ClipboardBridgeMount });
  },
};
