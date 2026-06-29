import Link from "next/link";
import { brand } from "@/lib/data/site-data";
import { getCatalogProducts } from "@/lib/data/catalog";
import { formatPriceDH, formatWeightKg } from "@/lib/utils";

export async function CatalogueSection({
  contactHref = "#contact",
}: {
  contactHref?: string;
}) {
  const products = await getCatalogProducts();
  return (
    <section id="catalogue" className="section-divider section-shell lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 max-w-2xl">
          <p className="label-caps">Catalogue</p>
          <h2 className="section-heading mt-5">Dimensions & tarifs</h2>
          <p className="section-lead mt-6">
            Prix unitaire H.T en dirhams. Toutes les finitions sont teintées
            dans la masse. Contactez-nous pour un devis incluant la livraison.
          </p>
        </div>

        <div className="space-y-20">
          {products.map((product) => (
            <article key={product.id}>
              <h3 className="font-serif text-2xl text-[#e8e2d3] sm:text-3xl">
                {product.name}
              </h3>
              <span className="accent-line mt-4" />

              <div className="mt-10 overflow-x-auto rounded-sm border border-[rgba(232,226,211,0.08)]">
                <table className="catalogue-table w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-[#252220]">
                    <tr>
                      <th className="label-caps px-4 py-4 pr-4 font-medium">
                        Modèle
                      </th>
                      <th className="label-caps px-4 py-4 font-medium">
                        L (cm)
                      </th>
                      <th className="label-caps px-4 py-4 font-medium">
                        l (cm)
                      </th>
                      <th className="label-caps px-4 py-4 font-medium">
                        H (cm)
                      </th>
                      <th className="label-caps px-4 py-4 font-medium">
                        Ép. (cm)
                      </th>
                      <th className="label-caps px-4 py-4 font-medium">
                        Poids
                      </th>
                      <th className="label-caps px-4 py-4 font-medium">
                        Prix H.T
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((variant) => (
                      <tr
                        key={variant.model}
                        className="border-t border-[rgba(232,226,211,0.06)]"
                      >
                        <td className="px-4 py-4 font-medium text-[#e8e2d3]">
                          {variant.model}
                        </td>
                        <td className="px-4 py-4 text-[#c9bfb0]">
                          {variant.length_cm}
                        </td>
                        <td className="px-4 py-4 text-[#c9bfb0]">
                          {variant.width_cm}
                        </td>
                        <td className="px-4 py-4 text-[#c9bfb0]">
                          {variant.height_cm}
                        </td>
                        <td className="px-4 py-4 text-[#c9bfb0]">
                          {variant.thickness_cm}
                        </td>
                        <td className="px-4 py-4 text-[#c9bfb0]">
                          {formatWeightKg(variant.weight_kg)} kg
                        </td>
                        <td className="px-4 py-4 font-medium text-[#e8e2d3]">
                          {formatPriceDH(variant.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 border border-[rgba(232,226,211,0.12)] bg-[#252220] px-8 py-10 text-center lg:px-14">
          <p className="font-serif text-xl text-[#e8e2d3]">
            Teinté dans la masse
          </p>
          <p className="mt-2 text-sm text-[#a6917c]">{brand.delivery}</p>
          <Link href={contactHref} className="btn-outline mt-8 inline-block">
            Demander un devis →
          </Link>
        </div>
      </div>
    </section>
  );
}
