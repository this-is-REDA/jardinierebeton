import Link from "next/link";
import { brand } from "@/lib/data/site-data";
import { getCatalogProducts, getFinishes } from "@/lib/data/catalog";

export async function Footer() {
  const [products, finishes] = await Promise.all([
    getCatalogProducts(),
    getFinishes(),
  ]);

  return (
    <footer className="border-t border-[rgba(0, 0, 0,0.08)] bg-[#ffffff]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:gap-12 sm:px-6 sm:py-16 md:grid-cols-2 lg:grid-cols-3 lg:px-10">
        <div>
          <p className="text-[0.65rem] font-semibold tracking-[0.28em] text-[#171717] uppercase">
            {brand.name}
          </p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-[#a3a3a3]">
            {brand.subtitle} · {brand.tagline}
          </p>
        </div>

        <div>
          <p className="label-caps mb-5">Catalogue</p>
          <ul className="space-y-3 text-sm text-[#525252]">
            <li>
              <Link href="/produits" className="transition hover:text-[#000000]">
                Nos produits
              </Link>
            </li>
            {products.map((p) => (
              <li key={p.id}>
                <Link href={`/produits/${p.slug}`} className="transition hover:text-[#000000]">
                  {p.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#usages" className="transition hover:text-[#000000]">
                Usages
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <p className="label-caps mb-5">Contact</p>
          <ul className="space-y-3 text-sm text-[#525252]">
            <li>{brand.city}</li>
            <li>
              <a
                href={`mailto:${brand.email}`}
                className="transition hover:text-[#000000]"
              >
                {brand.email}
              </a>
            </li>
            <li>{brand.delivery}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[rgba(0, 0, 0,0.08)]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-4 px-4 py-6 text-center text-xs text-[#a3a3a3] sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-10 lg:text-left">
          <p className="shrink-0">
            © {new Date().getFullYear()} {brand.name}. Tous droits réservés.
          </p>
          <p className="flex flex-wrap justify-center gap-x-2 gap-y-1 lg:justify-end">
            {finishes.map((f, index) => (
              <span key={f.name}>
                {index > 0 && <span className="text-[#d4d4d4]">·</span>}{" "}
                {f.name}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
