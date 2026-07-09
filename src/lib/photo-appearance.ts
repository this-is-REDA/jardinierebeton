import type { CSSProperties } from "react";

export type PhotoFit = "contain" | "cover";

export type PhotoAppearance = {
  fit: PhotoFit;
  scale: number;
  positionX: number;
  positionY: number;
};

export const defaultPhotoAppearance: PhotoAppearance = {
  fit: "contain",
  scale: 100,
  positionX: 50,
  positionY: 50,
};

export function parsePhotoAppearance(value: unknown): PhotoAppearance {
  if (!value || typeof value !== "object") {
    return defaultPhotoAppearance;
  }

  const record = value as Record<string, unknown>;

  return {
    fit: record.fit === "cover" ? "cover" : "contain",
    scale:
      typeof record.scale === "number"
        ? Math.min(200, Math.max(50, record.scale))
        : defaultPhotoAppearance.scale,
    positionX:
      typeof record.positionX === "number"
        ? Math.min(100, Math.max(0, record.positionX))
        : defaultPhotoAppearance.positionX,
    positionY:
      typeof record.positionY === "number"
        ? Math.min(100, Math.max(0, record.positionY))
        : defaultPhotoAppearance.positionY,
  };
}

export function photoAppearanceClassName(fit: PhotoFit): string {
  return fit === "cover" ? "object-cover" : "object-contain";
}

export function photoAppearanceImageStyle(
  appearance: PhotoAppearance
): CSSProperties {
  return {
    objectPosition: `${appearance.positionX}% ${appearance.positionY}%`,
  };
}

export function photoAppearanceWrapperStyle(
  appearance: PhotoAppearance
): CSSProperties {
  return {
    transform:
      appearance.scale !== 100 ? `scale(${appearance.scale / 100})` : undefined,
    transformOrigin: `${appearance.positionX}% ${appearance.positionY}%`,
  };
}

/** @deprecated Prefer photoAppearanceImageStyle + photoAppearanceWrapperStyle */
export function photoAppearanceStyle(appearance: PhotoAppearance): CSSProperties {
  return {
    ...photoAppearanceImageStyle(appearance),
    ...photoAppearanceWrapperStyle(appearance),
  };
}
