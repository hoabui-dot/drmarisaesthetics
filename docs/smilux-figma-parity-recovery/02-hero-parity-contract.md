# 02 — Homepage Hero Strict Parity Contract

## Target visible inventory

This contract is based on the supplied Figma Hero reference. Missing photography may temporarily be classified as `BLOCKED_MEDIA`; all text and interactions are required.

### Header visible with Hero

- Logo: Smilux
- Nav: `HOME`, `ABOUT US`, `SERVICES`, `TECHNOLOGY`, `PRICING`, `BLOG`, `CONTACT`
- Header CTA: `BOOK APPOINTMENT`
- Header CTA action: open existing booking flow

### Hero copy

Eyebrow:

`PREMIUM DENTAL CARE & SERVICES`

H1:

`Your Smile, Our Passion`

Supporting paragraph:

`At Smilux Dental, we combine advanced technology, experienced professionals, and a patient-first approach to deliver safe, lasting, and beautiful smiles for you and your loved ones.`

### CTA group

Primary:

- label: `BOOK APPOINTMENT`
- action type: `booking-modal`
- must reuse the existing booking flow

Secondary:

- label: `WATCH VIDEO`
- action type: `video-dialog`
- video source/config must be resolved from repo/CMS/product data
- if no source exists, this is `BLOCKED_FUNCTIONAL`; the implementation may not silently remove the CTA or rename it to `Learn more`

### Trust proof

Visible target:

- patient/avatar group — may be `BLOCKED_MEDIA` temporarily
- label: `Trusted by 10,000+ Patients`
- star representation: 5 stars
- rating label: `4.9/5`

Recommended data model:

```ts
interface HeroTrustProof {
  label: string
  rating: number
  ratingLabel: string
  avatars: Media[]
}
```

If retaining the current flat schema, add at minimum a numeric `trust_rating` field instead of parsing display text to determine the stars.

## Existing schema compatibility

Current Hero schema already supports:

- eyebrow
- heading
- subheading
- primary CTA label/link
- secondary CTA label/link
- trust label/value
- avatars

Therefore most missing Hero content is not caused by an inability of Strapi to store it. It is caused by migration/population and frontend fallback/action behavior.

## Required frontend changes

Current Hero implementation must be corrected so that:

- eyebrow consumes canonical CMS value and does not hide missing migration data with generic text;
- H1 consumes canonical migrated value;
- paragraph consumes canonical migrated value;
- primary CTA uses exact Figma label and existing booking action;
- secondary CTA is based on an explicit action type and can open a video dialog;
- trust label and rating label consume CMS data;
- stars are derived from the numeric rating/presentation rule;
- avatars render from CMS when available;
- missing media does not remove the rest of the trust row;
- missing required content fails parity validation rather than disappearing.

## Required migration behavior

Do not preserve the old Hero copy merely because a `homepage.hero` block already exists.

Migration must PATCH/WRITE the canonical target fields while preserving only compatible media/IDs that are not being replaced.

Conceptually:

```js
hero.eyebrow = TARGET.hero.eyebrow
hero.heading = TARGET.hero.heading
hero.subheading = TARGET.hero.subheading
hero.cta_label = TARGET.hero.primary.label
hero.secondary_cta_label = TARGET.hero.secondary.label
hero.trust_label = TARGET.hero.trust.label
hero.trust_value = TARGET.hero.trust.ratingLabel
hero.trust_rating = TARGET.hero.trust.rating
```

Action semantics should be migrated/configured independently from visual labels.

## Hero release gate

Hero is not complete until a parity report says:

```text
required_text: 3/3
required_ctas: 2/2
required_actions_resolved: 2/2 OR explicit functional blocker
trust_text: 2/2
rating_visual: PASS
header_nav_labels: 7/7
header_booking_action: PASS
media: PASS or BLOCKED_MEDIA
```
