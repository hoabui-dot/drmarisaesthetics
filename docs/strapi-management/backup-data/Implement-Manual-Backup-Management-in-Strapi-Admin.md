# Task: Implement Manual Backup Management in Strapi Admin

You are working inside an existing **Strapi CMS codebase**.

The goal is to implement a small, production-ready **Backup Management** feature inside the Strapi Admin Panel with exactly two actions:

* **Download Database Backup**
* **Download Full Backup**

Current expected infrastructure:

* Strapi CMS
* PostgreSQL database
* Strapi default/local media storage
* Uploaded images/files expected under `public/uploads`
* Backup files must be downloaded directly to the administrator's physical device through the browser
* No S3/cloud backup
* No scheduled backup
* No backup history
* No restore UI
* No cron job

---

# 1. Mandatory Compatibility Audit — DO THIS FIRST

Before changing any code, inspect the existing codebase and verify that the proposed architecture is compatible.

You MUST inspect at minimum:

* Exact Strapi version
* Whether the project is Strapi 5
* Node.js version
* Package manager
* TypeScript or JavaScript setup
* Existing plugin architecture
* Existing local/custom plugins
* `config/plugins.*`
* `config/database.*`
* PostgreSQL connection configuration
* Whether `DATABASE_URL` or individual database environment variables are used
* Current upload provider configuration
* Verify whether uploads actually use local storage
* Verify whether media files exist under or resolve to `public/uploads`
* Dockerfile / container configuration if present
* Deployment configuration if present
* Whether `pg_dump` is available in the runtime environment
* PostgreSQL server version
* Installed PostgreSQL client / `pg_dump` version
* Existing Admin RBAC patterns
* Existing Strapi Admin API/client patterns
* Existing project conventions for controllers, services, routes, plugins, logging, and error handling

Also inspect whether the current Strapi Admin API supports authenticated binary/blob downloads using the proposed implementation.

## Compatibility Gate

After the audit, explicitly classify the implementation as:

```text
COMPATIBLE
```

or:

```text
NOT COMPATIBLE
```

### If NOT COMPATIBLE

STOP IMMEDIATELY.

Do not modify any code.

Do not partially implement the feature.

Provide a concise report containing:

* Exact incompatibility
* File/location where it was discovered
* Why the proposed architecture is unsafe or unsupported
* What would need to change before implementation can continue
* Recommended alternative architecture if applicable

Examples of blocking incompatibilities include:

* Project is not compatible with the intended Strapi plugin/admin architecture
* Database is not PostgreSQL
* Uploads are not stored locally and `public/uploads` is not the source of truth
* Production environment cannot execute `pg_dump`
* PostgreSQL client version cannot safely dump the current PostgreSQL server
* Deployment filesystem prevents temporary backup generation
* Current authentication/admin architecture makes the proposed download endpoint unsafe
* Required runtime dependencies cannot be installed

Do not work around a blocking incompatibility silently.

---

# 2. Proceed Only If Compatible

If the compatibility result is:

```text
COMPATIBLE
```

continue with the implementation.

The final architecture should be:

```text
Strapi Admin
│
└── Backup Management
    │
    ├── [ Download Database Backup ]
    │
    └── [ Download Full Backup ]
             │
             ▼
       Authenticated Admin Endpoint
             │
             ▼
         Backup Service
             │
       ┌─────┴─────────┐
       │               │
 PostgreSQL Dump    Local Uploads
     pg_dump        public/uploads
       │               │
       └──────┬────────┘
              ▼
       Temporary Archive
              │
              ▼
       backup-<timestamp>.tar.gz
              │
              ▼
       HTTP Attachment Stream
              │
              ▼
         Browser Download
              │
              ▼
      Administrator Device
              │
              ▼
       Delete Temporary Files
```

---

# 3. Scope

Implement only the following functionality.

## Database Backup

The administrator can click:

```text
Download Database Backup
```

The system must:

1. Authenticate and authorize the administrator.
2. Create a PostgreSQL database dump using `pg_dump`.
3. Store it only in a temporary server directory.
4. Package it into a `.tar.gz` archive.
5. Stream/download the archive to the browser.
6. Delete all temporary files after the response completes or fails.

Expected archive:

```text
strapi-database-backup-<timestamp>.tar.gz

├── database/
│   └── database.dump
│
└── metadata.json
```

---

## Full Backup

The administrator can click:

```text
Download Full Backup
```

The system must:

