import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/data/site-data";

export function HeroSection() {
  return (
    <section className="hero-section relative">
      <Image
        src={brand.heroImage}
        alt="Jardinières en béton allégé en situation"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="hero-video-overlay pointer-events-none absolute inset-0" />

      <div className="hero-section-content relative z-10 flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 md:px-10 lg:px-16 xl:px-24">
        <span className="accent-line" />
        <p className="label-caps mt-6">{brand.subtitle}</p>
        <h1 className="hero-title mt-5 font-serif leading-[1.08] tracking-tight text-[#171717]">
          Des jardinières
          <br />
          <em className="text-[#525252] not-italic">légères</em> et durables
        </h1>
        <p className="section-lead mt-6 sm:mt-7">
          Béton allégé, teinté dans la masse et fabriqué au Maroc. Idéal pour
          terrasses, patios, halls d&apos;entrée et espaces professionnels.
        </p>

        <div className="mt-8 flex flex-col gap-2 text-sm text-[#525252] sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
          <a
            href={`mailto:${brand.email}`}
            className="break-all transition hover:text-[#000000] sm:break-normal"
          >
            {brand.email}
          </a>
          <span className="hidden text-[#a3a3a3] sm:inline">·</span>
          <span>{brand.delivery}</span>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
          <Link href="/produits" className="btn-primary justify-center sm:justify-start">
            Découvrir nos produits →
          </Link>
          <Link href="/catalogue" className="btn-outline justify-center sm:justify-start">
            Voir les tarifs
          </Link>
        </div>
      </div>
    </section>
  );
}
