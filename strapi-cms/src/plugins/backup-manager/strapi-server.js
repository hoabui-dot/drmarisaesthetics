'use strict';

const { TarArchive } = require('archiver');
const { access, mkdir, mkdtemp, rm, stat } = require('node:fs/promises');
const { createReadStream, createWriteStream } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');
const { spawn } = require('node:child_process');

const BACKUP_PERMISSION = 'plugin::backup-manager.download';
let backupInProgress = false;

const permissionPolicy = {
  name: 'admin::hasPermissions',
  config: { actions: [BACKUP_PERMISSION] },
};

const getDatabaseConfig = () => {
  const connection = strapi.config.get('database.connection.connection', {});
  const value = (key, environmentKey, fallback = '') => String(
    connection[key] ?? process.env[environmentKey] ?? fallback,
  );
  return {
    host: value('host', 'DATABASE_HOST'),
    port: value('port', 'DATABASE_PORT', '5432'),
    database: value('database', 'DATABASE_NAME'),
    username: value('user', 'DATABASE_USERNAME'),
    password: value('password', 'DATABASE_PASSWORD'),
  };
};

const getUploadsDirectory = () => resolve(strapi.dirs.static.public, 'uploads');

const cleanupDirectory = async (directory) => {
  try {
    await rm(directory, { recursive: true, force: true });
  } catch (error) {
    strapi.log.error(`[backup-manager] temporary cleanup failed: ${error instanceof Error ? error.message : 'unknown error'}`);
  }
};

const runPgDump = (outputPath) => new Promise((resolveProcess, rejectProcess) => {
  const database = getDatabaseConfig();
  if (!database.host || !database.database || !database.username || !database.password) {
    rejectProcess(new Error('Database configuration is incomplete'));
    return;
  }

  const child = spawn('pg_dump', [
    '--format=custom',
    '--no-owner',
    '--no-privileges',
    `--file=${outputPath}`,
  ], {
    env: {
      ...process.env,
      PGHOST: database.host,
      PGPORT: database.port,
      PGDATABASE: database.database,
      PGUSER: database.username,
      PGPASSWORD: database.password,
    },
    stdio: ['ignore', 'ignore', 'pipe'],
  });

  let stderr = '';
  child.stderr?.on('data', (chunk) => { stderr += chunk.toString(); });
  child.once('error', rejectProcess);
  child.once('close', (code, signal) => {
    if (code === 0) {
      resolveProcess();
      return;
    }
    const diagnostic = stderr.trim().replace(/password\s*=\s*[^\s]+/gi, 'password=<redacted>');
    rejectProcess(new Error(`pg_dump exited with code ${code ?? 'unknown'}${signal ? ` (${signal})` : ''}: ${diagnostic.slice(0, 500)}`));
  });
});

const createArchive = async (archivePath, dumpPath, type, uploadsDirectory) => {
  const output = createWriteStream(archivePath, { flags: 'wx' });
  const archive = new TarArchive({ gzip: true, zlib: { level: 9 } });
  const finished = new Promise((resolveFinished, rejectFinished) => {
    output.once('close', resolveFinished);
    output.once('error', rejectFinished);
    archive.once('error', rejectFinished);
  });

  archive.pipe(output);
  if (dumpPath) archive.file(dumpPath, { name: 'database/database.dump' });
  if (type === 'full' || type === 'uploads') archive.directory(uploadsDirectory, 'uploads');
  archive.append(JSON.stringify({
    type,
    database: 'postgresql',
    createdAt: new Date().toISOString(),
    includesDatabase: type === 'database' || type === 'full',
    includesUploads: type === 'full' || type === 'uploads',
  }, null, 2), { name: 'metadata.json' });
  await archive.finalize();
  await finished;
};

const createBackup = async (type) => {
  if (backupInProgress) throw new Error('A backup is already being generated');
  backupInProgress = true;
  let tempDirectory = '';

  try {
    tempDirectory = await mkdtemp(join(tmpdir(), 'strapi-backup-'));
    const databaseDirectory = join(tempDirectory, 'database');
    await mkdir(databaseDirectory, { recursive: true });
    const dumpPath = join(databaseDirectory, 'database.dump');
    const uploadsDirectory = getUploadsDirectory();

    if (type === 'full' || type === 'uploads') {
      await access(uploadsDirectory);
      if (!(await stat(uploadsDirectory)).isDirectory()) throw new Error('Configured uploads path is not a directory');
    }

    if (type === 'database' || type === 'full') await runPgDump(dumpPath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `strapi-${type}-backup-${timestamp}.tar.gz`;
    const archivePath = join(tempDirectory, fileName);
    await createArchive(archivePath, dumpPath, type, uploadsDirectory);
    return { archivePath, tempDirectory, fileName };
  } catch (error) {
    if (tempDirectory) await cleanupDirectory(tempDirectory);
    throw error;
  } finally {
    backupInProgress = false;
  }
};

const download = async (ctx, type) => {
  try {
    const backup = await createBackup(type);
    const archiveSize = (await stat(backup.archivePath)).size;
    const stream = createReadStream(backup.archivePath);
    let cleaned = false;
    const cleanup = async () => {
      if (cleaned) return;
      cleaned = true;
      await cleanupDirectory(backup.tempDirectory);
    };

    stream.once('close', cleanup);
    stream.once('error', cleanup);
    ctx.req.once('aborted', cleanup);
    ctx.set('Content-Type', 'application/gzip');
    ctx.set('Content-Disposition', `attachment; filename="${backup.fileName}"`);
    ctx.set('Content-Length', String(archiveSize));
    ctx.set('Cache-Control', 'no-store');
    ctx.set('X-Content-Type-Options', 'nosniff');
    ctx.body = stream;
  } catch (error) {
    strapi.log.error(`[backup-manager] ${type} backup failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    ctx.status = 500;
    ctx.body = { error: { message: 'Unable to create the backup. Check the server logs for details.' } };
  }
};

module.exports = {
  register({ strapi: app }) {
    app.admin.services.permission.actionProvider.register({
      section: 'plugins',
      displayName: 'Download backups',
      uid: 'download',
      subCategory: 'backup-manager',
      pluginName: 'backup-manager',
    });
  },
  bootstrap() {},
  controllers: {
    backup: {
      downloadDatabase: (ctx) => download(ctx, 'database'),
      downloadFull: (ctx) => download(ctx, 'full'),
      downloadUploads: (ctx) => download(ctx, 'uploads'),
    },
  },
  routes: {
    admin: {
      type: 'admin',
      routes: [
        {
          method: 'GET',
          path: '/download/database',
          handler: 'backup.downloadDatabase',
          config: { policies: [permissionPolicy] },
        },
        {
          method: 'GET',
          path: '/download/full',
          handler: 'backup.downloadFull',
          config: { policies: [permissionPolicy] },
        },
        {
          method: 'GET',
          path: '/download/uploads',
          handler: 'backup.downloadUploads',
          config: { policies: [permissionPolicy] },
        },
      ],
    },
  },
  services: {
    backup: {
      createBackup,
      cleanup: cleanupDirectory,
    },
  },
};
