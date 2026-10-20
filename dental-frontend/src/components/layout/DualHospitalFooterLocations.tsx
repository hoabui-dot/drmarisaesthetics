import { ArrowUpRight, MapPin } from 'lucide-react'
import type { WebsiteHospitalMapLocation } from '@/src/types/strapi'

const HOSPITAL_ORDER: WebsiteHospitalMapLocation['locationKey'][] = ['HIU', 'CIH']

function getDirectionsUrl(location: WebsiteHospitalMapLocation) {
  const destination = Number.isFinite(location.latitude) && Number.isFinite(location.longitude)
    ? `${location.latitude},${location.longitude}`
    : `${location.name}, ${location.address}`
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
}

export function DualHospitalFooterLocations({ locations }: { locations: WebsiteHospitalMapLocation[] }) {
  const hospitals = HOSPITAL_ORDER.flatMap((key) => {
    const location = locations.find((item) => item.locationKey === key && item.name && item.address)
    return location ? [location] : []
  })

  return <>
    {hospitals.map((location) => (
      <a
        className="site-footer-location-row"
        key={location.locationKey}
        href={getDirectionsUrl(location)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Get directions to ${location.name}: ${location.address}`}
      >
        <MapPin size={17} aria-hidden="true" />
        <span className="site-footer-location-copy">
          <strong>{location.name}</strong>
          <span className="site-footer-location-address">
            {location.address}<ArrowUpRight className="site-footer-location-directions-icon" size={15} aria-hidden="true" />
          </span>
        </span>
      </a>
    ))}
  </>
}
