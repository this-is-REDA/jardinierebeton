import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { brand } from "@/lib/data/site-data";
import {
  getCatalogProducts,
  getProductPhotos,
  getFinishes,
} from "@/lib/data/catalog";
import { buildFamilyCatalogItems } from "@/lib/data/catalog-items";
import {
  defaultPhotoAppearance,
  photoAppearanceClassName,
  photoAppearanceStyle,
} from "@/lib/photo-appearance";
import { formatPriceDH } from "@/lib/utils";

export async function ProductsSection({
  catalogueHref = "#catalogue",
  showVideoBanner = false,
}: {
  catalogueHref?: string;
  showVideoBanner?: boolean;
}) {
  const [products, productPhotos, finishes] = await Promise.all([
    getCatalogProducts(),
    getProductPhotos(),
    getFinishes(),
  ]);

  const families = buildFamilyCatalogItems(products, productPhotos);

  return (
    <section
      id="produits"
      className={`section-divider ${showVideoBanner ? "" : "section-shell lg:px-10"}`}
    >
      {showVideoBanner ? (
        <div className="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[480px]">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden
          >
            <source src={brand.collectionVideo} type="video/mp4" />
          </video>
          <div className="section-video-overlay pointer-events-none absolute inset-0" />
          <div className="relative z-10 flex min-h-[360px] items-end section-shell sm:min-h-[420px] lg:min-h-[480px] lg:px-10">
            <div className="max-w-2xl pb-14 pt-24">
              <p className="label-caps">Collection</p>
              <h1 className="section-heading mt-5">Nos jardinières</h1>
              <p className="section-lead mt-6">
                Chaque modèle est disponible teinté dans la masse pour un
                rendu uniforme et durable.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className={showVideoBanner ? "section-shell lg:px-10" : ""}>
        <div className="mx-auto max-w-[1400px]">
          {!showVideoBanner && (
            <div className="max-w-2xl">
              <p className="label-caps">Collection</p>
              <h2 className="section-heading mt-5">Nos jardinières</h2>
              <p className="section-lead mt-6">
                Chaque modèle est disponible teinté dans la masse pour un
                rendu uniforme et durable.
              </p>
            </div>
          )}

          <div className="mt-20 space-y-28">
            {families.map((family) => (
              <article
                key={family.id}
                className="home-family-block border-t border-[rgba(0,0,0,0.08)] pt-12 first:border-t-0 first:pt-0"
              >
                <div className="home-family-header">
                  <div className="max-w-xl">
                    <p className="label-caps">Gamme</p>
                    <h3 className="mt-3 font-serif text-2xl text-[#171717] sm:text-3xl">
                      {family.name}
                    </h3>
                    {family.variants.length > 0 && (
                      <p className="mt-4 text-sm leading-relaxed text-[#737373]">
                        {family.variants.map((variant) => variant.model).join(" · ")}
                      </p>
                    )}
                    <p className="mt-4 text-sm font-medium text-[#171717]">
                      À partir de {formatPriceDH(family.minPrice)} H.T
                    </p>
                  </div>

                  <Link
                    href={`/produits/${family.slug}`}
                    className="btn-outline mt-6 shrink-0 self-start lg:mt-0"
                  >
                    Voir le produit
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {family.photos.length > 0 ? (
                  <div
                    className={`home-family-gallery mt-10 ${
                      family.isSquare
                        ? "home-family-gallery-square"
                        : "home-family-gallery-rectangle"
                    }`}
                  >
                    {(() => {
                      const seenFinishes = new Set<string>();
                      return family.photos.filter((photo) => {
                        if (seenFinishes.has(photo.finish)) return false;
                        seenFinishes.add(photo.finish);
                        return true;
                      });
                    })().map((photo) => {
                      const appearance =
                        photo.appearance ?? defaultPhotoAppearance;
                      const finish = finishes.find(
                        (item) => item.name === photo.finish
                      );

                      return (
                        <figure
                          key={photo.id ?? `${photo.finish}-${photo.image}`}
                          className="home-family-photo group"
                        >
                          <div
                            className={`product-card-image relative overflow-hidden ${
                              family.isSquare ? "aspect-square" : "aspect-[4/3]"
                            }`}
                          >
                            <Image
                              src={photo.image}
                              alt={`${family.name} — ${photo.finish}`}
                              fill
                              className={`transition duration-700 group-hover:scale-[1.02] ${photoAppearanceClassName(appearance.fit)}`}
                              style={photoAppearanceStyle(appearance)}
                              sizes="(max-width: 768px) 50vw, 25vw"
                              unoptimized={photo.image.includes("supabase.co")}
                            />
                          </div>
                          <figcaption className="mt-4 flex items-center gap-2">
                            {finish && (
                              <span
                                className="h-3.5 w-3.5 rounded-full border border-[rgba(0,0,0,0.1)]"
                                style={{ backgroundColor: finish.hex }}
                              />
                            )}
                            <span className="text-sm text-[#525252]">
                              {photo.finish}
                            </span>
                          </figcaption>
                        </figure>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-8 text-sm italic text-[#a3a3a3]">
                    Photos à venir — ajoutez-les depuis l&apos;admin.
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(0,0,0,0.06)] pt-6">
                  <p className="text-sm text-[#a3a3a3]">
                    Teintée dans la masse — {finishes.length} finitions
                    disponibles
                  </p>
                  <Link
                    href={`/produits/${family.slug}`}
                    className="link-arrow"
                  >
                    Découvrir {family.name.toLowerCase()} →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-20 flex flex-col gap-4 border-t border-[rgba(0,0,0,0.08)] pt-10 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/produits" className="link-arrow">
              Voir tous les produits →
            </Link>
            <Link href={catalogueHref} className="link-arrow">
              Consulter le catalogue tarifaire →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
