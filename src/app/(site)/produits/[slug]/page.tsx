import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCatalogProducts,
  getProductPhotos,
  getFinishes,
} from "@/lib/data/catalog";
import { getFamilyBySlug } from "@/lib/data/catalog-items";
import { ProductDetailSection } from "@/components/products/ProductDetailSection";
import { formatPriceDH } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [products, photos, finishes] = await Promise.all([
    getCatalogProducts(),
    getProductPhotos(),
    getFinishes(),
  ]);
  const family = getFamilyBySlug(slug, products, photos);

  if (!family) {
    return { title: "Produit introuvable" };
  }

  return {
    title: family.name,
    description: `${family.name} — ${family.variantCount} dimensions, ${finishes.length} finitions teintées dans la masse. À partir de ${formatPriceDH(family.minPrice)} H.T. Béton allégé fabriqué au Maroc.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [products, photos] = await Promise.all([
    getCatalogProducts(),
    getProductPhotos(),
  ]);

  if (!getFamilyBySlug(slug, products, photos)) {
    notFound();
  }

  return (
    <div className="pt-4">
      <ProductDetailSection slug={slug} />
    </div>
  );
}
