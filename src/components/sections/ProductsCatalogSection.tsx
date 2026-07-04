import Link from "next/link";
import { brand } from "@/lib/data/site-data";
import {
  getCatalogProducts,
  getProductPhotos,
  getFinishes,
} from "@/lib/data/catalog";
import { buildFamilyCatalogItems } from "@/lib/data/catalog-items";
import { ProductCatalogGrid } from "@/components/products/ProductCatalogGrid";

export async function ProductsCatalogSection() {
  const [products, photos, finishes] = await Promise.all([
    getCatalogProducts(),
    getProductPhotos(),
    getFinishes(),
  ]);

  const families = buildFamilyCatalogItems(products, photos);
  const totalVariants = families.reduce(
    (count, family) => count + family.variantCount,
    0
  );

  return (
    <>
      <section className="catalog-hero grid min-h-[420px] lg:min-h-[520px] lg:grid-cols-2">
        <div className="catalog-hero-content flex flex-col justify-center px-6 py-14 lg:px-12 xl:px-20">
          <nav
            aria-label="Fil d'Ariane"
            className="mb-8 flex flex-wrap items-center gap-2 text-xs tracking-[0.08em] text-[#737373] uppercase"
          >
            <Link href="/" className="transition hover:text-[#171717]">
              Accueil
            </Link>
            <span className="text-[#a3a3a3]">/</span>
            <span className="text-[#171717]">Produits</span>
          </nav>

          <span className="accent-line" />
          <p className="label-caps mt-6">Catalogue</p>
          <h1 className="section-heading mt-5">Tous nos produits</h1>
          <p className="section-lead mt-6 max-w-xl">
            Découvrez nos gammes de jardinières en béton allégé, teintées dans
            la masse et fabriquées au Maroc.
          </p>

          <dl className="catalog-hero-stats mt-10 grid grid-cols-3 gap-3 sm:gap-4">
            <div className="catalog-hero-stat">
              <dt className="catalog-hero-stat-value">{families.length}</dt>
              <dd className="catalog-hero-stat-label">Gammes</dd>
            </div>
            <div className="catalog-hero-stat">
              <dt className="catalog-hero-stat-value">{totalVariants}</dt>
              <dd className="catalog-hero-stat-label">Dimensions</dd>
            </div>
            <div className="catalog-hero-stat">
              <dt className="catalog-hero-stat-value">{finishes.length}</dt>
              <dd className="catalog-hero-stat-label">Finitions</dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#catalogue-grid" className="btn-primary">
              Explorer la collection →
            </a>
            <Link href="/catalogue" className="btn-outline">
              Voir les tarifs
            </Link>
          </div>
        </div>

        <div className="catalog-hero-media relative min-h-[280px] sm:min-h-[360px] lg:min-h-full">
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
          <div className="catalog-hero-media-overlay pointer-events-none absolute inset-0" />
        </div>
      </section>

      <section
        id="catalogue-grid"
        className="section-divider section-shell lg:px-10"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 flex flex-col gap-6 border-b border-[rgba(0,0,0,0.08)] pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="label-caps">Gamme complète</p>
              <h2 className="mt-4 font-serif text-2xl text-[#171717] sm:text-3xl">
                Jardinières rectangle & carrée
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-[#737373]">
                Choisissez une gamme pour découvrir toutes les dimensions,
                couleurs et tarifs disponibles.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {finishes.map((finish) => (
                <div
                  key={finish.name}
                  className="flex items-center gap-2 rounded-sm border border-[rgba(0,0,0,0.08)] px-3 py-2 text-xs text-[#525252]"
                >
                  <span
                    className="h-4 w-4 rounded-full border border-[rgba(0,0,0,0.1)]"
                    style={{ backgroundColor: finish.hex }}
                  />
                  {finish.name}
                </div>
              ))}
            </div>
          </div>

          <ProductCatalogGrid families={families} finishes={finishes} />

          <div className="mt-20 grid gap-6 border-t border-[rgba(0,0,0,0.08)] pt-12 sm:grid-cols-2">
            <div className="border border-[rgba(0,0,0,0.12)] bg-[#f5f5f5] px-8 py-10">
              <p className="font-serif text-xl text-[#171717]">
                Tableau tarifaire détaillé
              </p>
              <p className="mt-3 text-sm text-[#737373]">
                Consultez le catalogue complet avec toutes les dimensions en
                format tableau.
              </p>
              <Link href="/catalogue" className="link-arrow mt-6 inline-block">
                Voir le catalogue tarifaire →
              </Link>
            </div>
            <div className="border border-[rgba(0,0,0,0.12)] bg-[#f5f5f5] px-8 py-10">
              <p className="font-serif text-xl text-[#171717]">
                Un projet en tête ?
              </p>
              <p className="mt-3 text-sm text-[#737373]">
                {brand.delivery}. Contactez-nous pour un devis personnalisé.
              </p>
              <Link href="/#contact" className="btn-outline mt-6 inline-block">
                Nous contacter →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