1. Authenticate and authorize the administrator.
2. Create the PostgreSQL dump.
3. Include the current local Strapi uploads directory.
4. Package both into one `.tar.gz`.
5. Stream/download it to the browser.
6. Delete temporary files afterward.

Expected archive:

```text
strapi-full-backup-<timestamp>.tar.gz

├── database/
│   └── database.dump
│
├── uploads/
│   ├── *.jpg
│   ├── *.png
│   ├── *.webp
│   ├── *.pdf
│   └── ...
│
└── metadata.json
```

---

# 4. Do Not Use JSON Export as Database Backup

The database backup MUST use PostgreSQL native backup tooling.

Use:

```bash
pg_dump
```

Prefer PostgreSQL custom dump format:

```bash
pg_dump \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file=<output-file>
```

Do NOT implement database backup by:

* Fetching Strapi entities
* Serializing collections to JSON
* Iterating over Content Types
* Using REST API exports
* Using Entity Service exports
* Creating an application-level pseudo-backup

The result must be a real PostgreSQL dump restorable with PostgreSQL tooling.

---

# 5. PostgreSQL Configuration

Do not hard-code database credentials.

Resolve PostgreSQL configuration from the existing project.

Support the project's actual connection pattern.

Possible sources include:

```text
DATABASE_URL
```

or:

```text
DATABASE_HOST
DATABASE_PORT
DATABASE_NAME
DATABASE_USERNAME
DATABASE_PASSWORD
```

Also inspect:

```text
config/database.ts
config/database.js
```

Use the existing configuration as the source of truth.

Never log:

* Database password
* DATABASE_URL credentials
* Secrets
* Tokens

Use `spawn` or an equivalent safe process execution API.

Do not build a shell command by concatenating untrusted strings.

---

# 6. pg_dump Runtime Validation

Before enabling the feature, verify:

```bash
pg_dump --version
```

Confirm that the installed `pg_dump` can safely dump the configured PostgreSQL server version.

If the runtime is Dockerized, inspect the Dockerfile.

Install the PostgreSQL client only if required and compatible with the existing base image.

Examples may include:

```dockerfile
RUN apt-get update \
    && apt-get install -y postgresql-client \
    && rm -rf /var/lib/apt/lists/*
```

or Alpine equivalent.

Do not change the base image unnecessarily.

Do not introduce an incompatible PostgreSQL client version.

---

# 7. Local Upload Validation

Before implementing Full Backup, confirm the actual upload provider.

The expected configuration is Strapi local storage.

Verify that:

```text
public/uploads
```

is the real source of uploaded media.

Do not assume this path merely because it is Strapi's default.

If the upload provider is S3, Cloudinary, Azure, GCS, or another external provider:

STOP.

Report the incompatibility instead of implementing an incomplete Full Backup.

---

# 8. Custom Plugin

Prefer implementing this feature as a local Strapi plugin, for example:

```text
src/plugins/backup-manager/
```

Follow existing codebase conventions first.

A likely structure is:

```text
src/plugins/backup-manager/
│
├── admin/
│   └── src/
│       ├── index.ts
│       ├── pluginId.ts
│       └── pages/
│           └── App.tsx
│
└── server/
    └── src/
        ├── index.ts
        ├── bootstrap.ts
        ├── routes/
        │   ├── index.ts
        │   └── admin.ts
        ├── controllers/
        │   ├── index.ts
        │   └── backup.ts
        └── services/
            ├── index.ts
            └── backup.ts
```

Do not force this exact structure if the current codebase uses a different valid Strapi convention.

Follow the repository first.

---

# 9. Admin UI

Add a page to Strapi Admin:

```text
Backup Management
```

The page should remain simple.

Required UI:

```text
Backup Management

Create and download a backup of the current Strapi CMS.

--------------------------------------------------

Database Backup

Includes:
- PostgreSQL database

[ Download Database Backup ]

--------------------------------------------------

Full Backup

Includes:
- PostgreSQL database
- Locally uploaded images and files

[ Download Full Backup ]
```

Required behavior:

* Show loading state while backup is generated.
* Prevent duplicate clicks while a backup is running.
* Show a meaningful error message on failure.
* Trigger browser download automatically when successful.
* Do not expose server filesystem paths.
* Do not show database credentials.
* Do not add unnecessary configuration UI.

Use the existing Strapi Design System and existing project UI conventions.

---

# 10. Admin Authentication and RBAC

