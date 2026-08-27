import type { Page, HomepageBlock } from '@/src/types/strapi'
import dynamic from 'next/dynamic'
import { EmptyState } from './EmptyState'

/**
 * Block Renderer Component
 * 
 * This is the core component that renders the block-based layout system.
 * It takes an array of blocks from Strapi CMS and renders the appropriate
 * component for each block type.
 * 
 * Performance strategy:
 * - Above-fold blocks (video-hero, hero) are loaded eagerly for fast LCP.
 * - Below-fold blocks are lazy-loaded via next/dynamic to reduce initial JS bundle
 *   and main-thread blocking on hydration, improving mobile load performance.
 * 
 * How it works:
 * 1. Receives layout array from CMS
 * 2. Maps over each block
 * 3. Switches on blockType
 * 4. Renders corresponding component
 * 5. Handles unknown blocks gracefully
 * 
 * Adding new blocks:
 * 1. Create new block component in /components/blocks/
 * 2. Import it here
 * 3. Add case to switch statement
 */

import { SectionSkeleton } from './skeletons/SectionSkeleton'

// ── Above-fold: eager imports (critical for LCP) ──────────────────────────────
import { HeroBlock } from './blocks/HeroBlock'
import { ServicesBlock } from './blocks/ServicesBlock'
import { DoctorSection } from './blocks/DoctorSection'
import { CertificationSection } from './blocks/CertificationSection'
import { ResultsSection } from './blocks/ResultsSection'
import { TestimonialsSection } from './blocks/TestimonialsSection'
import { PressSection } from './blocks/PressSection'
import { ArticlesSection } from './blocks/ArticlesSection'

// ── Below-fold: lazy imports (deferred to reduce main-thread blocking) ─────────
const HomeProofSection = dynamic(() => import('./blocks/HomeProofSection').then(m => ({ default: m.HomeProofSection })), { loading: () => <SectionSkeleton height="520px" /> })
const TechnologyFeatureSection = dynamic(() => import('./blocks/TechnologyFeatureSection').then(m => ({ default: m.TechnologyFeatureSection })), { loading: () => <SectionSkeleton height="520px" /> })
const EquipmentShowcaseSection = dynamic(() => import('./blocks/EquipmentShowcaseSection').then(m => ({ default: m.EquipmentShowcaseSection })), { loading: () => <SectionSkeleton height="420px" /> })
const ConsultationSection = dynamic(() => import('./blocks/ConsultationSection').then(m => ({ default: m.ConsultationSection })), { loading: () => <SectionSkeleton height="520px" /> })

interface BlockRendererProps {
  layout: Page['layout'] | HomepageBlock[]
}

export function BlockRenderer({ layout }: BlockRendererProps) {
  // Handle empty or undefined layout
  if (!layout || layout.length === 0) {
    return (
      <EmptyState
        title="No content blocks"
        description="This page doesn't have any content blocks yet. Add some blocks in the CMS."
      />
    )
  }

  return (
    <>
      {layout.map((block, index) => {
        // Safety check for block
        if (!block || !block.blockType) {
          return null
        }

        // Render appropriate component based on blockType
        try {
          // CRITICAL: Strapi v5 often returns id: 1 for multiple different component types.
          // Using only block.id for keys causes React reconciliation/hydration errors.
          // Combining blockType and index ensures a unique, stable key for the Dynamic Zone.
          const reactKey = `${block.blockType}-${index}`;
          
          switch (block.blockType) {
            case 'hero':
              return <HeroBlock key={reactKey} data={block as any} />
 
            case 'services':
              return <ServicesBlock key={reactKey} data={block as any} />
 
            case 'doctor':
              return <DoctorSection key={reactKey} data={block as any} />
 
            case 'certification':
              return <CertificationSection key={reactKey} data={block as any} />

            case 'results-section':
              return <ResultsSection key={reactKey} data={block as any} />

            case 'testimonials-section':
              return <TestimonialsSection key={reactKey} data={block as any} />

            case 'press-section':
              return <PressSection key={reactKey} data={block as any} />

            case 'blog-collection-section':
              return <ArticlesSection key={reactKey} data={block as any} />
 
            case 'proof-showcase': return <HomeProofSection key={reactKey} data={block as any} />
            case 'technology-feature': return <TechnologyFeatureSection key={reactKey} data={block as any} />
            case 'equipment-showcase': return <EquipmentShowcaseSection key={reactKey} data={block as any} />
            case 'consultation': return <ConsultationSection key={reactKey} data={block as any} />
 
            default:
              const unknownBlock = block as any;
              return (
                <div key={reactKey} className="py-8 bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="container mx-auto px-4 text-center">
                    <p className="text-yellow-800 dark:text-yellow-200">
                      Unknown block type: {unknownBlock.blockType}
                    </p>
                  </div>
                </div>
              );
          }
        } catch (error) {
          return (
            <div key={index} className="py-8 bg-red-50 dark:bg-red-900/20">
              <div className="container mx-auto px-4 text-center">
                <p className="text-red-800 dark:text-red-200">
                  Error rendering block
                </p>
              </div>
            </div>
          )
        }
      })}
    </>
  )
}
