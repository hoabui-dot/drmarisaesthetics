import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

/**
 * Customer Page
 * 
 * Dedicated page for customer testimonials, success stories, and benefits.
 * Similar structure to About Us page with custom rendering for CMS JSON content.
 */

export const metadata: Metadata = { title: 'Patient Results | DR. MARIS AESTHETICS', description: 'Review selected patient results from DR. MARIS AESTHETICS.' }

export default function CustomerPage() { redirect('/results') }
