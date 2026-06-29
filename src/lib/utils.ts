export function formatPriceDH(price: number): string {
  return `${price.toLocaleString("fr-FR")} DH`;
}

export function formatWeightKg(weight: number): string {
  return weight.toLocaleString("fr-FR", {
    minimumFractionDigits: Number.isInteger(weight) ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
