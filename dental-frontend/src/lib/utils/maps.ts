import { CLINIC_INFO } from '../constants/contact';

/**
 * Generates a direct Google Maps URL using coordinates for pinpoint accuracy.
 * Falls back to clinic defaults if no parameters are provided.
 * 
 * @param options - Optional location override parameters
 * @returns {string} The formatted Google Maps URL
 */
export const getGoogleMapsUrl = (options?: {
  lat?: number;
  lng?: number;
  address?: string;
  name?: string
}): string => {
  const name = encodeURIComponent(options?.name || CLINIC_INFO.vietNamName || CLINIC_INFO.name);
  const address = encodeURIComponent(options?.address || CLINIC_INFO.vietNamAddress || CLINIC_INFO.address);

  // Combining Name + Address is the most reliable way to trigger the Business Panel
  return `https://www.google.com/maps/search/?api=1&query=${name}+${address}`;
};
