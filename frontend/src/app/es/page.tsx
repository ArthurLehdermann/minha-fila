import { LandingPage } from '@/components/landing/LandingPage'
import { buildLandingMetadata } from '@/lib/i18n'

export const metadata = buildLandingMetadata('es')

export default function SpanishLandingPage() {
  return <LandingPage locale="es" />
}
