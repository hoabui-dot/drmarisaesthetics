import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname, '..')
const target = JSON.parse(await readFile(resolve(root, 'docs/design-spec/contracts/homepage.target.json'), 'utf8'))
const baseUrl = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const token = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
const headers = token ? { Authorization: `Bearer ${token}` } : {}
const failures = []

function check(condition, message) { if (!condition) failures.push(message) }
function labels(items = []) { return items.map((item) => item.label) }

let homepage
let navigation
try {
  homepage = await fetch(`${baseUrl}/api/homepage?populate[layout][populate]=*`, { headers }).then((response) => response.json())
  navigation = await fetch(`${baseUrl}/api/navigation?populate[navigation][populate]=*`, { headers }).then((response) => response.json())
} catch (error) {
  failures.push(`API unavailable: ${error.message}`)
}

const hero = homepage?.data?.layout?.find((block) => block.__component === 'homepage.hero')
const actualNav = navigation?.data?.navigation || []
check(hero?.eyebrow === target.hero.eyebrow, `Hero eyebrow mismatch: ${hero?.eyebrow}`)
check(hero?.heading === target.hero.heading, `Hero heading mismatch: ${hero?.heading}`)
check(hero?.subheading === target.hero.subheading, 'Hero supporting paragraph mismatch')
check(hero?.cta_label === target.hero.primaryAction.label, `Primary CTA mismatch: ${hero?.cta_label}`)
check(hero?.secondary_cta_label === target.hero.secondaryAction.label, `Secondary CTA mismatch: ${hero?.secondary_cta_label}`)
check(hero?.secondary_cta_action === target.hero.secondaryAction.type, `Secondary action mismatch: ${hero?.secondary_cta_action}`)
check(hero?.secondary_cta_video_url, 'Secondary video source is unresolved')
check(hero?.trust_label === target.hero.trust.label, `Trust label mismatch: ${hero?.trust_label}`)
check(hero?.trust_value === target.hero.trust.ratingLabel, `Trust rating label mismatch: ${hero?.trust_value}`)
check(Number(hero?.trust_rating) === target.hero.trust.rating, `Trust numeric rating mismatch: ${hero?.trust_rating}`)
check(JSON.stringify(labels(actualNav)) === JSON.stringify(target.header.nav.map((item) => item.label)), `Header nav mismatch: ${labels(actualNav).join(' | ')}`)
check(navigation?.data?.ctaText === target.header.cta.label, `Header CTA mismatch: ${navigation?.data?.ctaText}`)

if (failures.length) {
  console.error('FIGMA PARITY: FAIL')
  console.error(failures.map((failure) => `- ${failure}`).join('\n'))
  process.exit(1)
}
console.log('FIGMA PARITY: PASS (Header + Hero content/action/API checks)')
