"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Leaf,
  MapPin,
  Palette,
  Ruler,
  Shield,
  Truck,
} from "lucide-react";
import type { FamilyCatalogItem } from "@/lib/data/catalog-items";
import type { Finish, ProductPhoto } from "@/lib/data/site-data";
import {
  defaultPhotoAppearance,
  photoAppearanceClassName,
  photoAppearanceStyle,
} from "@/lib/photo-appearance";
import { formatPriceDH, formatWeightKg } from "@/lib/utils";

type OtherFamily = Pick<
  FamilyCatalogItem,
  "slug" | "name" | "image" | "variantCount" | "minPrice" | "isSquare" | "appearance"
>;

type DetailTab = "description" | "specs" | "dimensions";

export function ProductPageView({
  family,
  finishes,
  otherFamilies,
  delivery,
  brandName,
}: {
  family: FamilyCatalogItem;
  finishes: Finish[];
  otherFamilies: OtherFamily[];
  delivery: string;
  brandName: string;
}) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState(
    family.photos[0]?.finish ?? finishes[0]?.name ?? ""
  );
  const [activeTab, setActiveTab] = useState<DetailTab>("description");

  const selectedVariant = family.variants[selectedVariantIndex];

  const galleryPhotos = useMemo(() => {
    if (family.photos.length > 0) return family.photos;

    return finishes.map((finish) => ({
      name: family.name,
      finish: finish.name,
      image: family.image,
      familySlug: family.slug,
      appearance: family.appearance,
    })) satisfies ProductPhoto[];
  }, [family, finishes]);

  const activePhoto = useMemo(() => {
    return (
      galleryPhotos.find((photo) => photo.finish === selectedFinish) ??
      galleryPhotos[0]
    );
  }, [galleryPhotos, selectedFinish]);

  const activeAppearance =
    activePhoto?.appearance ?? family.appearance ?? defaultPhotoAppearance;

  const devisLabel = `${family.name} — ${selectedVariant.model} — ${selectedFinish}`;

  return (
    <div className="product-page">
      <nav
        aria-label="Fil d'Ariane"
        className="product-breadcrumb flex flex-wrap items-center gap-2 text-xs tracking-[0.08em] text-[#737373] uppercase"
      >
        <Link href="/" className="transition hover:text-[#171717]">
          Accueil
        </Link>
        <ChevronRight size={12} className="text-[#a3a3a3]" />
        <Link href="/produits" className="transition hover:text-[#171717]">
          Produits
        </Link>
        <ChevronRight size={12} className="text-[#a3a3a3]" />
        <span className="text-[#171717]">{family.name}</span>
      </nav>

      <div className="product-layout mt-8 lg:mt-10">
        <div className="product-gallery">
          <div
            className={`product-gallery-main product-card-image relative overflow-hidden ${
              family.isSquare ? "aspect-square" : "aspect-[4/3]"
            }`}
          >
            <Image
              key={`${activePhoto?.image}-${selectedFinish}`}
              src={activePhoto?.image ?? family.image}
              alt={`${family.name} — ${selectedFinish}`}
              fill
              className={`transition duration-500 ${photoAppearanceClassName(activeAppearance.fit)}`}
              style={photoAppearanceStyle(activeAppearance)}
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
              unoptimized={(activePhoto?.image ?? family.image).includes(
                "supabase.co"
              )}
            />
          </div>

          {galleryPhotos.length > 1 && (
            <div className="product-gallery-thumbs mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-4">
              {galleryPhotos.map((photo) => {
                const appearance = photo.appearance ?? defaultPhotoAppearance;
                const isActive = photo.finish === selectedFinish;
                const finish = finishes.find((item) => item.name === photo.finish);

                return (
                  <button
                    key={`${photo.finish}-${photo.image}`}
                    type="button"
                    onClick={() => setSelectedFinish(photo.finish)}
                    className={`product-thumb ${isActive ? "product-thumb-active" : ""}`}
                    aria-label={`Voir ${photo.finish}`}
                    aria-pressed={isActive}
                  >
                    <div
                      className={`relative overflow-hidden ${
                        family.isSquare ? "aspect-square" : "aspect-[4/3]"
                      }`}
                    >
                      <Image
                        src={photo.image}
                        alt={photo.finish}
                        fill
                        className={photoAppearanceClassName(appearance.fit)}
                        style={photoAppearanceStyle(appearance)}
                        sizes="96px"
                        unoptimized={photo.image.includes("supabase.co")}
                      />
                    </div>
                    {finish && (
                      <span
                        className="product-thumb-dot"
                        style={{ backgroundColor: finish.hex }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="product-buybox">
          <div className="product-buybox-inner">
            <p className="label-caps">{brandName}</p>
            <h1 className="product-title mt-3">{family.name}</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#737373]">
              Jardinière en béton allégé, teintée dans la masse. Indoor &
              outdoor, fabriquée au Maroc.
            </p>

            <div className="product-price mt-8">
              <span className="product-price-value">
                {formatPriceDH(selectedVariant.price)}
              </span>
              <span className="product-price-label">H.T</span>
            </div>
            <p className="mt-2 text-xs text-[#a3a3a3]">
              À partir de {formatPriceDH(family.minPrice)} H.T selon le modèle
            </p>

            <div className="product-option mt-8">
              <p className="product-option-label">
                Finition
                <span className="product-option-value">{selectedFinish}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {finishes.map((finish) => {
                  const hasPhoto = galleryPhotos.some(
                    (photo) => photo.finish === finish.name
                  );

                  return (
                    <button
                      key={finish.name}
                      type="button"
                      onClick={() => setSelectedFinish(finish.name)}
                      className={`product-swatch ${
                        selectedFinish === finish.name
                          ? "product-swatch-active"
                          : ""
                      }`}
                      title={finish.name}
                      aria-label={finish.name}
                      aria-pressed={selectedFinish === finish.name}
                    >
                      <span
                        className="product-swatch-color"
                        style={{ backgroundColor: finish.hex }}
                      />
                      {!hasPhoto && (
                        <span className="product-swatch-hint">aperçu</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="product-option mt-8">
              <p className="product-option-label">
                Dimension
                <span className="product-option-value">
                  {selectedVariant.model}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {family.variants.map((variant, index) => (
                  <button
                    key={variant.model}
                    type="button"
                    onClick={() => setSelectedVariantIndex(index)}
                    className={`product-variant-btn ${
                      selectedVariantIndex === index
                        ? "product-variant-btn-active"
                        : ""
                    }`}
                  >
                    {variant.model.replace(/^Jardinière\s*/i, "")}
                  </button>
                ))}
              </div>
            </div>

            <dl className="product-specs mt-8 grid grid-cols-2 gap-3">
              <SpecItem
                label="Longueur"
                value={`${selectedVariant.length_cm} cm`}
              />
              <SpecItem
                label="Largeur"
                value={`${selectedVariant.width_cm} cm`}
              />
              <SpecItem
                label="Hauteur"
                value={`${selectedVariant.height_cm} cm`}
              />
              <SpecItem
                label="Épaisseur"
                value={`${selectedVariant.thickness_cm} cm`}
              />
              <SpecItem
                label="Poids"
                value={`${formatWeightKg(selectedVariant.weight_kg)} kg`}
                className="col-span-2"
              />
            </dl>

            <Link
              href={`/?devis=${encodeURIComponent(devisLabel)}#contact`}
              className="btn-primary product-cta mt-8 w-full justify-center"
            >
              Demander un devis
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/catalogue"
              className="btn-outline mt-3 w-full justify-center"
            >
              Catalogue tarifaire complet
            </Link>

            <ul className="product-trust mt-8 space-y-3">
              <TrustItem icon={Truck} text={delivery} />
              <TrustItem icon={MapPin} text="Fabriqué au Maroc" />
              <TrustItem icon={Palette} text="Teinté dans la masse" />
              <TrustItem icon={Shield} text="Béton allégé résistant" />
              <TrustItem icon={Leaf} text="Indoor & outdoor" />
            </ul>
          </div>
        </div>
      </div>

      <div className="product-tabs mt-16 lg:mt-20">
        <div className="product-tabs-nav" role="tablist">
          {(
            [
              ["description", "Description"],
              ["specs", "Caractéristiques"],
              ["dimensions", "Toutes les dimensions"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`product-tab-btn ${
                activeTab === id ? "product-tab-btn-active" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="product-tab-panel">
          {activeTab === "description" && (
            <div className="product-tab-content">
              <h2 className="font-serif text-2xl text-[#171717]">
                Une jardinière pensée pour durer
              </h2>
              <p className="mt-4 max-w-3xl text-[0.9375rem] leading-relaxed text-[#737373]">
                La {family.name.toLowerCase()} allie esthétique minimaliste et
                robustesse du béton allégé. Chaque pièce est teintée dans la
                masse pour un rendu homogène qui résiste au temps, au soleil et
                aux intempéries — sans peinture ni traitement superficiel.
              </p>
              <p className="mt-4 max-w-3xl text-[0.9375rem] leading-relaxed text-[#737373]">
                Disponible en {family.variantCount} dimensions et{" "}
                {finishes.length} finitions, elle s&apos;adapte aux terrasses,
                villas, hôtels, bureaux et espaces commerciaux.
              </p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="product-tab-content">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                  icon={Ruler}
                  title="Dimensions modulables"
                  text={`${family.variantCount} tailles disponibles pour s'adapter à chaque espace.`}
                />
                <FeatureCard
                  icon={Palette}
                  title="Finitions premium"
                  text={`${finishes.length} couleurs teintées dans la masse, sans reprise.`}
                />
                <FeatureCard
                  icon={Shield}
                  title="Béton allégé"
                  text="Structure solide, plus légère à manipuler et à installer."
                />
                <FeatureCard
                  icon={Leaf}
                  title="Polyvalence"
                  text="Usage intérieur et extérieur, résistant aux variations climatiques."
                />
                <FeatureCard
                  icon={MapPin}
                  title="Fabrication locale"
                  text="Conçue et produite au Maroc avec un savoir-faire artisanal."
                />
                <FeatureCard
                  icon={Truck}
                  title="Livraison"
                  text={delivery}
                />
              </div>
            </div>
          )}

          {activeTab === "dimensions" && (
            <div className="product-tab-content">
              <div className="overflow-x-auto rounded-sm border border-[rgba(0,0,0,0.08)]">
                <table className="catalogue-table w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-[#f5f5f5]">
                    <tr>
                      <th className="label-caps px-4 py-4 font-medium">
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
                    {family.variants.map((variant, index) => (
                      <tr
                        key={variant.model}
                        className={`border-t border-[rgba(0,0,0,0.06)] ${
                          selectedVariantIndex === index ? "bg-[#fafafa]" : ""
                        }`}
                      >
                        <td className="px-4 py-4 font-medium text-[#171717]">
                          {variant.model}
                        </td>
                        <td className="px-4 py-4 text-[#525252]">
                          {variant.length_cm}
                        </td>
                        <td className="px-4 py-4 text-[#525252]">
                          {variant.width_cm}
                        </td>
                        <td className="px-4 py-4 text-[#525252]">
                          {variant.height_cm}
                        </td>
                        <td className="px-4 py-4 text-[#525252]">
                          {variant.thickness_cm}
                        </td>
                        <td className="px-4 py-4 text-[#525252]">
                          {formatWeightKg(variant.weight_kg)} kg
                        </td>
                        <td className="px-4 py-4 font-medium text-[#171717]">
                          {formatPriceDH(variant.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {otherFamilies.length > 0 && (
        <section className="mt-20 border-t border-[rgba(0,0,0,0.08)] pt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="label-caps">Vous aimerez aussi</p>
              <h2 className="mt-3 font-serif text-2xl text-[#171717]">
                Complétez votre sélection
              </h2>
            </div>
            <Link href="/produits" className="link-arrow hidden sm:inline-block">
              Tous les produits →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {otherFamilies.map((other) => (
              <Link
                key={other.slug}
                href={`/produits/${other.slug}`}
                className="product-related group"
              >
                <div
                  className={`product-card-image relative shrink-0 overflow-hidden ${
                    other.isSquare ? "h-28 w-28" : "h-28 w-36"
                  }`}
                >
                  <Image
                    src={other.image}
                    alt={other.name}
                    fill
                    className={photoAppearanceClassName(other.appearance.fit)}
                    style={photoAppearanceStyle(other.appearance)}
                    sizes="144px"
                    unoptimized={other.image.includes("supabase.co")}
                  />
                </div>
                <div>
                  <p className="font-serif text-lg text-[#171717] transition group-hover:text-[#000000]">
                    {other.name}
                  </p>
                  <p className="mt-1 text-sm text-[#737373]">
                    {other.variantCount} dimensions · à partir de{" "}
                    {formatPriceDH(other.minPrice)} H.T
                  </p>
                  <p className="mt-3 text-xs font-medium tracking-[0.08em] text-[#171717] uppercase">
                    Voir le produit →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SpecItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-sm border border-[rgba(0,0,0,0.08)] bg-[#fafafa] px-4 py-3 ${className}`}
    >
      <dt className="text-[0.65rem] font-semibold tracking-[0.14em] text-[#a3a3a3] uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[#171717]">{value}</dd>
    </div>
  );
}

function TrustItem({
  icon: Icon,
  text,
}: {
  icon: typeof Truck;
  text: string;
}) {
  return (
    <li className="flex items-center gap-3 text-sm text-[#525252]">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f5f5] text-[#171717]">
        <Icon size={15} />
      </span>
      {text}
    </li>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Ruler;
  title: string;
  text: string;
}) {
  return (
    <article className="value-card">
      <Icon size={20} className="text-[#171717]" />
      <h3 className="mt-4 font-serif text-lg text-[#171717]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#737373]">{text}</p>
    </article>
  );
}
