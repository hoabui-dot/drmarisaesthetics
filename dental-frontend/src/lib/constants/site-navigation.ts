export const HEADER_CTA = {
  label: 'BOOK A CONSULTATION',
  href: '/contact#form-section',
} as const

export const FALLBACK_HEADER_NAVIGATION = [
  { id: 1, label: 'About Us', href: '/about-us' },
  {
    id: 2,
    label: 'Our Team',
    href: '/our-team',
    isClickable: false,
    children: [
      { id: 201, label: 'Dr. Huy', href: '/our-team' },
      { id: 202, label: 'Dr. Cuong', href: '/deep-plane-facelift-specialist' },
    ],
  },
  { id: 3, label: 'Services', href: '/services', isClickable: true },
  { id: 4, label: 'Treatments', href: '/treatments' },
  { id: 5, label: 'Results', href: '/results' },
  { id: 6, label: 'Journal', href: '/news' },
  { id: 7, label: 'Contact', href: '/contact' },
]

export const FALLBACK_FOOTER = {
  description: 'A surgeon-led aesthetic practice providing personalized, hospital-based cosmetic surgery care in Ho Chi Minh City.',
  linkGroups: [
    { id: 1, heading: 'EXPLORE', links: [{ id: 1, label: 'About Us', href: '/about-us' }, { id: 2, label: 'Our Team', href: '/our-team' }, { id: 3, label: 'Services', href: '/services' }, { id: 4, label: 'Treatments', href: '/treatments' }] },
    { id: 2, heading: 'PATIENT JOURNEY', links: [{ id: 5, label: 'Patient Results', href: '/results' }, { id: 6, label: 'Patient Journal', href: '/news' }, { id: 7, label: 'Contact & Consultation', href: '/contact' }, { id: 8, label: 'Medical Disclaimer', href: '/medical-disclaimer' }] },
  ],
  copyrightText: '© 2026 DR. MARIS AESTHETICS. ALL RIGHTS RESERVED.',
  tagline: 'Surgeon-led. Hospital-based. Individually planned.',
} as const
