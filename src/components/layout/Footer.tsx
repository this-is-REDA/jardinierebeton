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
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 lg:grid-cols-3 lg:px-10">
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
                <Link href="/catalogue" className="transition hover:text-[#000000]">
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

        <div>
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
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-[#a3a3a3] sm:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} {brand.name}. Tous droits réservés.</p>
          <p>{finishes.map((f) => f.name).join(" · ")}</p>
        </div>
      </div>
    </footer>
  );
}
