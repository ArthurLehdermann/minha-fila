import { LandingPage } from '@/components/landing/LandingPage'
import { buildLandingMetadata } from '@/lib/i18n'

export const metadata = buildLandingMetadata('en')

export default function EnglishLandingPage() {
  return <LandingPage locale="en" />
}
