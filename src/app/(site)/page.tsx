import { Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { UsagesSection } from "@/components/sections/UsagesSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { CatalogueSection } from "@/components/sections/CatalogueSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <UsagesSection />
      <ValuesSection />
      <ProductsSection />
      <CatalogueSection />
      <Suspense fallback={null}>
        <ContactSection />
      </Suspense>
    </>
  );
}
