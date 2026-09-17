import React, { useState } from 'react';
import { Box, Button, Divider, Main, ProgressBar, Typography } from '@strapi/design-system';
import { Download } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { useTheme } from 'styled-components';
import '../styles.css';

type BackupType = 'database' | 'full' | 'uploads';

const getAdminToken = () => {
  const persistedToken = window.localStorage.getItem('jwtToken');
  if (persistedToken) {
    try {
      return JSON.parse(persistedToken) as string;
    } catch {
      return persistedToken;
    }
  }

  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('jwtToken='))
    ?.slice('jwtToken='.length) || '';
};

const downloadBackup = async (type: BackupType, onProgress: (value: number | null) => void) => {
  const token = getAdminToken();
  const response = await fetch(`/backup-manager/download/${type}`, {
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { error?: { message?: string } } | null;
    throw new Error(payload?.error?.message || 'Unable to create the backup.');
  }

  const total = Number(response.headers.get('content-length'));
  const reader = response.body?.getReader();
  const chunks: BlobPart[] = [];
  let received = 0;

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.byteLength;
        onProgress(total > 0 ? Math.min(100, Math.round((received / total) * 100)) : null);
      }
    }
  } else {
    chunks.push(await response.blob());
  }

  onProgress(100);
  const blob = new Blob(chunks, { type: response.headers.get('content-type') || 'application/gzip' });
  const disposition = response.headers.get('content-disposition') || '';
  const fileName = disposition.match(/filename="?([^";]+)"?/i)?.[1] || `strapi-${type}-backup.tar.gz`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const App = () => {
  const { formatMessage } = useIntl();
  const theme = useTheme() as { colors: Record<string, string> };
  const themeStyle = {
    '--backup-manager-page-background': theme.colors.neutral100,
    '--backup-manager-surface': theme.colors.neutral0,
    '--backup-manager-border': theme.colors.neutral200,
    '--backup-manager-muted': theme.colors.neutral600,
  } as React.CSSProperties;
  const [loading, setLoading] = useState<BackupType | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleDownload = async (type: BackupType) => {
    setError('');
    setLoading(type);
    setProgress(null);
    try {
      await downloadBackup(type, setProgress);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create the backup.');
    } finally {
      setLoading(null);
      setProgress(null);
    }
  };

  return (
    <Main className="backup-manager-page" style={themeStyle}>
      <Box padding={8} className="backup-manager-hero">
        <Typography variant="beta" tag="h1">
          {formatMessage({ id: 'backup-manager.page.title', defaultMessage: 'Backup Management' })}
        </Typography>
        <Typography variant="epsilon" textColor="neutral600" marginTop={2}>
          {formatMessage({ id: 'backup-manager.page.description', defaultMessage: 'Create and download a backup of the current Strapi CMS.' })}
        </Typography>
      </Box>
      {error ? <Box marginTop={4} padding={4} background="danger100"><Typography textColor="danger700">{error}</Typography></Box> : null}
      {loading ? (
        <Box marginTop={4} padding={6} background="neutral0" className="backup-manager-progress">
          <Box className="backup-manager-progress__header">
            <Typography variant="delta">
              {formatMessage({ id: 'backup-manager.progress.title', defaultMessage: 'Backup in progress' })}
            </Typography>
            <Typography textColor="neutral600">
              {progress === null
                ? formatMessage({ id: 'backup-manager.progress.preparing', defaultMessage: 'Preparing your secure download…' })
                : formatMessage({ id: 'backup-manager.progress.downloading', defaultMessage: 'Downloading… {progress}%', values: { progress } })}
            </Typography>
          </Box>
          <Box marginTop={4} className="backup-manager-progress__bar">
            <ProgressBar value={progress ?? undefined} max={100} aria-label={formatMessage({ id: 'backup-manager.progress.label', defaultMessage: 'Backup download progress' })} />
          </Box>
        </Box>
      ) : null}
      <Box className="backup-manager-grid" marginTop={6}>
        {([
          { type: 'database' as const, title: 'backup-manager.card.database.title', description: 'backup-manager.card.database.description', action: 'backup-manager.card.database.action' },
          { type: 'full' as const, title: 'backup-manager.card.full.title', description: 'backup-manager.card.full.description', action: 'backup-manager.card.full.action' },
          { type: 'uploads' as const, title: 'backup-manager.card.uploads.title', description: 'backup-manager.card.uploads.description', action: 'backup-manager.card.uploads.action' },
        ] as const).map((card) => (
          <Box key={card.type} padding={6} background="neutral0" className="backup-manager-card">
            <Typography variant="delta" tag="h2">{formatMessage({ id: card.title })}</Typography>
            <Typography textColor="neutral600" marginTop={2}>{formatMessage({ id: card.description })}</Typography>
            <Box marginTop={6} className="backup-manager-card__action">
              <Button startIcon={<Download />} loading={loading === card.type} disabled={Boolean(loading)} onClick={() => handleDownload(card.type)}>
                {formatMessage({ id: card.action })}
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
      <Divider marginTop={6} />
    </Main>
  );
};

export default App;
