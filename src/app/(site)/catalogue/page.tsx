import type { Metadata } from "next";
import { CatalogueSection } from "@/components/sections/CatalogueSection";

export const metadata: Metadata = {
  title: "Catalogue & tarifs",
  description:
    "Tableau des dimensions et tarifs H.T en dirhams pour les jardinières rectangle et carrée en béton allégé.",
};

export default function CataloguePage() {
  return (
    <div className="pt-4">
      <CatalogueSection contactHref="/contact" />
    </div>
  );
}
