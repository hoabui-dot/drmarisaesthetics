import { ResultsSection } from './ResultsSection'

export default function ResultsSectionPreview() {
  return <ResultsSection data={{
    blockType: 'results-section', id: 1,
    eyebrow: 'SMILE TRANSFORMATIONS', heading: 'Real Stories. Real Smiles.',
    intro: "Nothing speaks louder than the smiles of those we've experienced with, Here are some inspiring smile makeovers and real stories.",
    stories: [1, 2, 3, 4].map((id) => ({
      id, title: id === 1 ? 'Christina’s Smile. Transformed' : `Patient ${id}’s Smile. Transformed`,
      description: 'A treatment plan tailored to each patient’s goals, creating a balanced, natural smile and renewed confidence.',
      treatments: ['Smile design planning with digital preview', 'Professional teeth whitening', 'Placement of composite veneers'],
      image: { url: '', alt: 'Composite before and after treatment', width: 1200, height: 900 }, imageAlt: 'Composite before and after treatment', patientPortrait: { url: '', alt: 'Smiling patient', width: 700, height: 731 },
      quote: 'A confident, complete, and truly personal smile.',
    })),
  }} />
}
