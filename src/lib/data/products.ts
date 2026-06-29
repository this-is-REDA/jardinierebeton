import { createSupabaseServerClient } from "@/lib/supabase/server";
import { products as staticProducts } from "@/lib/data/site-data";
import type { SiteProduct } from "@/lib/data/site-data";

export async function getProducts(): Promise<SiteProduct[]> {
  const { getCatalogProducts } = await import("@/lib/data/catalog");
  return getCatalogProducts();
}

export async function getFeaturedProducts(): Promise<SiteProduct[]> {
  return getProducts();
}

// Legacy mapper kept for compatibility
function mapSupabaseToSiteProduct(row: Record<string, unknown>): SiteProduct {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    variants: Array.isArray(row.variants) ? row.variants : [],
  };
}

export { mapSupabaseToSiteProduct, staticProducts };
