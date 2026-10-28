import { LandingPage } from '@/components/landing/LandingPage'
import { buildLandingMetadata } from '@/lib/i18n'

export const metadata = buildLandingMetadata('pt_BR')

export default function HomePage() {
  return <LandingPage locale="pt_BR" />
}
