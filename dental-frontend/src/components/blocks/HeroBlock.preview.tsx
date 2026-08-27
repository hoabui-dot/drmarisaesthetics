import type { HomepageHeroBlock } from '@/src/types/strapi'
import { HeroBlock } from './HeroBlock'

/** Desktop comparison target from hero-section.md: 1034 × 666 px. */
export const heroPreviewViewport = '1034 × 666 px'

export function HeroBlockPreview({ data }: { data: HomepageHeroBlock }) {
  return <HeroBlock data={data} />
}
