import { values } from "@/lib/data/site-data";

export function ValuesSection() {
  return (
    <section className="section-divider section-shell lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 max-w-2xl">
          <p className="label-caps">Nos atouts</p>
          <h2 className="section-heading mt-5">
            Conçues pour durer, pensées pour s&apos;adapter
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item, index) => (
            <div key={item.title} className="value-card">
              <span className="font-serif text-3xl text-[#171717]/15">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-serif text-xl text-[#171717]">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-[#a3a3a3]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
