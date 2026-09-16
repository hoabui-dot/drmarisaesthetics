import Link from 'next/link'

/**
 * Not Found Page
 * 
 * Displayed when a page slug doesn't exist in the CMS.
 * Triggered by notFound() function in [slug]/page.tsx
 */

export default function NotFound() {
  return (
    <main className="stitch-error-page" aria-labelledby="not-found-title">
      <div className="stitch-error-page__inner">
        <span className="stitch-kicker">DR. MARIS AESTHETICS</span>
        <strong className="stitch-error-page__code">404</strong>
        <h1 id="not-found-title">Page not found</h1>
        <p>The page may have moved, or the address may no longer be available.</p>
        <div className="stitch-error-page__actions"><Link className="stitch-button stitch-button--dark" href="/">Return home</Link><Link className="stitch-button stitch-button--outline" href="/contact">Contact our team</Link></div>
      </div>
    </main>
  )
}
