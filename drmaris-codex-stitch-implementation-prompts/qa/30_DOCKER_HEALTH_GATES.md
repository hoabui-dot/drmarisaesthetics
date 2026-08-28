# QA Phase — Docker Build and Health Gates

Do not assume the package.json Docker scripts point to the active Compose file. Discover the actual setup first.

## Safety

Never run:
- `docker compose down -v`
- volume prune/delete
- database reset
- destructive seed

unless the user explicitly authorizes destructive local data removal.

## Procedure

1. Identify the canonical Compose file(s), profiles, env files, service names, ports, dependencies, and volumes.
2. Validate configuration:
   - `docker compose ... config`
3. Build safely:
   - `docker compose ... build`
   - or the repository's documented equivalent.
4. Start:
   - `docker compose ... up -d`
5. Inspect:
   - `docker compose ... ps`
   - service health status;
   - recent logs for frontend, Strapi, PostgreSQL, proxy if any.
6. Probe actual endpoints with `curl`/HTTP:
   - frontend home;
   - each redesigned route;
   - Strapi health/API endpoint supported by this project;
   - any proxy endpoint required in the architecture.
7. Verify frontend can actually fetch Strapi data from inside its runtime/container context.
8. Restart once if useful and verify services recover cleanly.

## Gate

PASS only when required services are running/healthy and redesigned routes respond successfully without fatal runtime errors.

If a healthcheck does not exist, do not pretend it does. Use service state + explicit HTTP/DB checks and recommend adding a minimal healthcheck if appropriate.
