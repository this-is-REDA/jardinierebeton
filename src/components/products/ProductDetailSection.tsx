import { notFound } from "next/navigation";
import { brand } from "@/lib/data/site-data";
import {
  getCatalogProducts,
  getProductPhotos,
  getFinishes,
} from "@/lib/data/catalog";
import {
  buildFamilyCatalogItems,
  getFamilyBySlug,
} from "@/lib/data/catalog-items";
import { ProductPageView } from "@/components/products/ProductPageView";

export async function ProductDetailSection({ slug }: { slug: string }) {
  const [products, photos, finishes] = await Promise.all([
    getCatalogProducts(),
    getProductPhotos(),
    getFinishes(),
  ]);

  const family = getFamilyBySlug(slug, products, photos);
  if (!family) notFound();

  const otherFamilies = buildFamilyCatalogItems(products, photos).filter(
    (item) => item.slug !== family.slug
  );

  return (
    <section className="section-shell px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <ProductPageView
          family={family}
          finishes={finishes}
          otherFamilies={otherFamilies}
          delivery={brand.delivery}
          brandName={brand.name}
        />
      </div>
    </section>
  );
}
