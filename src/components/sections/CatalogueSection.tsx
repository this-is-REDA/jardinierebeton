import Link from "next/link";
import { brand } from "@/lib/data/site-data";
import { getCatalogProducts } from "@/lib/data/catalog";
import { VariantPricingTable } from "@/components/products/VariantPricingTable";

export async function CatalogueSection({
  contactHref = "#contact",
}: {
  contactHref?: string;
}) {
  const products = await getCatalogProducts();
  return (
    <section id="catalogue" className="section-divider section-shell lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 max-w-2xl sm:mb-16">
          <p className="label-caps">Catalogue</p>
          <h2 className="section-heading mt-5">Dimensions & tarifs</h2>
          <p className="section-lead mt-6">
            Prix unitaire H.T en dirhams. Toutes les finitions sont teintées
            dans la masse. Contactez-nous pour un devis incluant la livraison.
          </p>
        </div>

        <div className="space-y-14 sm:space-y-20">
          {products.map((product) => (
            <article key={product.id}>
              <h3 className="font-serif text-xl text-[#171717] sm:text-2xl md:text-3xl">
                {product.name}
              </h3>
              <span className="accent-line mt-4" />

              <div className="mt-8 sm:mt-10">
                <VariantPricingTable variants={product.variants} />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 border border-[rgba(0, 0, 0,0.12)] bg-[#f5f5f5] px-5 py-8 text-center sm:mt-16 sm:px-8 sm:py-10 lg:px-14">
          <p className="font-serif text-lg text-[#171717] sm:text-xl">
            Teinté dans la masse
          </p>
          <p className="mt-2 text-sm text-[#a3a3a3]">{brand.delivery}</p>
          <Link href={contactHref} className="btn-outline mt-6 inline-block sm:mt-8">
            Demander un devis →
          </Link>
        </div>
      </div>
    </section>
  );
}