The download endpoints MUST be Admin-only.

Do not expose them as unrestricted Content API endpoints.

Create a dedicated permission such as:

```text
plugin::backup-manager.download
```

Register it through the appropriate Strapi Admin permission mechanism supported by the installed Strapi version.

The page and backend endpoint must both enforce authorization.

Preferred behavior:

```text
Super Admin
    ✓ Download backups

Other roles
    configurable through Admin RBAC
```

Backend authorization is mandatory even if the UI hides the button.

---

# 11. Download Endpoint

Use the endpoint style best supported by the installed Strapi version.

Preferred if compatible:

```http
GET /backup-manager/download/database
GET /backup-manager/download/full
```

The response must use attachment headers.

Example:

```http
Content-Type: application/gzip
Content-Disposition: attachment; filename="strapi-full-backup-<timestamp>.tar.gz"
Cache-Control: no-store
X-Content-Type-Options: nosniff
```

Use binary/blob handling supported by the installed Strapi Admin fetch client.

Do not blindly use `POST` if the current Admin HTTP client attempts to JSON-parse the binary response.

Verify this behavior from the installed Strapi version before implementation.

---

# 12. Temporary Files

Use the operating system's temporary directory or another existing safe temporary location.

For example:

```text
/tmp/strapi-backup-<random>/
```

Do not write backup archives permanently into:

```text
public/
public/uploads/
src/
config/
repository root
```

The temporary structure may be:

```text
/tmp/strapi-backup-abc123/

├── database.dump
└── strapi-full-backup-<timestamp>.tar.gz
```

All temporary data must be removed:

* After successful download
* After stream close
* After stream failure
* After `pg_dump` failure
* After archive failure

Use defensive cleanup with `finally` or equivalent lifecycle handling.

---

# 13. Archive Generation

Use a streaming archive library compatible with the existing project.

For example:

```text
archiver
```

Do not load the entire uploads directory or database dump into memory.

Prefer filesystem streams.

The Full Backup archive should include:

```text
database/database.dump
uploads/**
metadata.json
```

Example `metadata.json`:

```json
{
  "type": "full",
  "database": "postgresql",
  "createdAt": "<ISO timestamp>",
  "includesUploads": true
}
```

Database backup:

```json
{
  "type": "database",
  "database": "postgresql",
  "createdAt": "<ISO timestamp>",
  "includesUploads": false
}
```

Do not include secrets or environment variables in metadata.

---

# 14. Memory and Large File Safety

Do not implement large downloads by reading the final archive fully into Node.js memory.

Avoid patterns such as:

```ts
await fs.readFile(archivePath)
```

for the download response.

Use:

```text
filesystem stream
        ↓
HTTP response
```

where supported.

If the Strapi Admin client's blob API requires buffering the complete response in the browser, that is acceptable for the client side, but the server must still stream from disk.

Document any practical browser limitation discovered during testing.

---

# 15. Concurrency Protection

Prevent multiple expensive `pg_dump` operations from being started repeatedly by the same UI action.

At minimum:

* Disable both buttons while the current request is active.

Also evaluate whether a lightweight backend concurrency guard is appropriate.

Do not introduce Redis, queues, workers, or distributed locks unless the existing architecture already requires them.

Keep the feature simple.

---

# 16. Error Handling

Handle at least:

* `pg_dump` command not found
* PostgreSQL connection failure
* Authentication failure
* Authorization failure
* Upload directory missing
* Permission denied reading uploads
* Permission denied writing temporary directory
* Disk full
* Archive creation failure
* Client disconnect
* Stream failure
* Cleanup failure

Do not leak sensitive PostgreSQL stderr directly into the Admin UI.

Log useful server-side diagnostics through the existing Strapi logger.

User-facing errors should be concise, for example:

```text
Unable to create the database backup. Check the server logs for details.
```

---

# 17. No Additional Features

Do NOT implement:

* Restore
* Backup history
* Scheduled backups
* Cron
* AWS S3
* Azure
* Google Cloud Storage
* Cloudinary backup
* Backup retention policies
* Backup database tables
* Background workers
* Job queues
* Email notifications
* Backup encryption unless already required by the codebase
* Existing `strapi-plugin-backup` integration unless there is a strong codebase-specific reason

The goal is intentionally limited to:

```text
Admin clicks button
        ↓
Generate backup
        ↓
Download file
        ↓
Delete temp data
```

---

# 18. Existing Backup Plugins

