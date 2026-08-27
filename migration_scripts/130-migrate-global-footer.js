/** Migrate the shared footer to the Global Site Footer contract. */
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const TOKEN = process.env.STRAPI_API_TOKEN
if (!TOKEN) throw new Error('STRAPI_API_TOKEN is required')

async function request(path, method = 'GET', body) {
  const response = await fetch(`${STRAPI_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: body ? JSON.stringify(body) : undefined,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${JSON.stringify(payload)}`)
  return payload
}

const footer = {
  logo: 10,
  description: "We're here to help you achieve a healthy, confident smile with advanced care you can trust.",
  contact_info: {
    address: '233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam',
    phone: '0866 251 379',
    email: 'info@smiluxdental.com',
  },
  link_groups: [
    { heading: 'QUICK LINKS', links: [{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about-us' }, { label: 'Services', href: '/services' }, { label: 'Technology', href: '/#home-technology' }, { label: 'Smile Transformations', href: '/customers' }, { label: 'Blog', href: '/news' }, { label: 'Contact', href: '/contact' }] },
    { heading: 'OUR SERVICES', links: [{ label: 'Dental Implants', href: '/services/dental-implants' }, { label: 'Teeth Whitening', href: '/services/dental-bleaching' }, { label: 'Orthodontics', href: '/services/dental-braces' }, { label: 'Dental Fillings', href: '/services' }, { label: 'Root Canal Therapy', href: '/services' }, { label: 'Cosmetic Dentistry', href: '/services/dental-veneers-cost' }, { label: 'All Services', href: '/services' }] },
    { heading: 'PATIENT INFO', links: [{ label: 'New Patients', href: '/contact' }, { label: 'Payment Options', href: '/contact' }, { label: 'Insurance', href: '/contact' }, { label: 'FAQs', href: '/#home-faq' }, { label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }] },
  ],
  social_links: [
    { platform: 'facebook', url: 'https://www.facebook.com/saigonimplant' },
    { platform: 'instagram', url: 'https://instagram.com/saigondentalclinic' },
    { platform: 'youtube', url: 'https://www.youtube.com/@sgdental.official' },
    { platform: 'tiktok', url: 'https://www.tiktok.com/@sgdental.official' },
  ],
  appointment_label: 'BOOK APPOINTMENT',
  appointment_href: '/#home-booking',
  copyright_text: '© 2024 Smilux Dental Clinic. All Rights Reserved.',
  tagline: 'Designed with care for your smile.',
}

async function main() {
  await request('/api/footer', 'PUT', { data: footer })
  await request('/api/footer', 'PUT', { data: { publishedAt: new Date().toISOString() } })
  console.log('Global footer migrated and published')
}

main().catch((error) => { console.error(error.message); process.exit(1) })
