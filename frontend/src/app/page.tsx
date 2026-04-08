import { NavBar } from '@/components/landing/NavBar'
import { HeroSection } from '@/components/landing/HeroSection'
import { DorSection } from '@/components/landing/DorSection'
import { SolucaoSection } from '@/components/landing/SolucaoSection'
import { DiferenciaisSection } from '@/components/landing/DiferenciaisSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { CtaFinalSection } from '@/components/landing/CtaFinalSection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0d0d0d] text-white">
      <NavBar />
      <main>
        <HeroSection />
        <DorSection />
        <SolucaoSection />
        <DiferenciaisSection />
        <PricingSection />
        <CtaFinalSection />
      </main>
      <Footer />
    </div>
  )
}
