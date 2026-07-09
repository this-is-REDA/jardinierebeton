"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PhotoAppearanceEditor } from "@/components/admin/PhotoAppearanceEditor";
import {
  defaultPhotoAppearance,
  photoAppearanceClassName,
  photoAppearanceStyle,
  type PhotoAppearance,
} from "@/lib/photo-appearance";
import {
  getAppearanceForPhoto,
  getFinishGroupAppearance,
  loadPhotoAppearancesMap,
  normalizeFinishName,
  savePhotoAppearanceForPhoto,
} from "@/lib/photo-appearance-store";
import { finishes as staticFinishes } from "@/lib/data/site-data";
import type { ProductFamily, ProductPhotoRow, FinishRow } from "@/types/database";
import { ArrowDown, ArrowUp } from "lucide-react";

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminFamiliesManager({
  onDataChange,
}: {
  onDataChange?: () => void;
}) {
  const [families, setFamilies] = useState<ProductFamily[]>([]);
  const [variantCounts, setVariantCounts] = useState<Record<string, number>>({});
  const [photoCounts, setPhotoCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [newFamilyName, setNewFamilyName] = useState("");

  async function loadData() {
    const supabase = createSupabaseBrowserClient();
    const [{ data: f }, { data: v }, { data: p }] = await Promise.all([
      supabase.from("product_families").select("*").order("sort_order"),
      supabase.from("product_variants").select("family_id"),
      supabase.from("product_photos").select("family_id"),
    ]);
    setFamilies(f ?? []);

    const vCounts: Record<string, number> = {};
    (v ?? []).forEach((row) => {
      vCounts[row.family_id] = (vCounts[row.family_id] ?? 0) + 1;
    });
    setVariantCounts(vCounts);

    const pCounts: Record<string, number> = {};
    (p ?? []).forEach((row) => {
      pCounts[row.family_id] = (pCounts[row.family_id] ?? 0) + 1;
    });
    setPhotoCounts(pCounts);

    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const supabase = createSupabaseBrowserClient();
      const [{ data: f }, { data: v }, { data: p }] = await Promise.all([
        supabase.from("product_families").select("*").order("sort_order"),
        supabase.from("product_variants").select("family_id"),
        supabase.from("product_photos").select("family_id"),
      ]);
      if (cancelled) return;
      setFamilies(f ?? []);

      const vCounts: Record<string, number> = {};
      (v ?? []).forEach((row) => {
        vCounts[row.family_id] = (vCounts[row.family_id] ?? 0) + 1;
      });
      setVariantCounts(vCounts);

      const pCounts: Record<string, number> = {};
      (p ?? []).forEach((row) => {
        pCounts[row.family_id] = (pCounts[row.family_id] ?? 0) + 1;
      });
      setPhotoCounts(pCounts);

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function notifyChange() {
    onDataChange?.();
  }

  async function addFamily(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const name = newFamilyName.trim();
    if (!name) return;

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("product_families").insert({
      name,
      slug: slugify(name),
      sort_order: families.length + 1,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setNewFamilyName("");
    setMessage(
      "Gamme ajoutée. Un nouveau tableau est disponible dans la section Tarifs."
    );
    await loadData();
    notifyChange();
  }

  async function updateFamily(id: string, name: string) {
    setMessage("");

    const trimmed = name.trim();
    if (!trimmed) {
      setMessage("Indiquez un nom de gamme.");
      return false;
    }

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("product_families")
      .update({
        name: trimmed,
        slug: slugify(trimmed),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return false;
    }

    setMessage("Gamme modifiée.");
    await loadData();
    notifyChange();
    return true;
  }

  async function deleteFamily(id: string, name: string) {
    if (!confirm(`Supprimer la gamme « ${name} » et tous ses modèles ?`)) return;

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("product_families").delete().eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Gamme supprimée.");
    await loadData();
    notifyChange();
  }

  if (loading) {
    return <p className="text-[#a3a3a3]">Chargement...</p>;
  }

  return (
    <div className="space-y-8">
      <form onSubmit={addFamily} className="admin-card space-y-4">
        <h2 className="font-serif text-xl text-[#171717]">Ajouter une gamme</h2>
        <p className="text-sm text-[#a3a3a3]">
          Ex. Jardinière Ronde, Bac Modulaire… Elle apparaîtra sur la page
          produits et un nouveau tableau sera créé dans{" "}
          <Link href="/admin/products" className="text-[#171717] hover:text-[#000000]">
            Tarifs
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-3">
          <input
            className="input-field max-w-md flex-1"
            placeholder="Nom de la gamme"
            value={newFamilyName}
            onChange={(e) => setNewFamilyName(e.target.value)}
            required
          />
          <button type="submit" className="admin-btn admin-btn-primary">
            + Ajouter la gamme
          </button>
        </div>
      </form>

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-card">
        <h2 className="font-serif text-xl text-[#171717]">Gammes existantes</h2>
        {families.length === 0 ? (
          <p className="mt-4 text-sm text-[#a3a3a3]">Aucune gamme pour le moment.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {families.map((family) => (
              <FamilyRow
                key={family.id}
                family={family}
                modelCount={variantCounts[family.id] ?? 0}
                photoCount={photoCounts[family.id] ?? 0}
                onUpdate={updateFamily}
                onDelete={deleteFamily}
                onChanged={async () => {
                  await loadData();
                  notifyChange();
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FamilyRow({
  family,
  modelCount,
  photoCount,
  onUpdate,
  onDelete,
  onChanged,
}: {
  family: ProductFamily;
  modelCount: number;
  photoCount: number;
  onUpdate: (id: string, name: string) => Promise<boolean>;
  onDelete: (id: string, name: string) => void;
  onChanged: () => Promise<void>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(family.name);
  const [savingName, setSavingName] = useState(false);
  const [photos, setPhotos] = useState<ProductPhotoRow[]>([]);
  const [finishes, setFinishes] = useState<FinishRow[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [panelMessage, setPanelMessage] = useState("");
  const [newFinish, setNewFinish] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [newAppearance, setNewAppearance] = useState<PhotoAppearance>(defaultPhotoAppearance);
  const [appearanceMap, setAppearanceMap] = useState<Record<string, PhotoAppearance>>({});
  const [editingAppearanceId, setEditingAppearanceId] = useState<string | null>(null);
  const [appearanceDraft, setAppearanceDraft] = useState<PhotoAppearance>(defaultPhotoAppearance);
  const [savingAppearance, setSavingAppearance] = useState(false);
  const [uploading, setUploading] = useState(false);

  const photosByFinish = finishes
    .map((finish) => ({
      finish: finish.name,
      photos: photos.filter(
        (photo) => normalizeFinishName(photo.finish) === normalizeFinishName(finish.name)
      ),
    }))
    .filter((group) => group.photos.length > 0);

  const orphanFinishPhotos = photos.filter(
    (photo) =>
      !finishes.some(
        (finish) =>
          normalizeFinishName(finish.name) === normalizeFinishName(photo.finish)
      )
  );
  const groupedPhotos = (
    orphanFinishPhotos.length === 0
      ? photosByFinish
      : [
          ...photosByFinish,
          ...Object.entries(
            orphanFinishPhotos.reduce<Record<string, ProductPhotoRow[]>>(
              (acc, photo) => {
                (acc[photo.finish] ??= []).push(photo);
                return acc;
              },
              {}
            )
          ).map(([finish, groupPhotos]) => ({ finish, photos: groupPhotos })),
        ]
  ).map((group) => ({
    ...group,
    photos: [...group.photos].sort((a, b) => a.sort_order - b.sort_order),
  }));

  const previewAspectClass = family.slug.includes("carree")
    ? "aspect-square"
    : "aspect-[4/3]";

  const existingFinishPhotos = photos.filter(
    (photo) => normalizeFinishName(photo.finish) === normalizeFinishName(newFinish)
  );

  function appearanceForFinish(finishName: string): PhotoAppearance {
    return getFinishGroupAppearance(family.id, finishName, photos, appearanceMap);
  }

  useEffect(() => {
    if (!editing || !newFinish) return;
    setNewAppearance(appearanceForFinish(newFinish));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, newFinish, photos, appearanceMap]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  function clearSelectedFiles() {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    setNewAppearance(appearanceForFinish(newFinish));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function loadFamilyData() {
    setLoadingPhotos(true);
    const supabase = createSupabaseBrowserClient();
    const [{ data: p }, { data: fin }, appearances] = await Promise.all([
      supabase
        .from("product_photos")
        .select("*")
        .eq("family_id", family.id)
        .order("sort_order"),
      supabase.from("finishes").select("*").order("sort_order"),
      loadPhotoAppearancesMap(supabase),
    ]);

    const finishList =
      fin?.length
        ? fin
        : staticFinishes.map((item, index) => ({
            id: item.name,
            name: item.name,
            hex: item.hex,
            sort_order: index + 1,
          }));

    setPhotos(p ?? []);
    setAppearanceMap(appearances);
    setFinishes(finishList);
    if (finishList.length && !newFinish) {
      setNewFinish(finishList[0].name);
    }
    setLoadingPhotos(false);
  }

  async function openEdit() {
    setName(family.name);
    setEditing(true);
    setPanelMessage("");
    await loadFamilyData();
  }

  function closeEdit() {
    clearSelectedFiles();
    setEditingAppearanceId(null);
    setAppearanceDraft(defaultPhotoAppearance);
    setPanelMessage("");
    setEditing(false);
    setName(family.name);
  }

  async function handleSaveName() {
    setSavingName(true);
    const ok = await onUpdate(family.id, name);
    setSavingName(false);
    if (ok) setPanelMessage("Nom de la gamme enregistré.");
  }

  async function updatePhotoFinish(photoId: string, finish: string) {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("product_photos")
      .update({
        finish: normalizeFinishName(finish),
        updated_at: new Date().toISOString(),
      })
      .eq("id", photoId);

    if (error) {
      setPanelMessage(error.message);
      return;
    }

    await loadFamilyData();
    await onChanged();
  }

  async function deletePhoto(photoId: string) {
    if (!confirm("Supprimer cette photo ?")) return;

    const supabase = createSupabaseBrowserClient();
    await supabase.from("product_photos").delete().eq("id", photoId);
    await loadFamilyData();
    await onChanged();
    setPanelMessage("Photo supprimée.");
  }

  async function movePhoto(photoId: string, direction: "up" | "down") {
    const photo = photos.find((item) => item.id === photoId);
    if (!photo) return;

    const siblings = photos
      .filter(
        (item) =>
          normalizeFinishName(item.finish) === normalizeFinishName(photo.finish)
      )
      .sort((a, b) => a.sort_order - b.sort_order);
    const index = siblings.findIndex((item) => item.id === photoId);
    const swapWith = direction === "up" ? siblings[index - 1] : siblings[index + 1];
    if (!swapWith) return;

    const supabase = createSupabaseBrowserClient();
    const now = new Date().toISOString();
    const { error: firstError } = await supabase
      .from("product_photos")
      .update({ sort_order: swapWith.sort_order, updated_at: now })
      .eq("id", photo.id);
    const { error: secondError } = await supabase
      .from("product_photos")
      .update({ sort_order: photo.sort_order, updated_at: now })
      .eq("id", swapWith.id);

    if (firstError || secondError) {
      setPanelMessage(firstError?.message ?? secondError?.message ?? "Erreur de tri.");
      return;
    }

    await loadFamilyData();
    await onChanged();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((file) =>
      file.type.startsWith("image/")
    );
    if (!files.length) {
      setPanelMessage("Veuillez sélectionner des images (JPG, PNG, WebP…).");
      return;
    }

    clearSelectedFiles();
    setSelectedFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    setPanelMessage("");
  }

  async function savePhotoAppearance(photoId: string) {
    setSavingAppearance(true);
    setPanelMessage("");

    const supabase = createSupabaseBrowserClient();
    const result = await savePhotoAppearanceForPhoto(
      supabase,
      photoId,
      appearanceDraft
    );

    setSavingAppearance(false);

    if (result.error) {
      setPanelMessage(result.error);
      return;
    }

    setAppearanceMap((current) => ({
      ...current,
      [photoId]: appearanceDraft,
    }));
    setEditingAppearanceId(null);
    await loadFamilyData();
    await onChanged();
    setPanelMessage("Apparence enregistrée.");
  }

  async function addPhoto(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFiles.length) {
      setPanelMessage("Choisissez une ou plusieurs photos.");
      return;
    }

    setUploading(true);
    setPanelMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const normalizedFinish = normalizeFinishName(newFinish);
      const finishPhotos = photos.filter(
        (photo) => normalizeFinishName(photo.finish) === normalizedFinish
      );
      const appearanceToApply = newAppearance;
      let nextSortOrder =
        finishPhotos.reduce((max, photo) => Math.max(max, photo.sort_order), 0) +
        1;
      const insertedIds: string[] = [];

      for (const file of selectedFiles) {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, file, {
            upsert: false,
            contentType: file.type || `image/${ext === "jpg" ? "jpeg" : ext}`,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);

        const { data: inserted, error: insertError } = await supabase
          .from("product_photos")
          .insert({
            family_id: family.id,
            finish: normalizedFinish,
            image_url: urlData.publicUrl,
            sort_order: nextSortOrder,
          })
          .select("id")
          .single();

        if (insertError) throw insertError;
        if (inserted?.id) insertedIds.push(inserted.id);
        nextSortOrder += 1;
      }

      let appearanceError: string | undefined;
      for (const photoId of insertedIds) {
        const appearanceResult = await savePhotoAppearanceForPhoto(
          supabase,
          photoId,
          appearanceToApply
        );
        if (appearanceResult.error) {
          appearanceError = appearanceResult.error;
        }
      }

      if (appearanceError) {
        setPanelMessage(
          `${selectedFiles.length} photo${selectedFiles.length > 1 ? "s" : ""} ajoutée${selectedFiles.length > 1 ? "s" : ""}, mais l'apparence n'a pas pu être enregistrée : ${appearanceError}`
        );
      } else {
        setPanelMessage(
          `${selectedFiles.length} photo${selectedFiles.length > 1 ? "s" : ""} ajoutée${selectedFiles.length > 1 ? "s" : ""} à la galerie ${normalizedFinish} (${finishPhotos.length + selectedFiles.length} image${finishPhotos.length + selectedFiles.length > 1 ? "s" : ""} sur le site).`
        );
      }

      clearSelectedFiles();
      await loadFamilyData();
      await onChanged();
    } catch (err) {
      setPanelMessage(err instanceof Error ? err.message : "Erreur lors de l'ajout.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="border border-[rgba(0, 0, 0,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div>
          <p className="font-serif text-lg text-[#171717]">{family.name}</p>
          <p className="mt-1 text-xs text-[#a3a3a3]">
            {modelCount} modèle{modelCount > 1 ? "s" : ""} · {photoCount} photo
            {photoCount > 1 ? "s" : ""} · {family.slug}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!editing && (
            <>
              <button
                type="button"
                onClick={openEdit}
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                Modifier
              </button>
              <Link
                href="/admin/products"
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                Gérer les tarifs →
              </Link>
              <button
                type="button"
                onClick={() => onDelete(family.id, family.name)}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                Supprimer
              </button>
            </>
          )}
          {editing && (
            <button
              type="button"
              onClick={closeEdit}
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              Fermer
            </button>
          )}
        </div>
      </div>

      {editing && (
        <div className="space-y-6 border-t border-[rgba(0, 0, 0,0.08)] px-4 py-6">
          <div>
            <label className="label-caps mb-2 block">Nom de la gamme</label>
            <div className="flex flex-wrap gap-3">
              <input
                className="input-field max-w-md flex-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSaveName}
                disabled={savingName}
                className="admin-btn admin-btn-primary admin-btn-sm"
              >
                {savingName ? "..." : "Enregistrer le nom"}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg text-[#171717]">Photos de la gamme</h3>
            <p className="mt-1 text-sm text-[#a3a3a3]">
              Plusieurs images par finition — la première devient l&apos;image
              principale sur le site.
            </p>
            {loadingPhotos ? (
              <p className="mt-3 text-sm text-[#a3a3a3]">Chargement...</p>
            ) : photos.length === 0 ? (
              <p className="mt-3 text-sm text-[#a3a3a3]">Aucune photo pour cette gamme.</p>
            ) : (
              <div className="mt-4 space-y-8">
                {groupedPhotos.map((group) => (
                  <div key={group.finish}>
                    <div className="mb-3 flex items-center gap-2">
                      <p className="font-medium text-[#171717]">{group.finish}</p>
                      <span className="text-xs text-[#a3a3a3]">
                        {group.photos.length} image
                        {group.photos.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {group.photos.map((photo, index) => {
                        const appearance = getAppearanceForPhoto(
                          photo.id,
                          family.id,
                          photo.finish,
                          photo.appearance,
                          appearanceMap
                        );
                        const isEditingAppearance = editingAppearanceId === photo.id;

                        return (
                          <div
                            key={photo.id}
                            className="border border-[rgba(0, 0, 0,0.08)] p-3"
                          >
                            <div
                              className={`relative overflow-hidden bg-[#f5f5f5] ${previewAspectClass}`}
                            >
                              <Image
                                src={photo.image_url}
                                alt={`${photo.finish} — ${index + 1}`}
                                fill
                                className={photoAppearanceClassName(appearance.fit)}
                                style={photoAppearanceStyle(appearance)}
                                sizes="240px"
                                unoptimized={photo.image_url.includes("supabase.co")}
                              />
                              {index === 0 && (
                                <span className="absolute top-2 left-2 rounded-sm bg-[#171717] px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.08em] text-white uppercase">
                                  Principale
                                </span>
                              )}
                            </div>
                            <label className="label-caps mb-1 mt-3 block">Finition</label>
                            <select
                              className="input-field"
                              value={photo.finish}
                              onChange={(e) =>
                                updatePhotoFinish(photo.id, e.target.value)
                              }
                            >
                              {finishes.map((f) => (
                                <option
                                  key={f.id}
                                  value={f.name}
                                  className="bg-[#f5f5f5]"
                                >
                                  {f.name}
                                </option>
                              ))}
                            </select>

                            <div className="mt-3 flex gap-2">
                              <button
                                type="button"
                                onClick={() => movePhoto(photo.id, "up")}
                                disabled={index === 0}
                                className="admin-btn admin-btn-secondary admin-btn-sm flex-1"
                                aria-label="Monter"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => movePhoto(photo.id, "down")}
                                disabled={index === group.photos.length - 1}
                                className="admin-btn admin-btn-secondary admin-btn-sm flex-1"
                                aria-label="Descendre"
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>

                            {isEditingAppearance ? (
                              <div className="mt-4 border-t border-[rgba(0,0,0,0.08)] pt-4">
                                <PhotoAppearanceEditor
                                  imageUrl={photo.image_url}
                                  alt={photo.finish}
                                  appearance={appearanceDraft}
                                  onChange={setAppearanceDraft}
                                  aspectClass={previewAspectClass}
                                />
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => savePhotoAppearance(photo.id)}
                                    disabled={savingAppearance}
                                    className="admin-btn admin-btn-primary admin-btn-sm"
                                  >
                                    {savingAppearance
                                      ? "..."
                                      : "Enregistrer l'apparence"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingAppearanceId(null)}
                                    className="admin-btn admin-btn-secondary admin-btn-sm"
                                  >
                                    Annuler
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAppearanceId(photo.id);
                                  setAppearanceDraft(appearance);
                                }}
                                className="admin-btn admin-btn-secondary admin-btn-sm mt-3 w-full"
                              >
                                Modifier l&apos;apparence
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => deletePhoto(photo.id)}
                              className="admin-btn admin-btn-danger admin-btn-sm mt-3 w-full"
                            >
                              Supprimer
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={addPhoto} className="border border-[rgba(0, 0, 0,0.08)] p-4">
            <h3 className="font-serif text-lg text-[#171717]">
              Ajouter des images à une finition
            </h3>
            <p className="mt-1 text-sm text-[#a3a3a3]">
              Les nouvelles photos rejoignent la galerie de la couleur choisie sur
              le site, avec le même cadrage que les images existantes.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-caps mb-2 block">Finition</label>
                <select
                  className="input-field"
                  value={newFinish}
                  onChange={(e) => setNewFinish(e.target.value)}
                >
                  {finishes.map((f) => (
                    <option key={f.id} value={f.name} className="bg-[#f5f5f5]">
                      {f.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-[#a3a3a3]">
                  {existingFinishPhotos.length > 0
                    ? `${existingFinishPhotos.length} image${existingFinishPhotos.length > 1 ? "s" : ""} déjà en ligne pour cette couleur — la nouvelle s'ajoute à la suite.`
                    : "Première image pour cette couleur sur le site."}
                </p>
              </div>
              <div>
                <label className="label-caps mb-2 block">Fichiers</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="admin-btn admin-btn-secondary w-full sm:w-auto"
                >
                  Choisir une ou plusieurs photos
                </button>
                {selectedFiles.length > 0 && (
                  <p className="mt-2 text-xs text-[#a3a3a3]">
                    {selectedFiles.length} fichier
                    {selectedFiles.length > 1 ? "s" : ""} sélectionné
                    {selectedFiles.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>

            {previewUrls.length > 0 && (
              <div className="mt-4 space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {previewUrls.map((url, index) => (
                    <div
                      key={url}
                      className={`relative overflow-hidden border border-[rgba(0,0,0,0.08)] bg-[#f5f5f5] ${previewAspectClass}`}
                    >
                      <Image
                        src={url}
                        alt={`Aperçu ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="200px"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
                <PhotoAppearanceEditor
                  imageUrl={previewUrls[0]}
                  alt="Aperçu"
                  appearance={newAppearance}
                  onChange={setNewAppearance}
                  aspectClass={previewAspectClass}
                  previewLabel={
                    existingFinishPhotos.length > 0
                      ? "Aperçu — même cadrage que les photos existantes de cette couleur"
                      : "Aperçu — réglages appliqués sur le site"
                  }
                />
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || selectedFiles.length === 0}
              className="admin-btn admin-btn-primary mt-4"
            >
              {uploading
                ? "Envoi..."
                : selectedFiles.length > 1
                  ? `Ajouter ${selectedFiles.length} photos`
                  : "Ajouter la photo"}
            </button>
          </form>

          {panelMessage && <p className="admin-message">{panelMessage}</p>}
        </div>
      )}
    </div>
  );
}