Inspect whether the repository already uses:

```text
strapi-plugin-backup
```

or another backup implementation.

If present, determine whether reusable public APIs exist.

Do NOT import undocumented internal package paths such as:

```text
strapi-plugin-backup/internal/*
```

unless repository evidence demonstrates that this dependency is intentionally pinned and maintained this way.

Prefer independent project-owned backup logic for this manual download feature.

Do not duplicate existing safe reusable code unnecessarily.

---

# 19. Tests

Implement or perform tests covering at minimum:

## Compatibility

* Strapi starts successfully.
* Plugin loads.
* Admin page loads.
* Permission appears in Admin RBAC.

## Database Backup

* Authorized admin can download backup.
* File is non-empty.
* Archive opens successfully.
* `database/database.dump` exists.
* Dump is recognized by `pg_restore`.
* Temporary files disappear afterward.

Test with:

```bash
pg_restore --list database.dump
```

## Full Backup

* Database dump exists.
* Uploads folder exists inside archive.
* Existing known media file appears in archive.
* Archive is valid.
* Temporary files disappear afterward.

## Authorization

* Unauthorized request returns authentication error.
* Admin without required permission cannot download.
* Authorized admin can download.

## Failure

Temporarily simulate:

* Invalid PostgreSQL credentials
* Missing `pg_dump`
* Missing uploads directory

Verify:

* Request fails cleanly.
* UI shows error.
* No sensitive credentials leak.
* Temporary files are cleaned.

---

# 20. Validate Backup Integrity

A successful HTTP 200 alone is NOT enough.

Extract one generated database backup and verify:

```bash
pg_restore --list database.dump
```

For the full archive, inspect:

```text
database/database.dump
uploads/
metadata.json
```

Cross-check several existing Strapi Media Library files against files in the backup.

Do not claim completion before integrity verification succeeds.

---

# 21. Build and Regression Check

After implementation run the existing project's appropriate commands, such as:

```bash
npm run build
```

or:

```bash
yarn build
```

or:

```bash
pnpm build
```

Also run existing:

* TypeScript checks
* Lint
* Unit tests
* Integration tests

Do not introduce unrelated fixes.

Verify existing Strapi functionality remains unaffected:

* Content Manager
* Media Library
* Authentication
* Existing plugins
* Existing API endpoints
* Admin build

---

# 22. Final Report

When finished, provide a concise implementation report containing:

## Compatibility Audit

```text
Status: COMPATIBLE
```

and the evidence supporting the decision.

## Files Changed

List every created/modified file.

## Architecture Implemented

Confirm:

```text
Strapi Admin
    ↓
Backup Management
    ↓
Authenticated Admin Endpoint
    ↓
pg_dump
    +
public/uploads when full backup
    ↓
tar.gz
    ↓
browser download
    ↓
temporary cleanup
```

## Database Backup

Confirm:

* PostgreSQL native dump used
* Dump format
* Archive format
* `pg_restore --list` validation result

## Full Backup

Confirm:

* Local uploads included
* Actual uploads path used
* Existing media file verified inside backup

## Security

Confirm:

* Admin-only route
* RBAC enforced
* No credentials exposed
* No public backup endpoint

## Runtime

Report:

```text
PostgreSQL server version:
pg_dump version:
Node.js version:
Strapi version:
Upload provider:
Upload path:
```

## Testing

List commands executed and their outcomes.

## Remaining Risks

Report only real remaining risks discovered from the repository.

Do not invent hypothetical blockers.

---

# Acceptance Criteria

The task is complete only when all applicable items below are true:

* [ ] Codebase was audited before implementation.
* [ ] Compatibility was explicitly confirmed.
* [ ] Implementation stopped if incompatible.
* [ ] PostgreSQL is backed up using `pg_dump`.
* [ ] Database backup can be downloaded from Strapi Admin.
* [ ] Full database + local uploads backup can be downloaded.
* [ ] Full backup uses the actual configured local upload directory.
* [ ] Backup endpoints require Strapi Admin authentication.
* [ ] RBAC permission is enforced server-side.
* [ ] Backup archive is streamed/downloaded as an attachment.
* [ ] Temporary files are removed after completion/failure.
* [ ] Database dump is validated with `pg_restore --list`.
* [ ] Full archive contents are inspected.
* [ ] Existing Strapi Admin still builds successfully.
* [ ] No unrelated backup features were introduced.
* [ ] No sensitive information is exposed.
