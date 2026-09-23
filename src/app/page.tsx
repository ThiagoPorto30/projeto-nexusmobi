import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { CatalogSection } from "@/components/catalog-section";
import { LeadCaptureSection } from "@/components/lead-capture-section";
import { Footer } from "@/components/footer";
import { LeadProvider } from "@/components/lead-context";

export default function Home() {
  return (
    <LeadProvider>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <HeroSection />
        <CatalogSection />
        <FeaturesSection />
        <LeadCaptureSection />
      </main>
      <Footer />
    </LeadProvider>
  );
}
