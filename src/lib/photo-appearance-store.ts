import type { SupabaseClient } from "@supabase/supabase-js";
import {
  defaultPhotoAppearance,
  parsePhotoAppearance,
  type PhotoAppearance,
} from "@/lib/photo-appearance";
import type { Database } from "@/types/database";

export const PHOTO_APPEARANCES_SETTINGS_KEY = "photo_appearances";

type Supabase = SupabaseClient<Database>;

/** @deprecated Prefer photo id keys. Kept for legacy settings. */
export function photoAppearanceKey(familyId: string, finish: string): string {
  return `${familyId}:${finish}`;
}

export function photoAppearancePhotoKey(photoId: string): string {
  return photoId;
}

export function normalizeFinishName(finish: string): string {
  return finish.trim();
}

type FinishPhotoLike = {
  id: string;
  finish: string;
  sort_order?: number;
  appearance?: unknown;
};

export function getFinishGroupAppearance(
  familyId: string,
  finish: string,
  photos: FinishPhotoLike[],
  appearanceMap: Record<string, PhotoAppearance>
): PhotoAppearance {
  const normalizedFinish = normalizeFinishName(finish);
  const finishPhotos = photos
    .filter((photo) => normalizeFinishName(photo.finish) === normalizedFinish)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const primary = finishPhotos[0];
  if (primary) {
    return getAppearanceForPhoto(
      primary.id,
      familyId,
      primary.finish,
      primary.appearance,
      appearanceMap
    );
  }

  const legacyKey = photoAppearanceKey(familyId, normalizedFinish);
  return appearanceMap[legacyKey] ?? defaultPhotoAppearance;
}

export function parsePhotoAppearancesMap(
  value: unknown
): Record<string, PhotoAppearance> {
  if (!value || typeof value !== "object") {
    return {};
  }

  const record = value as Record<string, unknown>;
  const result: Record<string, PhotoAppearance> = {};

  for (const [key, appearance] of Object.entries(record)) {
    result[key] = parsePhotoAppearance(appearance);
  }

  return result;
}

export async function loadPhotoAppearancesMap(
  supabase: Supabase
): Promise<Record<string, PhotoAppearance>> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", PHOTO_APPEARANCES_SETTINGS_KEY)
    .maybeSingle();

  return parsePhotoAppearancesMap(data?.value);
}

export async function savePhotoAppearanceForPhoto(
  supabase: Supabase,
  photoId: string,
  appearance: PhotoAppearance
): Promise<{ error?: string }> {
  // Column may be missing if migration not applied yet — site_settings is the source of truth.
  await supabase
    .from("product_photos")
    .update({
      appearance,
      updated_at: new Date().toISOString(),
    })
    .eq("id", photoId);

  const current = await loadPhotoAppearancesMap(supabase);
  const { error } = await supabase.from("site_settings").upsert({
    key: PHOTO_APPEARANCES_SETTINGS_KEY,
    value: {
      ...current,
      [photoAppearancePhotoKey(photoId)]: appearance,
    },
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}

/** @deprecated Use savePhotoAppearanceForPhoto */
export async function savePhotoAppearanceForFinish(
  supabase: Supabase,
  familyId: string,
  finish: string,
  appearance: PhotoAppearance
): Promise<{ error?: string }> {
  const current = await loadPhotoAppearancesMap(supabase);
  const key = photoAppearanceKey(familyId, finish);

  const { error } = await supabase.from("site_settings").upsert({
    key: PHOTO_APPEARANCES_SETTINGS_KEY,
    value: {
      ...current,
      [key]: appearance,
    },
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}

export function getAppearanceForPhoto(
  photoId: string | undefined,
  familyId: string,
  finish: string,
  columnValue: unknown,
  settingsMap: Record<string, PhotoAppearance>
): PhotoAppearance {
  if (photoId) {
    const fromPhotoSettings = settingsMap[photoAppearancePhotoKey(photoId)];
    if (fromPhotoSettings) {
      return fromPhotoSettings;
    }
  }

  if (columnValue) {
    return parsePhotoAppearance(columnValue);
  }

  const legacyKey = photoAppearanceKey(familyId, normalizeFinishName(finish));
  const fromLegacy = settingsMap[legacyKey];
  if (fromLegacy) {
    return fromLegacy;
  }

  return defaultPhotoAppearance;
}
