import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const required = [
  'docs/design-spec/pages/01-home.md',
  'docs/design-spec/design-system/01-theme-colors.md',
  'docs/design-spec/design-system/02-typography.md',
  'docs/design-spec/design-system/06-responsive.md',
  'docs/design-spec/design-system/08-accessibility.md',
  'docs/hompage-migration-codex/references/figma-home.md',
  'docs/hompage-migration-codex/references/theme.md',
  'docs/hompage-migration-codex/references/typography.md',
  'docs/hompage-migration-codex/references/responsive.md',
  'docs/hompage-migration-codex/09-testing-acceptance.md',
]
const failures = required.filter((file) => !existsSync(resolve(root, file)))
const home = readFileSync(resolve(root, 'docs/design-spec/pages/01-home.md'), 'utf8')
const prompt = readFileSync(resolve(root, 'docs/hompage-migration-codex/CODEX_START_PROMPT.md'), 'utf8')
if (!home.startsWith('# Page Spec — Home')) failures.push('pages/01-home.md must start with # Page Spec — Home')
if (prompt.includes('reference/')) failures.push('CODEX_START_PROMPT.md contains a broken reference/ path')
if (!prompt.includes('design-system/')) failures.push('CODEX_START_PROMPT.md must require the global design system')
if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'))
  process.exit(1)
}
console.log(`Design documentation integrity passed (${required.length} files checked)`)
