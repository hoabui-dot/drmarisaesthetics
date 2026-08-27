import { AboutHero } from './AboutHero'

/** Desktop comparison target: inherited full-width Homepage Hero viewport. */
export const aboutHeroPreviewViewport = '1440 × 900 px'

export function AboutHeroPreview() {
  return (
    <AboutHero
      data={{
        eyebrow: 'ABOUT SMILUX',
        headingPrimary: 'About Smilux',
        headingSecondaryLine1: 'Trusted Dental Excellence',
        headingSecondaryLine2: 'Built Around You.',
        supportingParagraph: 'At Smilux Dental, we combine advanced technology, international expertise, and a passion for people, to deliver exceptional care and lasting smiles.',
      }}
    />
  )
}
