import React, { useState } from 'react';
import { Box, Button, Divider, Main, ProgressBar, Typography } from '@strapi/design-system';
import { Download } from '@strapi/icons';

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
    <Main>
        <Box padding={8} background="neutral0">
            <Typography variant="beta" tag="h1">Backup Management</Typography>
            <Typography variant="epsilon" textColor="neutral600" marginTop={2}>
              Create and download a backup of the current Strapi CMS.
            </Typography>
          </Box>
          {error ? <Box marginTop={4} padding={4} background="danger100"><Typography textColor="danger700">{error}</Typography></Box> : null}
          {loading ? (
            <Box marginTop={4} padding={4} background="neutral0">
              <Typography>{progress === null ? 'Preparing and downloading backup…' : `Downloading backup… ${progress}%`}</Typography>
              <Box marginTop={2}>
                <ProgressBar value={progress ?? undefined} max={100} aria-label="Backup download progress" />
              </Box>
            </Box>
          ) : null}
          <Box marginTop={6} padding={6} background="neutral0">
            <Typography variant="delta" tag="h2">Database Backup</Typography>
            <Typography textColor="neutral600" marginTop={2}>Includes: PostgreSQL database</Typography>
            <Box marginTop={4}><Button startIcon={<Download />} loading={loading === 'database'} disabled={Boolean(loading)} onClick={() => handleDownload('database')}>Download Database Backup</Button></Box>
          </Box>
          <Divider marginTop={6} />
          <Box marginTop={6} padding={6} background="neutral0">
            <Typography variant="delta" tag="h2">Full Backup</Typography>
            <Typography textColor="neutral600" marginTop={2}>Includes: PostgreSQL database and locally uploaded images and files</Typography>
            <Box marginTop={4}><Button startIcon={<Download />} loading={loading === 'full'} disabled={Boolean(loading)} onClick={() => handleDownload('full')}>Download Full Backup</Button></Box>
          </Box>
          <Divider marginTop={6} />
          <Box marginTop={6} padding={6} background="neutral0">
            <Typography variant="delta" tag="h2">Uploaded Images and Files Backup</Typography>
            <Typography textColor="neutral600" marginTop={2}>Includes: all files stored in the local Strapi uploads directory</Typography>
            <Box marginTop={4}><Button startIcon={<Download />} loading={loading === 'uploads'} disabled={Boolean(loading)} onClick={() => handleDownload('uploads')}>Download Uploaded Images and Files Backup</Button></Box>
          </Box>
    </Main>
  );
};

export default App;
