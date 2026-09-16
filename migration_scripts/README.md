# CMS migrations and data safety

## Runtime policy

Strapi startup, `npm run build`, Docker image build, and Docker container recreation must not seed, replace, publish, or delete editor-managed content. The current Strapi bootstrap in `strapi-cms/src/index.ts` only creates a missing plugin infrastructure table and adds missing public read permissions. It does not call scripts in this directory.

Legacy seed entry points and the old seed-named one-off scripts have been removed from the working tree. They contained stale dental content and/or could replace current CMS pages. Root `npm run seed*` shortcuts have also been removed. Their history remains recoverable from version control if a specific data migration ever needs review.

## Migration policy

Files in this directory are external, one-off operational scripts. They are not imported by Strapi and are never run by Docker. Review the exact script and its target data before running it. Prefer a read-only preview, explicit `--write` confirmation, and a verified database backup. Do not rerun historical scripts simply because the application is being rebuilt.

Remaining files are explicitly reviewed, non-seed migrations. They are still manual and can write data if invoked; never run them as part of routine deployment or initialization.

## Safe routine deployment

From the repository root, rebuild/recreate only the application service:

```bash
docker compose build drmaris-strapi
docker compose up -d drmaris-strapi
```

This reuses the external Docker volumes configured in `docker-compose.yml`:

- `dental-postgres-data` — PostgreSQL content and Strapi records
- `dental-strapi-uploads` — uploaded media
- `dental-strapi-cache` — disposable Strapi cache

Do not remove the PostgreSQL or uploads volumes during deployment. Avoid `docker compose down -v`, `docker volume rm`, database resets, broad `TRUNCATE`/`DROP`, and blanket Docker prune commands for routine troubleshooting.

## Automatic Strapi database migrations

Strapi runs files in `strapi-cms/database/migrations` once and records completed migrations in `strapi_migrations`. The active database has recorded the repository migrations through `2026.09.13.000001_remove_obsolete_service_metadata.js`; routine restart/rebuild will not rerun those completed migrations. Before adding a new automatic migration, review every `DROP`, `DELETE`, `TRUNCATE`, and column removal, and make sure it is data-preserving or explicitly intended and backed up.

Content changes belong in Content Manager or a separately reviewed external migration—not in Strapi bootstrap or Docker startup.
