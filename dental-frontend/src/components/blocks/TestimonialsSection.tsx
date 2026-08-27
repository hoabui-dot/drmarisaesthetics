'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { HomepageTestimonialsSectionBlock } from '@/src/types/strapi'

const TESTIMONIALS_PER_PAGE = 3

function Rating({ value }: { value: number }) {
  return (
    <div className="testimonials-rating" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => <span key={star} aria-hidden="true" className={star <= value ? 'is-filled' : ''}>★</span>)}
    </div>
  )
}

export function TestimonialsSection({ data }: { data: HomepageTestimonialsSectionBlock }) {
  const [page, setPage] = useState(0)
  const pageCount = Math.max(1, Math.ceil(data.testimonials.length / TESTIMONIALS_PER_PAGE))
  const visibleTestimonials = data.testimonials.slice(page * TESTIMONIALS_PER_PAGE, (page + 1) * TESTIMONIALS_PER_PAGE)

  return (
    <section id="home-testimonials" className="testimonials-section">
      <div className="testimonials-content">
        <header className="testimonials-header">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2>{data.heading}</h2>
        </header>
        <div className="testimonials-grid">
          {visibleTestimonials.map((testimonial, index) => (
            <figure key={testimonial.id} className="testimonials-card">
              {page === 0 && index === 0 && <span className="testimonials-quote-decoration" aria-hidden="true">“</span>}
              <Rating value={testimonial.rating} />
              <blockquote>“{testimonial.quote}”</blockquote>
              <figcaption>
                {testimonial.patientAvatar ? (
                  <Image src={testimonial.patientAvatar.url} alt={testimonial.patientAvatarAlt || testimonial.patientAvatar.alt || testimonial.patientName} width={48} height={48} className="testimonials-avatar" />
                ) : <span className="testimonials-avatar testimonials-avatar-fallback" aria-hidden="true">{testimonial.patientName.charAt(0)}</span>}
                <span className="testimonials-identity">
                  <strong>{testimonial.patientName}</strong>
                  <span>{testimonial.patientLocation}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        {pageCount > 1 && (
          <nav className="testimonials-pagination" aria-label="Testimonials pages">
            {Array.from({ length: pageCount }, (_, index) => (
              <button key={index} type="button" className={index === page ? 'is-active' : ''} onClick={() => setPage(index)} aria-label={`Show testimonial page ${index + 1}`} aria-current={index === page ? 'page' : undefined} />
            ))}
          </nav>
        )}
      </div>
      <div className="testimonials-section-image">
        {data.sectionImage?.url ? <Image src={data.sectionImage.url} alt={data.sectionImageAlt || data.sectionImage.alt || 'Smiling Smilux Dental patient'} fill className="object-cover" sizes="(max-width: 1023px) 100vw, 31vw" priority /> : null}
      </div>
    </section>
  )
}
