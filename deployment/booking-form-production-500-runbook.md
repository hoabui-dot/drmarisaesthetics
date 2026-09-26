# Production Runbook: Booking Form Returns HTTP 500

**Status:** Open — investigate and fix on production before closing this issue.  
**Environment:** `https://drmarisaesthetics.com`  
**Last recorded:** 22 September 2026 (UTC)

## Reported production symptom

When submitting the booking form, the browser reports:

```text
GET https://maps.googleapis.com/maps/api/mapsjs/gen_204?csp_test=true
net::ERR_BLOCKED_BY_CLIENT

[Booking] reCAPTCHA token received
{ available: true, production: true, attempt: 1 }

POST https://drmarisaesthetics.com/api/contact
500 (Internal Server Error)

[Booking] submission rejected
{ status: 500,
  error: 'Failed to save your submission. Please try again or call us directly.',
  attempt: 1 }
```

The maps `gen_204` request is a Google Maps CSP/connectivity probe. `ERR_BLOCKED_BY_CLIENT` commonly means a browser extension or client-side blocker stopped it; it is not, by itself, evidence that the booking API failed because of Maps.

The reCAPTCHA message confirms that the browser obtained a token, **not** that the server verified it successfully. In the current Next.js contact handler, an explicit reCAPTCHA rejection returns HTTP `400`. The reported `500` and “Failed to save your submission” message point to the subsequent persistence path, but production logs and the upstream response must confirm the exact cause.

## Current request and persistence path

```text
Booking UI
  → POST /api/contact (Next.js)
  → validate request / optional server-side reCAPTCHA verification
  → POST http://strapi:22345/api/booking-submissions (Strapi, bearer token)
  → booking-submission controller / database
  → return success; send email notification asynchronously
```

In `dental-frontend/src/app/api/contact/route.ts`, the exact “Failed to save your submission” response is returned when the Strapi `POST /api/booking-submissions` response is not successful. The handler logs `[Contact API] strapi-save-failed` with upstream status and error message. Missing `STRAPI_API_TOKEN` also returns `500`, while network/JSON exceptions are handled by the outer `request-failed` catch and return a different generic message.

## Production investigation checklist

Run checks from `/home/neurosus/drmaris/deployment` on the production VPS. Do not print or paste `.env`/env-file values, bearer tokens, CAPTCHA secrets, personal booking data, or full request bodies into tickets or chat.

### 1. Confirm which release is actually running

```sh
docker compose ps
docker compose images
docker inspect drmaris-prod-frontend --format '{{.Image}} {{.Config.Image}}'
docker inspect drmaris-prod-strapi --format '{{.Image}} {{.Config.Image}}'
```

Compare the running image IDs and configured tags with `deployment/docker-compose.yml` and the intended Docker Hub manifests. The current Compose release tag is `20260922-recaptcha-bypass-v1` for both `drmaris_aesthetics_frontend` and `drmaris_aesthetics_cms`; a matching tag alone does not prove the container was recreated from its latest digest.

The browser log says a reCAPTCHA token was obtained even though the intended bypass configuration is off. Verify the **active frontend bundle/image** and the runtime `RECAPTCHA_ENABLED` setting without dumping secret values. `NEXT_PUBLIC_RECAPTCHA_ENABLED` is a build-time Next.js setting; changing only the runtime env or restarting an old image does not rebuild the client bundle. Confirm the shipped client behavior is consistent with the intended flag. Do not weaken or bypass server-side protections beyond the existing explicit environment flag.

### 2. Correlate one controlled submission with logs

Use a designated internal/test contact and a unique timestamped test marker if a production submission is necessary. Avoid submitting fabricated patient details. Record the UTC time and inspect only a short window around that request:

```sh
docker compose logs --since=10m --timestamps frontend
docker compose logs --since=10m --timestamps strapi
docker compose logs --since=10m --timestamps postgres
```

Look for these signals:

- Frontend: `[Contact API] validation-passed`, `recaptcha-disabled`, `recaptcha-rejected`, `strapi-save-failed`, `strapi-save-succeeded`, or `request-failed`.
- Strapi: request to `/api/booking-submissions`, authorization/policy denial, validation or lifecycle error, database/constraint error, and the associated request timestamp.
- PostgreSQL: connection errors, missing relation/column, constraint violation, permissions issue, or storage exhaustion.

Interpretation:

