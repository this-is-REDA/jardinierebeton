import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/data/site-data";
import { getCatalogProducts, getProductPhotos } from "@/lib/data/catalog";
import {
  defaultPhotoAppearance,
  photoAppearanceClassName,
  photoAppearanceStyle,
} from "@/lib/photo-appearance";

export async function ProductsSection({
  catalogueHref = "#catalogue",
  showVideoBanner = false,
}: {
  catalogueHref?: string;
  showVideoBanner?: boolean;
}) {
  const [products, productPhotos] = await Promise.all([
    getCatalogProducts(),
    getProductPhotos(),
  ]);

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

          <div className="mt-20 space-y-24">
            {products.map((product) => {
              const photos = productPhotos.filter(
                (p) => p.familySlug === product.slug
              );
              const isSquare = product.slug.includes("carree");

              return (
                <div key={product.id}>
                  <h2 className="font-serif text-2xl text-[#171717] sm:text-3xl">
                    {product.name}
                  </h2>
                  {product.variants.length > 0 && (
                    <p className="mt-4 text-[0.9375rem] leading-relaxed text-[#a3a3a3]">
                      {product.variants.map((v) => v.model).join(" · ")}
                    </p>
                  )}

                  {photos.length > 0 ? (
                    <div
                      className={`mt-10 grid gap-8 sm:grid-cols-2 ${
                        isSquare ? "lg:max-w-lg" : "lg:grid-cols-3"
                      }`}
                    >
                      {photos.map((photo) => {
                        const appearance = photo.appearance ?? defaultPhotoAppearance;

                        return (
                        <article key={`${photo.finish}-${photo.image}`} className="group">
                          <div
                            className={`product-card-image relative overflow-hidden ${
                              isSquare ? "aspect-square" : "aspect-[4/3]"
                            }`}
                          >
                            <Image
                              src={photo.image}
                              alt={`${photo.name} — ${photo.finish}`}
                              fill
                              className={`transition duration-700 group-hover:scale-[1.02] ${photoAppearanceClassName(appearance.fit)}`}
                              style={photoAppearanceStyle(appearance)}
                              sizes="(max-width: 768px) 100vw, 33vw"
                              unoptimized={photo.image.includes("supabase.co")}
                            />
                          </div>
                          <p className="mt-5 font-serif text-lg text-[#171717]">
                            {photo.name}
                          </p>
                          <p className="mt-1 text-sm tracking-wide text-[#525252]">
                            {photo.finish}
                          </p>
                        </article>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mt-6 text-sm italic text-[#a3a3a3]">
                      Photos à venir — ajoutez-les depuis l&apos;admin.
                    </p>
                  )}

                  <p className="mt-8 text-sm italic text-[#a3a3a3]">
                    Teintée dans la masse — six finitions disponibles
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-20 border-t border-[rgba(0, 0, 0,0.08)] pt-10">
            <Link href={catalogueHref} className="link-arrow">
              Consulter le catalogue tarifaire →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
