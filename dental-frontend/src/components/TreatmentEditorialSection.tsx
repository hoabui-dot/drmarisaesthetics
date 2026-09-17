import Image from 'next/image'
import type { TreatmentPageSection } from '@/src/types/treatments-page'

function EditorialImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 48vw" className="object-cover" unoptimized />
}

type TreatmentEditorialSectionProps = {
  section: TreatmentPageSection
  anchorId: string
  index: number
}

/** Renders any additional treatments editorial-section added from Strapi. */
export function TreatmentEditorialSection({ section, anchorId, index }: TreatmentEditorialSectionProps) {
  const paragraphs = [section.paragraphOne, section.paragraphTwo].filter((value): value is string => Boolean(value?.trim()))

  return (
    <article id={anchorId} className="stitch-treatment-landing__block stitch-treatment-landing__block--cms">
      <header>
        {section.eyebrow ? <span className="stitch-kicker">{section.eyebrow}</span> : null}
        <h2>{section.title}</h2>
        {section.lead ? <p className="stitch-treatment-landing__lead">{section.lead}</p> : null}
      </header>
      <div className={section.image ? 'stitch-treatment-landing__cms-layout' : undefined}>
        <div className="stitch-treatment-landing__copy">
          {paragraphs.map((paragraph, paragraphIndex) => <p key={`${anchorId}-paragraph-${paragraphIndex}`}>{paragraph}</p>)}
          {section.items.length ? (
            <div className="stitch-treatment-landing__cms-items">
              {section.items.map((item, itemIndex) => (
                <article key={`${anchorId}-item-${itemIndex}`}>
                  <span>{item.number || String(itemIndex + 1).padStart(2, '0')}</span>
                  <div><h3>{item.title}</h3>{item.description ? <p>{item.description}</p> : null}</div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
        {section.image ? <div className="stitch-treatment-landing__image"><EditorialImage src={section.image} alt={section.imageAlt || section.title} /></div> : null}
      </div>
      {!paragraphs.length && !section.items.length && !section.image ? <p className="stitch-treatment-landing__empty-note">Section {index + 1}</p> : null}
    </article>
  )
}
