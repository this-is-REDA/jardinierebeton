"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { finishes as staticFinishes } from "@/lib/data/site-data";
import {
  getFinishGroupAppearance,
  loadPhotoAppearancesMap,
  normalizeFinishName,
  savePhotoAppearanceForPhoto,
} from "@/lib/photo-appearance-store";
import type { ProductFamily, ProductPhotoRow, FinishRow } from "@/types/database";

export function AdminPhotosManager({
  mode = "full",
}: {
  mode?: "full" | "form" | "list";
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [families, setFamilies] = useState<ProductFamily[]>([]);
  const [finishes, setFinishes] = useState<FinishRow[]>([]);
  const [photos, setPhotos] = useState<ProductPhotoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [finish, setFinish] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [appearanceMap, setAppearanceMap] = useState<
    Record<string, import("@/lib/photo-appearance").PhotoAppearance>
  >({});

  const existingFinishPhotos = photos.filter(
    (photo) =>
      photo.family_id === familyId &&
      normalizeFinishName(photo.finish) === normalizeFinishName(finish)
  );

  async function loadData() {
    const supabase = createSupabaseBrowserClient();
    const [{ data: f }, { data: p }, { data: fin }, appearances] = await Promise.all([
      supabase.from("product_families").select("*").order("sort_order"),
      supabase.from("product_photos").select("*").order("sort_order"),
      supabase.from("finishes").select("*").order("sort_order"),
      loadPhotoAppearancesMap(supabase),
    ]);
    setFamilies(f ?? []);
    setPhotos(p ?? []);
    setAppearanceMap(appearances);
    const finishList =
      fin?.length
        ? fin
        : staticFinishes.map((item, index) => ({
            id: item.name,
            name: item.name,
            hex: item.hex,
            sort_order: index + 1,
          }));
    setFinishes(finishList);
    if (f?.length && !familyId) {
      setFamilyId(f[0].id);
    }
    if (finishList.length && !finish) {
      setFinish(finishList[0].name);
    }
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const supabase = createSupabaseBrowserClient();
      const [{ data: f }, { data: p }, { data: fin }, appearances] = await Promise.all([
        supabase.from("product_families").select("*").order("sort_order"),
        supabase.from("product_photos").select("*").order("sort_order"),
        supabase.from("finishes").select("*").order("sort_order"),
        loadPhotoAppearancesMap(supabase),
      ]);
      if (cancelled) return;
      setFamilies(f ?? []);
      setPhotos(p ?? []);
      setAppearanceMap(appearances);
      const finishList =
        fin?.length
          ? fin
          : staticFinishes.map((item, index) => ({
              id: item.name,
              name: item.name,
              hex: item.hex,
              sort_order: index + 1,
            }));
      setFinishes(finishList);
      if (f?.length && !familyId) {
        setFamilyId(f[0].id);
      }
      if (finishList.length && !finish) {
        setFinish(finishList[0].name);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  function clearSelectedFiles() {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((file) =>
      file.type.startsWith("image/")
    );
    if (!files.length) {
      setMessage("Veuillez sélectionner des images (JPG, PNG, WebP…).");
      return;
    }

    clearSelectedFiles();
    setSelectedFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    setMessage("");
  }

  async function addPhoto(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!selectedFiles.length) {
      setMessage("Choisissez une ou plusieurs photos depuis votre ordinateur.");
      return;
    }

    setUploading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const normalizedFinish = normalizeFinishName(finish);
      const finishPhotos = photos.filter(
        (p) =>
          p.family_id === familyId &&
          normalizeFinishName(p.finish) === normalizedFinish
      );
      const appearanceToApply = getFinishGroupAppearance(
        familyId,
        normalizedFinish,
        finishPhotos,
        appearanceMap
      );
      let nextSortOrder =
        finishPhotos.reduce((max, photo) => Math.max(max, photo.sort_order), 0) +
        1;

      for (const file of selectedFiles) {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, file, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);

        const { data: inserted, error: insertError } = await supabase
          .from("product_photos")
          .insert({
            family_id: familyId,
            finish: normalizedFinish,
            image_url: urlData.publicUrl,
            sort_order: nextSortOrder,
          })
          .select("id")
          .single();

        if (insertError) throw insertError;
        if (inserted?.id) {
          await savePhotoAppearanceForPhoto(supabase, inserted.id, appearanceToApply);
        }
        nextSortOrder += 1;
      }

      clearSelectedFiles();
      setMessage(
        `${selectedFiles.length} photo${selectedFiles.length > 1 ? "s" : ""} ajoutée${selectedFiles.length > 1 ? "s" : ""} à la galerie ${normalizedFinish} (${finishPhotos.length + selectedFiles.length} image${finishPhotos.length + selectedFiles.length > 1 ? "s" : ""} sur le site).`
      );
      await loadData();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erreur lors de l'ajout.");
    } finally {
      setUploading(false);
    }
  }

  async function deletePhoto(id: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    const supabase = createSupabaseBrowserClient();
    await supabase.from("product_photos").delete().eq("id", id);
    await loadData();
  }

  if (loading) {
    return <p className="text-[#a3a3a3]">Chargement...</p>;
  }

  const addPhotoForm = (
    <form onSubmit={addPhoto} className="admin-card space-y-5">
      <h2 className="font-serif text-xl text-[#171717]">
        Ajouter des images à une finition
      </h2>
      <p className="text-sm text-[#a3a3a3]">
        La photo rejoint la galerie de la couleur choisie sur le site, avec le
        même cadrage que les images déjà en ligne.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-caps mb-2 block">Gamme</label>
          <select
            className="input-field"
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
          >
            {families.map((f) => (
              <option key={f.id} value={f.id} className="bg-[#f5f5f5]">
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-caps mb-2 block">Finition</label>
          <select
            className="input-field"
            value={finish}
            onChange={(e) => setFinish(e.target.value)}
            required
          >
            {finishes.map((f) => (
              <option key={f.id} value={f.name} className="bg-[#f5f5f5]">
                {f.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-[#a3a3a3]">
            {existingFinishPhotos.length > 0
              ? `${existingFinishPhotos.length} image${existingFinishPhotos.length > 1 ? "s" : ""} déjà en ligne pour cette couleur.`
              : "Première image pour cette couleur."}
          </p>
        </div>
      </div>

      <div>
        <label className="label-caps mb-2 block">Photos</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="admin-btn admin-btn-secondary"
          >
            Choisir une ou plusieurs photos
          </button>
          {selectedFiles.length > 0 && (
            <>
              <span className="text-sm text-[#a3a3a3]">
                {selectedFiles.length} fichier
                {selectedFiles.length > 1 ? "s" : ""}
              </span>
              <button
                type="button"
                onClick={clearSelectedFiles}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                Retirer
              </button>
            </>
          )}
        </div>
      </div>

      {previewUrls.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          {previewUrls.map((url, index) => (
            <div
              key={url}
              className="relative aspect-[4/3] overflow-hidden border border-[rgba(0, 0, 0,0.12)] bg-[#f5f5f5]"
            >
              <Image
                src={url}
                alt={`Aperçu ${index + 1}`}
                fill
                className="object-cover"
                sizes="200px"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      {message && <p className="admin-message">{message}</p>}

      <button
        type="submit"
        disabled={uploading || selectedFiles.length === 0}
        className="admin-btn admin-btn-primary"
      >
        {uploading
          ? "Envoi en cours..."
          : selectedFiles.length > 1
            ? `Enregistrer ${selectedFiles.length} photos`
            : "Enregistrer la photo"}
      </button>
    </form>
  );

  const photosList = (
    <div className="admin-card">
      <h2 className="font-serif text-xl text-[#171717]">Photos actuelles</h2>
      {photos.length === 0 ? (
        <p className="mt-4 text-sm text-[#a3a3a3]">Aucune photo pour le moment.</p>
      ) : (
        <div className="mt-6 space-y-8">
          {families.map((family) => {
            const familyPhotos = photos.filter((p) => p.family_id === family.id);
            if (!familyPhotos.length) return null;

            const byFinish = familyPhotos.reduce<Record<string, ProductPhotoRow[]>>(
              (acc, photo) => {
                (acc[photo.finish] ??= []).push(photo);
                return acc;
              },
              {}
            );

            return (
              <div key={family.id}>
                <h3 className="font-serif text-lg text-[#171717]">{family.name}</h3>
                <div className="mt-4 space-y-6">
                  {Object.entries(byFinish).map(([finishName, finishPhotos]) => (
                    <div key={finishName}>
                      <p className="text-sm font-medium text-[#525252]">
                        {finishName}{" "}
                        <span className="font-normal text-[#a3a3a3]">
                          · {finishPhotos.length} image
                          {finishPhotos.length > 1 ? "s" : ""}
                        </span>
                      </p>
                      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {finishPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            className="border border-[rgba(0, 0, 0,0.08)] p-4"
                          >
                            <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                              <Image
                                src={photo.image_url}
                                alt={photo.finish}
                                fill
                                className="object-cover"
                                sizes="300px"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => deletePhoto(photo.id)}
                              className="admin-btn admin-btn-danger admin-btn-sm mt-3"
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (mode === "form") {
    return addPhotoForm;
  }

  if (mode === "list") {
    return photosList;
  }

  return (
    <div className="space-y-10">
      {addPhotoForm}
      {photosList}
    </div>
  );
}