| Evidence | Likely layer to investigate |
| --- | --- |
| `recaptcha-rejected` and HTTP 400 | Server-side CAPTCHA verification, keys, hostname/action/score, or active flag mismatch |
| `strapi-save-failed` with upstream 401/403 | `STRAPI_API_TOKEN`, token validity, or required Strapi permission/policy |
| `strapi-save-failed` with upstream 400 | Payload/schema validation, required fields, enum values, or controller validation |
| `strapi-save-failed` with upstream 5xx | Strapi controller/service, lifecycle hook, database, or downstream dependency |
| `request-failed` / connection error | Frontend-to-Strapi URL/network/Docker DNS, response handling, or timeout |
| `strapi-save-succeeded` but UI reports failure | Client response parsing/state handling, proxy/cache behavior, or a different request attempt |

### 3. Verify endpoint and credentials without exposing secrets

Check that the frontend container has non-empty `STRAPI_URL` and `STRAPI_API_TOKEN`, and Strapi is reachable at the configured internal Docker address. Report only whether each value is present; never print the token. Confirm Strapi's booking-submission create permission is granted to the token's API token role, or that the custom endpoint uses the intended authentication mechanism.

Review the deployed Strapi implementation and schema for `api::booking-submission.booking-submission`, including `src/api/booking-submission/controllers/booking-submission.ts`, its routes, content-type schema, validation, lifecycle hooks, and database migrations. Do not make the content public or remove authentication as a quick fix.

If a controlled failure must be reproduced with `curl`, use shell variables sourced securely on the VPS, avoid shell tracing (`set -x`), and do not place a live bearer token or personal data in shared command history/logs. Prefer a sanitized server-side test or approved diagnostic procedure.

### 4. Fix the confirmed cause only

Examples of targeted fixes, depending on evidence:

- Rotate/update an invalid Strapi API token through the approved secret-management process and ensure the required create permission is granted.
- Correct a frontend-to-Strapi URL or Docker service/network setting if the request cannot reach Strapi.
- Correct the payload/controller/schema mismatch or apply the required backward-compatible database migration if Strapi rejects the body.
- Fix the Strapi controller/service/lifecycle/database error shown in logs.
- If reCAPTCHA is still active contrary to the configured flag, correct the production build/runtime configuration, rebuild and publish the frontend image, then recreate the frontend container. Do not treat the presence of a token in browser logs as proof that CAPTCHA caused this 500.

Keep the user-facing error generic. Do not expose raw Strapi validation details, stack traces, tokens, or database messages to public clients. Improve server logs only as needed to identify upstream status and a safe, non-sensitive error code.

## Deploying an approved code/image fix

Build and push from the source workspace, not on the production VPS. Use the approved unique release tag; update the image reference in the production Compose file and transfer the matching Compose file to the server. If deliberately reusing the current tag, confirm the remote digest changed and force-pull/recreate the relevant service so the server does not retain the old image.

On the VPS, after confirming the target tag and env file:

```sh
cd /home/neurosus/drmaris/deployment
docker compose config --quiet
docker compose pull frontend strapi
docker compose up -d --no-deps --force-recreate frontend strapi
docker compose ps
```

Recreate only the service(s) changed by the fix; do not restart PostgreSQL unless the verified fix requires it. Never run `docker compose down -v` or delete production volumes as part of this issue.

If only one service image changed, pull/recreate only that service. For frontend-only changes, a Strapi restart is not normally needed; for Strapi-only changes, a frontend restart is not normally needed unless its runtime env changed.

## Acceptance checks

1. Submit one approved controlled booking through the actual production UI.
2. Confirm the browser receives HTTP `200` from `/api/contact` and the UI shows success (including modal close behavior where applicable).
3. Confirm exactly one corresponding booking record was created in Strapi and is visible to authorized Admin users.
4. Confirm notification email behavior separately; email is sent asynchronously and should not turn a successfully persisted submission into a failed UI response.
5. Confirm logs show `strapi-save-succeeded` and no matching `strapi-save-failed` or unexpected reCAPTCHA rejection.
6. Repeat the same test on the contact-page form and booking modal if both are in scope.
7. Record deployed image tags and digests, test time (UTC), and outcome. Remove any test record only through an authorized, audited procedure if cleanup is required.

## Rollback

If the fix causes regressions, restore the previous known-good image tag(s) in Compose, then pull and force-recreate only the affected service(s). Preserve PostgreSQL and uploads volumes. Re-run the acceptance checks and record the rollback digest.

## Related implementation

- Next.js handler: `dental-frontend/src/app/api/contact/route.ts`
- Booking submission API: `strapi-cms/src/api/booking-submission/`
- Production Compose: `deployment/docker-compose.yml`
- Frontend production env: `deployment/drmaris-env/drmaris.production.frontend.env`
- Strapi production env: `deployment/drmaris-env/drmaris.production.strapi.env`
