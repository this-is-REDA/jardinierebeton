import Image from "next/image";
import Link from "next/link";
import type { FamilyCatalogItem } from "@/lib/data/catalog-items";
import type { Finish } from "@/lib/data/site-data";
import {
  photoAppearanceClassName,
  photoAppearanceStyle,
} from "@/lib/photo-appearance";
import { formatPriceDH } from "@/lib/utils";

export function ProductCatalogGrid({
  families,
  finishes,
}: {
  families: FamilyCatalogItem[];
  finishes: Finish[];
}) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {families.map((family) => (
        <article
          key={family.id}
          className="flex flex-col overflow-hidden rounded-sm border border-[rgba(0,0,0,0.08)] bg-[#ffffff] transition hover:border-[rgba(0,0,0,0.16)]"
        >
          <Link href={`/produits/${family.slug}`} className="group flex flex-1 flex-col">
            <div
              className={`product-card-image relative overflow-hidden ${
                family.isSquare ? "aspect-square" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={family.image}
                alt={family.name}
                fill
                className={`transition duration-700 group-hover:scale-[1.02] ${photoAppearanceClassName(family.appearance.fit)}`}
                style={photoAppearanceStyle(family.appearance)}
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={family.image.includes("supabase.co")}
              />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <p className="label-caps">Gamme</p>
              <h3 className="mt-3 font-serif text-2xl text-[#171717] transition group-hover:text-[#000000]">
                {family.name}
              </h3>

              <p className="mt-4 text-sm text-[#737373]">
                {family.variantCount}{" "}
                {family.variantCount > 1
                  ? "dimensions disponibles"
                  : "dimension disponible"}{" "}
                · {finishes.length} finitions
              </p>

              <p className="mt-4 font-medium text-[#171717]">
                À partir de {formatPriceDH(family.minPrice)} H.T
              </p>

              <div className="mt-5">
                <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-[#a3a3a3] uppercase">
                  Couleurs
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {finishes.map((finish) => (
                    <span
                      key={finish.name}
                      title={finish.name}
                      className="h-5 w-5 rounded-full border border-[rgba(0,0,0,0.1)]"
                      style={{ backgroundColor: finish.hex }}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-5 text-xs font-medium tracking-[0.08em] text-[#171717] uppercase">
                Voir le produit →
              </p>
            </div>
          </Link>

          <div className="px-6 pb-6">
            <Link
              href={`/?devis=${encodeURIComponent(family.name)}#contact`}
              className="btn-outline w-full justify-center"
            >
              Demander un devis
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
