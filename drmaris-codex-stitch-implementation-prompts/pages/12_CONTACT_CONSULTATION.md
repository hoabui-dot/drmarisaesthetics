# Page Phase — Contact & Consultation


> Target repository: `https://github.com/hoabui-dot/drmarisaesthetics`
>
> Primary design source: Stitch MCP project `11858440040360110865` — **Remix of Dr. Maris Aesthetic Digital System**
>
> Figma mirror for visual verification only: `zEjuuaNerFPeaJHsWlXmyo`
>
> Do not implement from memory. Retrieve the exact Stitch screen named in this prompt before coding.


**Stitch screen ID:** `72a83ef98fc1400caafa5a899f93e124`
**Figma mirror frame:** `2:2`
**Expected route:** `/contact`

## Goal

Match the premium editorial Contact/Consultation design while preserving the real consultation workflow.

## Required work

1. Inspect the current contact page, API route/server action, validation schema, reCAPTCHA, email transport, rate-limit/spam controls, analytics, and success/error UI.
2. Retrieve exact Stitch layout including:
   - editorial hero;
   - consultation form;
   - contact information;
   - 3-step consultation/process section;
   - FAQ;
   - shared shell.
3. Restyle/refactor the existing functional form rather than replacing it with a fake design-only form.
4. Keep server-side validation as authoritative; client validation is additive.
5. Never log medical case descriptions or personal contact data unnecessarily.
6. Ensure fields have real `<label>` relationships, errors, required state, autocomplete, keyboard order, focus styles, and accessible success/error announcements.
7. Source phone/email/address/hours from authoritative settings/CMS.
8. Protect secrets such as SMTP/reCAPTCHA server keys.
9. If Stitch adds fields the backend does not accept, update the end-to-end schema and submission handler deliberately; do not silently discard them.

## Acceptance

Perform a safe local/test submission when configuration permits and verify:
- validation;
- bot protection;
- server response;
- success and failure state;
- mobile form;
- no secret/PII leakage;
- visual fidelity to Stitch.
