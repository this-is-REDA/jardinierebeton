"use client";

import Image from "next/image";
import {
  defaultPhotoAppearance,
  photoAppearanceClassName,
  photoAppearanceStyle,
  type PhotoAppearance,
} from "@/lib/photo-appearance";

type PhotoAppearanceEditorProps = {
  imageUrl: string;
  alt: string;
  appearance: PhotoAppearance;
  onChange: (appearance: PhotoAppearance) => void;
  aspectClass?: string;
  previewLabel?: string;
};

export function PhotoAppearanceEditor({
  imageUrl,
  alt,
  appearance,
  onChange,
  aspectClass = "aspect-[4/3]",
  previewLabel = "Aperçu sur le site",
}: PhotoAppearanceEditorProps) {
  function update<K extends keyof PhotoAppearance>(key: K, value: PhotoAppearance[K]) {
    onChange({ ...appearance, [key]: value });
  }

  function applyPreset(positionX: number, positionY: number) {
    onChange({ ...appearance, positionX, positionY });
  }

  return (
    <div className="mt-4 space-y-4">
      <div>
        <p className="label-caps mb-2">{previewLabel}</p>
        <div
          className={`product-card-image relative max-w-md overflow-hidden border border-[rgba(0,0,0,0.12)] bg-[#f5f5f5] ${aspectClass}`}
        >
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className={`transition ${photoAppearanceClassName(appearance.fit)}`}
            style={photoAppearanceStyle(appearance)}
            sizes="400px"
            unoptimized={imageUrl.startsWith("blob:") || imageUrl.includes("supabase.co")}
          />
        </div>
      </div>

      <div className="grid max-w-md gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label-caps mb-2 block">Affichage</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => update("fit", "contain")}
              className={`admin-btn admin-btn-sm ${
                appearance.fit === "contain"
                  ? "admin-btn-primary"
                  : "admin-btn-secondary"
              }`}
            >
              Image entière
            </button>
            <button
              type="button"
              onClick={() => update("fit", "cover")}
              className={`admin-btn admin-btn-sm ${
                appearance.fit === "cover"
                  ? "admin-btn-primary"
                  : "admin-btn-secondary"
              }`}
            >
              Remplir le cadre
            </button>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="label-caps mb-2 block">
            Zoom — {appearance.scale}%
          </label>
          <input
            type="range"
            min={50}
            max={200}
            step={5}
            value={appearance.scale}
            onChange={(e) => update("scale", Number(e.target.value))}
            className="w-full accent-[#171717]"
          />
        </div>

        <div>
          <label className="label-caps mb-2 block">
            Position horizontale — {appearance.positionX}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={appearance.positionX}
            onChange={(e) => update("positionX", Number(e.target.value))}
            className="w-full accent-[#171717]"
          />
        </div>

        <div>
          <label className="label-caps mb-2 block">
            Position verticale — {appearance.positionY}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={appearance.positionY}
            onChange={(e) => update("positionY", Number(e.target.value))}
            className="w-full accent-[#171717]"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label-caps mb-2 block">Raccourcis position</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Centre", x: 50, y: 50 },
              { label: "Haut", x: 50, y: 0 },
              { label: "Bas", x: 50, y: 100 },
              { label: "Gauche", x: 0, y: 50 },
              { label: "Droite", x: 100, y: 50 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset.x, preset.y)}
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onChange(defaultPhotoAppearance)}
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
