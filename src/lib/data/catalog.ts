import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  products as staticProducts,
  productPhotos as staticPhotos,
  finishes as staticFinishes,
  brand as staticBrand,
} from "@/lib/data/site-data";
import type { SiteProduct, ProductPhoto, Finish } from "@/lib/data/site-data";

export async function getCatalogProducts(): Promise<SiteProduct[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return staticProducts;
  }

  const { data: families, error: familiesError } = await supabase
    .from("product_families")
    .select("*")
    .order("sort_order");

  if (familiesError || !families?.length) {
    return staticProducts;
  }

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("*")
    .order("sort_order");

  if (variantsError) {
    return staticProducts;
  }

  return families.map((family) => ({
    id: family.id,
    name: family.name,
    slug: family.slug,
    variants: (variants ?? [])
      .filter((v) => v.family_id === family.id)
      .map((v) => ({
        model: v.model,
        length_cm: Number(v.length_cm),
        width_cm: Number(v.width_cm),
        height_cm: Number(v.height_cm),
        thickness_cm: Number(v.thickness_cm),
        weight_kg: Number(v.weight_kg),
        price: Number(v.price),
      })),
  }));
}

export async function getProductPhotos(): Promise<ProductPhoto[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return staticPhotos;
  }

  const { data: photos, error: photosError } = await supabase
    .from("product_photos")
    .select("*")
    .order("sort_order");

  if (photosError || !photos?.length) {
    return staticPhotos;
  }

  const { data: families } = await supabase
    .from("product_families")
    .select("id, name, slug");

  const familyMap = new Map(
    (families ?? []).map((f) => [f.id, { name: f.name, slug: f.slug }])
  );

  return photos.map((row) => {
    const family = familyMap.get(row.family_id);
    return {
      name: family?.name ?? "Jardinière",
      finish: row.finish,
      image: row.image_url,
      familySlug: family?.slug ?? "jardiniere-rectangle",
    };
  });
}

export async function getFinishes(): Promise<Finish[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return staticFinishes;
  }

  const { data, error } = await supabase
    .from("finishes")
    .select("*")
    .order("sort_order");

  if (error || !data?.length) {
    return staticFinishes;
  }

  return data.map((f) => ({ name: f.name, hex: f.hex }));
}

export async function getBrandSettings() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      email: staticBrand.email,
      whatsapp: staticBrand.whatsapp,
      whatsappMessage: staticBrand.whatsappMessage,
      delivery: staticBrand.delivery,
    };
  }

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "brand")
    .maybeSingle();

  const value = (data?.value ?? {}) as Record<string, string>;

  return {
    email: value.email ?? staticBrand.email,
    whatsapp: value.whatsapp ?? staticBrand.whatsapp,
    whatsappMessage: value.whatsappMessage ?? staticBrand.whatsappMessage,
    delivery: value.delivery ?? staticBrand.delivery,
  };
}

export { isSupabaseConfigured };
