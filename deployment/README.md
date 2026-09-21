# DR. MARIS production deployment

This stack has a unique Compose project name (`drmaris-production`) and references unique env files directly in `docker-compose.yml`:

- `drmaris-env/drmaris.production.postgres.env`
- `drmaris-env/drmaris.production.strapi.env`
- `drmaris-env/drmaris.production.frontend.env`

It does not use a default `.env` file or require `docker compose --env-file`. It runs prebuilt images only:

- `vanhoadotbui2628/drmaris_aesthetics_cms:20260921-release-v1`
- `vanhoadotbui2628/drmaris_aesthetics_frontend:20260921-release-v1`

The frontend tag is the production-specific image already built and pushed to Docker Hub. Production servers should pull it, not build it.

## Prepare production values

Replace all `CHANGE_ME` values in the three env files using the production secret store/current production values. Keep the database password identical in the PostgreSQL and Strapi env files. Do not commit or share these files.

## Production server commands

Copy the whole `deployment` directory to `/home/neurosus/drmaris/deployment`, then run these commands from that directory:

- `docker login`
- `docker compose config --quiet`
- `docker compose pull`
- `docker compose up -d`
- `docker compose ps`

Compose uses the existing named data volumes `dental-postgres-data` and `dental-strapi-uploads` to avoid silently creating an empty database/uploads set. The Strapi cache volume is safe to create automatically and is not external. Do not run `docker compose down -v`.

Do not run this stack at the same time as another stack mounting these volumes. Stop the current owner cleanly before cutover; PostgreSQL data volumes must never be mounted by two database containers concurrently.

Ports are fixed to `2234` (Next.js) and `22345` (Strapi). Configure the reverse proxy to direct the public frontend to port `2234` and `/admin` plus Strapi API paths to port `22345` according to the current proxy design.

## Build and publish from the source workspace

The images are built and published under the dedicated DR. MARIS repositories. For future builds, use unique release tags and push both the CMS and frontend repositories to Docker Hub. Do not build on production.

## Verification

After startup, check `https://drmarisaesthetics.com/`, `https://drmarisaesthetics.com/admin`, and `docker compose logs --tail=100 frontend` / `strapi`.
