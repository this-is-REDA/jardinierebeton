"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ProductFamily, ProductVariantRow } from "@/types/database";

type VariantForm = Omit<ProductVariantRow, "created_at" | "updated_at">;
type DraftVariant = VariantForm & { draftKey: string };

const emptyVariant = (familyId: string, sortOrder: number): VariantForm => ({
  id: "",
  family_id: familyId,
  model: "",
  length_cm: 0,
  width_cm: 0,
  height_cm: 0,
  thickness_cm: 3,
  weight_kg: 0,
  price: 0,
  sort_order: sortOrder,
});

export function AdminPricingManager() {
  const [families, setFamilies] = useState<ProductFamily[]>([]);
  const [variants, setVariants] = useState<ProductVariantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [draftVariants, setDraftVariants] = useState<DraftVariant[]>([]);

  async function loadData() {
    const supabase = createSupabaseBrowserClient();
    const [{ data: f }, { data: v }] = await Promise.all([
      supabase.from("product_families").select("*").order("sort_order"),
      supabase.from("product_variants").select("*").order("sort_order"),
    ]);
    setFamilies(f ?? []);
    setVariants(v ?? []);
    setDraftVariants([]);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveVariant(variant: VariantForm) {
    setMessage("");

    if (!variant.model.trim()) {
      setMessage("Indiquez un nom de modèle.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const payload = {
      family_id: variant.family_id,
      model: variant.model.trim(),
      length_cm: variant.length_cm,
      width_cm: variant.width_cm,
      height_cm: variant.height_cm,
      thickness_cm: variant.thickness_cm,
      weight_kg: variant.weight_kg,
      price: variant.price,
      sort_order: variant.sort_order,
      updated_at: new Date().toISOString(),
    };

    if (variant.id) {
      const { error } = await supabase
        .from("product_variants")
        .update(payload)
        .eq("id", variant.id);
      if (error) {
        setMessage(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("product_variants").insert(payload);
      if (error) {
        setMessage(error.message);
        return;
      }
    }

    setMessage("Enregistré. Le catalogue est à jour.");
    await loadData();
  }

  async function deleteVariant(id: string) {
    if (!confirm("Supprimer ce modèle ?")) return;
    const supabase = createSupabaseBrowserClient();
    await supabase.from("product_variants").delete().eq("id", id);
    await loadData();
  }

  function addDraftVariant(familyId: string) {
    const familyVariants = variants.filter((v) => v.family_id === familyId);
    const familyDrafts = draftVariants.filter((v) => v.family_id === familyId);
    setDraftVariants([
      ...draftVariants,
      {
        ...emptyVariant(familyId, familyVariants.length + familyDrafts.length + 1),
        draftKey: crypto.randomUUID(),
      },
    ]);
  }

  function removeDraftVariant(draftKey: string) {
    setDraftVariants(draftVariants.filter((d) => d.draftKey !== draftKey));
  }

  if (loading) {
    return <p className="text-[#a6917c]">Chargement...</p>;
  }

  if (!families.length) {
    return (
      <div className="admin-card">
        <p className="text-[#a6917c]">
          Aucune gamme pour le moment.{" "}
          <Link href="/admin/produits" className="text-[#8a9a78] hover:text-[#e8e2d3]">
            Ajoutez une gamme dans Produits
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {message && <p className="admin-message">{message}</p>}

      {families.map((family) => {
        const familyVariants = variants.filter((v) => v.family_id === family.id);
        const familyDrafts = draftVariants.filter((v) => v.family_id === family.id);

        return (
          <section key={family.id} className="admin-card">
            <div>
              <h2 className="font-serif text-2xl text-[#e8e2d3]">{family.name}</h2>
              <p className="mt-1 text-xs text-[#7a6f63]">{family.slug}</p>
            </div>

            <div className="admin-mobile-only admin-variant-cards mt-6">
              {familyVariants.length === 0 && familyDrafts.length === 0 && (
                <p className="py-4 text-center text-sm text-[#7a6f63]">
                  Aucun modèle — cliquez sur « Ajouter un modèle »
                </p>
              )}
              {familyVariants.map((variant) => (
                <VariantCard
                  key={variant.id}
                  variant={variant}
                  onSave={saveVariant}
                  onDelete={() => deleteVariant(variant.id)}
                />
              ))}
              {familyDrafts.map((draft) => (
                <VariantCard
                  key={draft.draftKey}
                  formKey={draft.draftKey}
                  variant={draft}
                  onSave={async (v) => {
                    await saveVariant(v);
                    removeDraftVariant(draft.draftKey);
                  }}
                  onDelete={() => removeDraftVariant(draft.draftKey)}
                />
              ))}
            </div>

            <div className="admin-desktop-only admin-table-wrap mt-6">
              <table className="admin-table text-sm">
                <thead>
                  <tr>
                    <th>Modèle</th>
                    <th>L</th>
                    <th>l</th>
                    <th>H</th>
                    <th>Ép.</th>
                    <th>Poids</th>
                    <th>Prix H.T</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {familyVariants.length === 0 && familyDrafts.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-sm text-[#7a6f63]">
                        Aucun modèle — cliquez sur « Ajouter un modèle »
                      </td>
                    </tr>
                  )}
                  {familyVariants.map((variant) => (
                    <VariantRow
                      key={variant.id}
                      variant={variant}
                      onSave={saveVariant}
                      onDelete={() => deleteVariant(variant.id)}
                    />
                  ))}
                  {familyDrafts.map((draft) => (
                    <VariantRow
                      key={draft.draftKey}
                      variant={draft}
                      onSave={async (v) => {
                        await saveVariant(v);
                        removeDraftVariant(draft.draftKey);
                      }}
                      onDelete={() => removeDraftVariant(draft.draftKey)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              className="admin-btn admin-btn-secondary mt-6 w-full sm:w-auto"
              onClick={() => addDraftVariant(family.id)}
            >
              + Ajouter un modèle
            </button>
          </section>
        );
      })}
    </div>
  );
}

function VariantCard({
  variant,
  formKey,
  onSave,
  onDelete,
}: {
  variant: VariantForm;
  formKey?: string;
  onSave: (v: VariantForm) => void | Promise<void>;
  onDelete: () => void;
}) {
  const [form, setForm] = useState<VariantForm>(variant);
  const fieldId = formKey ?? variant.id ?? "new";

  const numericFields = [
    { key: "length_cm" as const, label: "Longueur (cm)" },
    { key: "width_cm" as const, label: "Largeur (cm)" },
    { key: "height_cm" as const, label: "Hauteur (cm)" },
    { key: "thickness_cm" as const, label: "Épaisseur (cm)" },
    { key: "weight_kg" as const, label: "Poids (kg)" },
    { key: "price" as const, label: "Prix H.T" },
  ];

  return (
    <div className="admin-variant-card">
      <div className="admin-variant-field">
        <label htmlFor={`model-${fieldId}`}>Modèle</label>
        <input
          id={`model-${fieldId}`}
          className="admin-input"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          placeholder="Nom du modèle"
        />
      </div>
      <div className="admin-variant-grid">
        {numericFields.map(({ key, label }) => (
          <div key={key} className="admin-variant-field">
            <label htmlFor={`${key}-${fieldId}`}>{label}</label>
            <input
              id={`${key}-${fieldId}`}
              type="number"
              className="admin-input"
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: Number(e.target.value) })
              }
            />
          </div>
        ))}
      </div>
      <div className="admin-variant-actions">
        <button
          type="button"
          className="admin-btn admin-btn-primary admin-btn-sm"
          onClick={() => onSave(form)}
        >
          Enregistrer
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-danger admin-btn-sm"
          onClick={onDelete}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

function VariantRow({
  variant,
  onSave,
  onDelete,
}: {
  variant: VariantForm;
  onSave: (v: VariantForm) => void | Promise<void>;
  onDelete: () => void;
}) {
  const [form, setForm] = useState<VariantForm>(variant);

  return (
    <tr>
      <td>
        <input
          className="admin-input"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          placeholder="Nom du modèle"
        />
      </td>
      {(["length_cm", "width_cm", "height_cm", "thickness_cm", "weight_kg", "price"] as const).map(
        (field) => (
          <td key={field}>
            <input
              type="number"
              className="admin-input w-20"
              value={form[field]}
              onChange={(e) =>
                setForm({ ...form, [field]: Number(e.target.value) })
              }
            />
          </td>
        )
      )}
      <td className="space-x-2 whitespace-nowrap">
        <button
          type="button"
          className="admin-btn admin-btn-primary admin-btn-sm"
          onClick={() => onSave(form)}
        >
          Enregistrer
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-danger admin-btn-sm"
          onClick={onDelete}
        >
          Suppr.
        </button>
      </td>
    </tr>
  );
}
