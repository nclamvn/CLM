import type { Metadata } from 'next';
import { Nav } from '@/components/landing/Nav';
import { Hero } from '@/components/landing/Hero';
import { TrustStrip } from '@/components/landing/TrustStrip';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ValueUnit } from '@/components/landing/ValueUnit';
import { WhyTrust } from '@/components/landing/WhyTrust';
import { VerticalBand } from '@/components/landing/VerticalBand';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { ViewSwitch } from '@/components/shared/ViewSwitch';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <ValueUnit />
        <WhyTrust />
        <VerticalBand />
        <CTA />
      </main>
      <Footer />
      <ViewSwitch active="landing" fixed />
    </>
  );
}
