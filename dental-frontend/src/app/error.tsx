'use client'

import Link from 'next/link'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="stitch-error-page" aria-labelledby="error-title">
    <div className="stitch-error-page__inner">
      <span className="stitch-kicker">DR. MARIS AESTHETICS</span>
      <strong className="stitch-error-page__code">500</strong>
      <h1 id="error-title">Something went wrong</h1>
      <p>We could not load this page right now. Please try again or return to the homepage.</p>
      <div className="stitch-error-page__actions"><button type="button" className="stitch-button stitch-button--dark" onClick={() => reset()}>Try again</button><Link className="stitch-button stitch-button--outline" href="/">Return home</Link></div>
    </div>
  </main>
}

