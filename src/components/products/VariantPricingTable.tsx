import type { ProductVariant } from "@/lib/data/site-data";
import { formatPriceDH, formatWeightKg } from "@/lib/utils";

export function VariantPricingTable({
  variants,
  highlightIndex,
}: {
  variants: ProductVariant[];
  highlightIndex?: number;
}) {
  return (
    <>
      <div className="pricing-cards-mobile space-y-3 lg:hidden">
        {variants.map((variant, index) => (
          <article
            key={variant.model}
            className={`pricing-card rounded-sm border border-[rgba(0,0,0,0.08)] p-4 ${
              highlightIndex === index ? "bg-[#fafafa]" : "bg-[#ffffff]"
            }`}
          >
            <p className="font-medium text-[#171717]">{variant.model}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-[0.65rem] font-semibold tracking-[0.12em] text-[#a3a3a3] uppercase">
                  L × l × H
                </dt>
                <dd className="mt-0.5 text-[#525252]">
                  {variant.length_cm} × {variant.width_cm} × {variant.height_cm} cm
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-semibold tracking-[0.12em] text-[#a3a3a3] uppercase">
                  Ép. / Poids
                </dt>
                <dd className="mt-0.5 text-[#525252]">
                  {variant.thickness_cm} cm · {formatWeightKg(variant.weight_kg)} kg
                </dd>
              </div>
            </dl>
            <p className="mt-3 font-medium text-[#171717]">
              {formatPriceDH(variant.price)} H.T
            </p>
          </article>
        ))}
      </div>

      <div className="pricing-table-desktop hidden overflow-x-auto rounded-sm border border-[rgba(0,0,0,0.08)] lg:block">
        <table className="catalogue-table w-full text-left text-sm">
          <thead className="bg-[#f5f5f5]">
            <tr>
              <th className="label-caps px-4 py-4 font-medium">Modèle</th>
              <th className="label-caps px-4 py-4 font-medium">L (cm)</th>
              <th className="label-caps px-4 py-4 font-medium">l (cm)</th>
              <th className="label-caps px-4 py-4 font-medium">H (cm)</th>
              <th className="label-caps px-4 py-4 font-medium">Ép. (cm)</th>
              <th className="label-caps px-4 py-4 font-medium">Poids</th>
              <th className="label-caps px-4 py-4 font-medium">Prix H.T</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, index) => (
              <tr
                key={variant.model}
                className={`border-t border-[rgba(0,0,0,0.06)] ${
                  highlightIndex === index ? "bg-[#fafafa]" : ""
                }`}
              >
                <td className="px-4 py-4 font-medium text-[#171717]">
                  {variant.model}
                </td>
                <td className="px-4 py-4 text-[#525252]">{variant.length_cm}</td>
                <td className="px-4 py-4 text-[#525252]">{variant.width_cm}</td>
                <td className="px-4 py-4 text-[#525252]">{variant.height_cm}</td>
                <td className="px-4 py-4 text-[#525252]">{variant.thickness_cm}</td>
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
    </>
  );
}
