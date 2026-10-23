import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  HeroSection,
  ToolsGridSection,
  HowItWorksSection,
  PricingSection,
  SourceCodeSection,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ToolsGridSection />
        <HowItWorksSection />
        <PricingSection />
        <SourceCodeSection />
      </main>
      <Footer />
    </div>
  );
}
