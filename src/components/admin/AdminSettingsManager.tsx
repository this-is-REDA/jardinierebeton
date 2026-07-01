"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { brand as staticBrand } from "@/lib/data/site-data";

export function AdminSettingsManager() {
  const [form, setForm] = useState({
    email: staticBrand.email,
    whatsapp: staticBrand.whatsapp,
    whatsappMessage: staticBrand.whatsappMessage,
    delivery: staticBrand.delivery,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "brand")
        .maybeSingle();

      const value = (data?.value ?? {}) as Record<string, string>;
      setForm({
        email: value.email ?? staticBrand.email,
        whatsapp: value.whatsapp ?? staticBrand.whatsapp,
        whatsappMessage: value.whatsappMessage ?? staticBrand.whatsappMessage,
        delivery: value.delivery ?? staticBrand.delivery,
      });
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("site_settings").upsert({
      key: "brand",
      value: form,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Paramètres enregistrés.");
  }

  if (loading) {
    return <p className="text-[#a3a3a3]">Chargement...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card max-w-xl space-y-5">
      <div>
        <label className="label-caps mb-2 block">Email contact</label>
        <input
          className="input-field"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div>
        <label className="label-caps mb-2 block">WhatsApp</label>
        <input
          className="input-field"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          placeholder="+212612345678"
        />
      </div>
      <div>
        <label className="label-caps mb-2 block">Message WhatsApp</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          value={form.whatsappMessage}
          onChange={(e) => setForm({ ...form, whatsappMessage: e.target.value })}
        />
      </div>
      <div>
        <label className="label-caps mb-2 block">Livraison</label>
        <input
          className="input-field"
          value={form.delivery}
          onChange={(e) => setForm({ ...form, delivery: e.target.value })}
        />
      </div>

      {message && <p className="admin-message">{message}</p>}

      <button type="submit" className="admin-btn admin-btn-primary">
        Enregistrer
      </button>
    </form>
  );
}
