import Link from "next/link";
import { brand } from "@/lib/data/site-data";

export function HeroSection() {
  return (
    <section className="grid min-h-[calc(100vh-73px)] lg:grid-cols-2">
      <div className="relative z-10 flex flex-col justify-center px-6 py-16 lg:px-16 xl:px-24">
        <span className="accent-line" />
        <p className="label-caps mt-6">{brand.subtitle}</p>
        <h1 className="mt-5 font-serif text-[2.75rem] leading-[1.08] tracking-tight text-[#e8e2d3] sm:text-5xl xl:text-[3.5rem]">
          Des jardinières
          <br />
          <em className="text-[#8a9a78] not-italic">légères</em> et durables
        </h1>
        <p className="section-lead mt-7">
          Béton allégé, teinté dans la masse et fabriqué au Maroc. Idéal pour
          terrasses, patios, halls d&apos;entrée et espaces professionnels.
        </p>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#c9bfb0]">
          <a
            href={`mailto:${brand.email}`}
            className="transition hover:text-[#e8e2d3]"
          >
            {brand.email}
          </a>
          <span className="text-[#7a6f63]">·</span>
          <span>{brand.delivery}</span>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/produits" className="btn-primary">
            Découvrir nos produits →
          </Link>
          <Link href="/catalogue" className="btn-outline">
            Voir les tarifs
          </Link>
        </div>
      </div>

      <div className="relative min-h-[320px] bg-[#1c1917] sm:min-h-[400px] lg:min-h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-label="Jardinières en béton allégé en situation"
        >
          <source src={brand.heroVideo} type="video/mp4" />
        </video>
        <div className="hero-video-overlay pointer-events-none absolute inset-0" />
      </div>
    </section>
  );
}
