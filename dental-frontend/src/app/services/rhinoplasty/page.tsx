import { redirect } from 'next/navigation'

/** Preserve inbound links while the public route moves to /face/rhinoplasty. */
export default function LegacyRhinoplastyRoute() {
  redirect('/face/rhinoplasty')
}
