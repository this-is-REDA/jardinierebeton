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
  loadPhotoAppearancesMap,
  savePhotoAppearanceForFinish,
} from "@/lib/photo-appearance-store";
import { finishes as staticFinishes } from "@/lib/data/site-data";
import type { ProductFamily, ProductPhotoRow, FinishRow } from "@/types/database";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newAppearance, setNewAppearance] = useState<PhotoAppearance>(defaultPhotoAppearance);
  const [appearanceMap, setAppearanceMap] = useState<Record<string, PhotoAppearance>>({});
  const [editingAppearanceId, setEditingAppearanceId] = useState<string | null>(null);
  const [appearanceDraft, setAppearanceDraft] = useState<PhotoAppearance>(defaultPhotoAppearance);
  const [savingAppearance, setSavingAppearance] = useState(false);
  const [uploading, setUploading] = useState(false);

  const previewAspectClass = family.slug.includes("carree")
    ? "aspect-square"
    : "aspect-[4/3]";

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setNewAppearance(defaultPhotoAppearance);
    setEditingAppearanceId(null);
    setAppearanceDraft(defaultPhotoAppearance);
    setPanelMessage("");
    setEditing(false);
    setName(family.name);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      .update({ finish, updated_at: new Date().toISOString() })
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

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPanelMessage("Veuillez sélectionner une image (JPG, PNG, WebP…).");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setNewAppearance(defaultPhotoAppearance);
    setPanelMessage("");
  }

  async function savePhotoAppearance(photoId: string) {
    const photo = photos.find((item) => item.id === photoId);
    if (!photo) return;

    setSavingAppearance(true);
    setPanelMessage("");

    const supabase = createSupabaseBrowserClient();
    const result = await savePhotoAppearanceForFinish(
      supabase,
      family.id,
      photo.finish,
      appearanceDraft
    );

    setSavingAppearance(false);

    if (result.error) {
      setPanelMessage(result.error);
      return;
    }

    setAppearanceMap((current) => ({
      ...current,
      [`${family.id}:${photo.finish}`]: appearanceDraft,
    }));
    setEditingAppearanceId(null);
    await onChanged();
    setPanelMessage("Apparence enregistrée.");
  }

  async function addPhoto(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      setPanelMessage("Choisissez une photo.");
      return;
    }

    setUploading(true);
    setPanelMessage("");

    try {
      const supabase = createSupabaseBrowserClient();

      const { data: existingPhotos } = await supabase
        .from("product_photos")
        .select("id, image_url")
        .eq("family_id", family.id)
        .eq("finish", newFinish);

      if (existingPhotos?.length) {
        await supabase
          .from("product_photos")
          .delete()
          .eq("family_id", family.id)
          .eq("finish", newFinish);
      }

      const ext = selectedFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, selectedFile, {
          upsert: false,
          contentType: selectedFile.type || `image/${ext === "jpg" ? "jpeg" : ext}`,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

      const { error: insertError } = await supabase.from("product_photos").insert({
        family_id: family.id,
        finish: newFinish,
        image_url: urlData.publicUrl,
        sort_order: photos.length + 1,
      });

      if (insertError) throw insertError;

      const appearanceResult = await savePhotoAppearanceForFinish(
        supabase,
        family.id,
        newFinish,
        newAppearance
      );

      if (appearanceResult.error) {
        setPanelMessage(
          `Photo ajoutée, mais l'apparence n'a pas pu être enregistrée : ${appearanceResult.error}`
        );
      } else {
        setAppearanceMap((current) => ({
          ...current,
          [`${family.id}:${newFinish}`]: newAppearance,
        }));
        setPanelMessage("Photo ajoutée.");
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(null);
      setPreviewUrl(null);
      setNewAppearance(defaultPhotoAppearance);
      if (fileInputRef.current) fileInputRef.current.value = "";

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
            {loadingPhotos ? (
              <p className="mt-3 text-sm text-[#a3a3a3]">Chargement...</p>
            ) : photos.length === 0 ? (
              <p className="mt-3 text-sm text-[#a3a3a3]">Aucune photo pour cette gamme.</p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((photo) => {
                  const appearance = getAppearanceForPhoto(
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
                    <div className={`relative overflow-hidden bg-[#f5f5f5] ${previewAspectClass}`}>
                      <Image
                        src={photo.image_url}
                        alt={photo.finish}
                        fill
                        className={photoAppearanceClassName(appearance.fit)}
                        style={photoAppearanceStyle(appearance)}
                        sizes="240px"
                        unoptimized={photo.image_url.includes("supabase.co")}
                      />
                    </div>
                    <label className="label-caps mb-1 mt-3 block">Finition</label>
                    <select
                      className="input-field"
                      value={photo.finish}
                      onChange={(e) => updatePhotoFinish(photo.id, e.target.value)}
                    >
                      {finishes.map((f) => (
                        <option key={f.id} value={f.name} className="bg-[#f5f5f5]">
                          {f.name}
                        </option>
                      ))}
                    </select>

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
                            {savingAppearance ? "..." : "Enregistrer l'apparence"}
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
            )}
          </div>

          <form onSubmit={addPhoto} className="border border-[rgba(0, 0, 0,0.08)] p-4">
            <h3 className="font-serif text-lg text-[#171717]">Ajouter une photo</h3>
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
              </div>
              <div>
                <label className="label-caps mb-2 block">Fichier</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="admin-btn admin-btn-secondary w-full sm:w-auto"
                >
                  Choisir une photo
                </button>
                {selectedFile && (
                  <p className="mt-2 text-xs text-[#a3a3a3]">{selectedFile.name}</p>
                )}
              </div>
            </div>

            {previewUrl && (
              <PhotoAppearanceEditor
                imageUrl={previewUrl}
                alt="Aperçu"
                appearance={newAppearance}
                onChange={setNewAppearance}
                aspectClass={previewAspectClass}
                previewLabel="Aperçu — réglages appliqués sur le site"
              />
            )}

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="admin-btn admin-btn-primary mt-4"
            >
              {uploading ? "Envoi..." : "Ajouter la photo"}
            </button>
          </form>

          {panelMessage && <p className="admin-message">{panelMessage}</p>}
        </div>
      )}
    </div>
  );
}
