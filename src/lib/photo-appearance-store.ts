import type { SupabaseClient } from "@supabase/supabase-js";
import {
  defaultPhotoAppearance,
  parsePhotoAppearance,
  type PhotoAppearance,
} from "@/lib/photo-appearance";
import type { Database } from "@/types/database";

export const PHOTO_APPEARANCES_SETTINGS_KEY = "photo_appearances";

type Supabase = SupabaseClient<Database>;

export function photoAppearanceKey(familyId: string, finish: string): string {
  return `${familyId}:${finish}`;
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
  familyId: string,
  finish: string,
  columnValue: unknown,
  settingsMap: Record<string, PhotoAppearance>
): PhotoAppearance {
  const key = photoAppearanceKey(familyId, finish);
  const fromSettings = settingsMap[key];

  if (fromSettings) {
    return fromSettings;
  }

  if (columnValue) {
    return parsePhotoAppearance(columnValue);
  }

  return defaultPhotoAppearance;
}
