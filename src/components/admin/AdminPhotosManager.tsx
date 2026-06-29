"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { finishes as staticFinishes } from "@/lib/data/site-data";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function loadData() {
    const supabase = createSupabaseBrowserClient();
    const [{ data: f }, { data: p }, { data: fin }] = await Promise.all([
      supabase.from("product_families").select("*").order("sort_order"),
      supabase.from("product_photos").select("*").order("sort_order"),
      supabase.from("finishes").select("*").order("sort_order"),
    ]);
    setFamilies(f ?? []);
    setPhotos(p ?? []);
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
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Veuillez sélectionner une image (JPG, PNG, WebP…).");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage("");
  }

  function clearSelectedFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function addPhoto(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!selectedFile) {
      setMessage("Choisissez une photo depuis votre ordinateur.");
      return;
    }

    setUploading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const ext = selectedFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, selectedFile, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

      const nextSortOrder =
        photos.filter((p) => p.family_id === familyId).length + 1;

      const { error: insertError } = await supabase.from("product_photos").insert({
        family_id: familyId,
        finish,
        image_url: urlData.publicUrl,
        sort_order: nextSortOrder,
      });

      if (insertError) throw insertError;

      setFinish(finishes[0]?.name ?? "");
      clearSelectedFile();
      setMessage("Photo ajoutée au site.");
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
    return <p className="text-[#a6917c]">Chargement...</p>;
  }

  const addPhotoForm = (
    <form onSubmit={addPhoto} className="admin-card space-y-5">
      <h2 className="font-serif text-xl text-[#e8e2d3]">Ajouter une photo</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-caps mb-2 block">Gamme</label>
          <select
            className="input-field"
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
          >
            {families.map((f) => (
              <option key={f.id} value={f.id} className="bg-[#252220]">
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
              <option key={f.id} value={f.name} className="bg-[#252220]">
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label-caps mb-2 block">Photo</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
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
            Choisir une photo
          </button>
          {selectedFile && (
            <>
              <span className="text-sm text-[#a6917c]">{selectedFile.name}</span>
              <button
                type="button"
                onClick={clearSelectedFile}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                Retirer
              </button>
            </>
          )}
        </div>
      </div>

      {previewUrl && (
        <div className="relative aspect-[4/3] max-w-sm overflow-hidden border border-[rgba(232,226,211,0.12)] bg-[#252220]">
          <Image
            src={previewUrl}
            alt="Aperçu"
            fill
            className="object-cover"
            sizes="400px"
            unoptimized
          />
        </div>
      )}

      {message && <p className="admin-message">{message}</p>}

      <button
        type="submit"
        disabled={uploading || !selectedFile}
        className="admin-btn admin-btn-primary"
      >
        {uploading ? "Envoi en cours..." : "Enregistrer la photo"}
      </button>
    </form>
  );

  const photosList = (
    <div className="admin-card">
      <h2 className="font-serif text-xl text-[#e8e2d3]">Photos actuelles</h2>
      {photos.length === 0 ? (
        <p className="mt-4 text-sm text-[#a6917c]">Aucune photo pour le moment.</p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => {
            const family = families.find((f) => f.id === photo.family_id);
            return (
              <div key={photo.id} className="border border-[rgba(232,226,211,0.08)] p-4">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#252220]">
                  <Image
                    src={photo.image_url}
                    alt={photo.finish}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                <p className="mt-3 font-serif text-[#e8e2d3]">{family?.name}</p>
                <p className="text-sm text-[#8a9a78]">{photo.finish}</p>
                <button
                  type="button"
                  onClick={() => deletePhoto(photo.id)}
                  className="admin-btn admin-btn-danger admin-btn-sm mt-3"
                >
                  Supprimer
                </button>
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
