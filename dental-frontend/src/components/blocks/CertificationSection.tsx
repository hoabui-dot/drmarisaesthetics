import Image from 'next/image'
import type { HomepageCertificationBlock } from '@/src/types/strapi'

export function CertificationSection({ data }: { data: HomepageCertificationBlock }) {
  const bundles = data.bundles.slice(0, 4)
  if (!bundles.length) return null

  return (
    <section id="home-certificates" className="certificate-section" aria-labelledby="home-certificates-heading">
      <div className="mx-auto max-w-home-container px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="certificate-layout">
          <div className="certificate-intro">
            <p className="eyebrow">{data.eyebrow || 'CERTIFICATES & ACCREDITATIONS'}</p>
            <h2 id="home-certificates-heading">{data.heading || 'Certified. Recognized. Trusted.'}</h2>
            <div className="certificate-summary-list">
              {bundles.map((bundle) => <div key={bundle.id} className="certificate-summary-item"><div className="certificate-summary-logo">{bundle.organizationLogo?.url ? <Image src={bundle.organizationLogo.url} alt={bundle.organizationLogo.alt || bundle.organizationName} fill sizes="48px" className="object-contain p-1" /> : <span>{bundle.organizationName}</span>}</div><p>{bundle.summary}</p></div>)}
            </div>
          </div>
          <div className="certificate-gallery" data-count={bundles.length}>
            {bundles.map((bundle) => <figure key={bundle.id} className="certificate-frame"><div className="certificate-document">{bundle.certificateImage?.url && <Image src={bundle.certificateImage.url} alt={bundle.certificateImage.alt || bundle.certificateAlt || `${bundle.organizationName} certificate`} fill sizes="(max-width: 767px) 70vw, (max-width: 1023px) 28vw, 180px" className="object-contain p-2" />}</div></figure>)}
          </div>
        </div>
      </div>
    </section>
  )
}
