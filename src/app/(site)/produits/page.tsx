import type { Metadata } from "next";
import { ProductsSection } from "@/components/sections/ProductsSection";

export const metadata: Metadata = {
  title: "Produits",
  description:
    "Jardinières rectangle et carrée en béton allégé. 6 finitions teintées dans la masse, fabriquées au Maroc.",
};

export default function ProductsPage() {
  return (
    <div className="pt-4">
      <ProductsSection catalogueHref="/catalogue" showVideoBanner />
    </div>
  );
}
