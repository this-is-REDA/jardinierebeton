import type { SiteProduct, ProductPhoto, ProductVariant } from "@/lib/data/site-data";
import {
  defaultPhotoAppearance,
  type PhotoAppearance,
} from "@/lib/photo-appearance";

export interface FamilyCatalogItem {
  id: string;
  slug: string;
  name: string;
  variants: ProductVariant[];
  photos: ProductPhoto[];
  image: string;
  appearance: PhotoAppearance;
  isSquare: boolean;
  variantCount: number;
  minPrice: number;
}

function getFamilyCoverPhoto(
  familySlug: string,
  photos: ProductPhoto[]
): ProductPhoto | undefined {
  const familyPhotos = photos.filter((photo) => photo.familySlug === familySlug);
  return (
    familyPhotos.find((photo) => photo.finish === "Gris Ciment") ?? familyPhotos[0]
  );
}

export function buildFamilyCatalogItems(
  products: SiteProduct[],
  photos: ProductPhoto[]
): FamilyCatalogItem[] {
  return products.map((product) => {
    const familyPhotos = photos
      .filter((photo) => photo.familySlug === product.slug)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const coverPhoto = getFamilyCoverPhoto(product.slug, photos);
    const prices = product.variants.map((variant) => variant.price);

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      variants: product.variants,
      photos: familyPhotos,
      image: coverPhoto?.image ?? "/images/products/rectangle-gris-ciment.jpg",
      appearance: coverPhoto?.appearance ?? defaultPhotoAppearance,
      isSquare: product.slug.includes("carree"),
      variantCount: product.variants.length,
      minPrice: prices.length ? Math.min(...prices) : 0,
    };
  });
}

export function getFamilyBySlug(
  slug: string,
  products: SiteProduct[],
  photos: ProductPhoto[]
): FamilyCatalogItem | undefined {
  return buildFamilyCatalogItems(products, photos).find(
    (family) => family.slug === slug
  );
}
