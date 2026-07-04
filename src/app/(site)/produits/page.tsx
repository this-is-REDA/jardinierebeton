import type { Metadata } from "next";
import { ProductsCatalogSection } from "@/components/sections/ProductsCatalogSection";

export const metadata: Metadata = {
  title: "Produits",
  description:
    "Découvrez tous nos modèles de jardinières en béton allégé : rectangle et carrée, 6 finitions teintées dans la masse, fabriquées au Maroc.",
};

export default function ProductsPage() {
  return (
    <div className="pt-4">
      <ProductsCatalogSection />
    </div>
  );
}
