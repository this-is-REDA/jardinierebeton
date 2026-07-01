import Link from "next/link";
import { usages } from "@/lib/data/site-data";

export function UsagesSection() {
  return (
    <section id="usages" className="section-divider section-shell lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-caps">Où les utiliser</p>
          <h2 className="section-heading mt-5">
            Des jardinières pour chaque espace
          </h2>
          <p className="section-lead mx-auto mt-6">
            Indoor & outdoor — béton allégé teinté dans la masse, livraison
            partout au Maroc.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {usages.map((item) => (
            <div key={item.title} className="value-card">
              <h3 className="font-serif text-xl text-[#171717]">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-[#a3a3a3]">
                {item.description}
              </p>
              <p className="mt-4 text-sm text-[#525252]">{item.suggest}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="/produits" className="btn-primary">
            Voir nos produits
          </Link>
          <Link href="/catalogue" className="btn-outline">
            Consulter le catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}
