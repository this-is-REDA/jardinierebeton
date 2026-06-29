"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { brand, contactSubjects } from "@/lib/data/site-data";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      message: `[${formData.get("subject")}] ${formData.get("message")}`,
      product_id: null,
    };

    try {
      if (isSupabaseConfigured()) {
        const supabase = createSupabaseClient();
        const { error } = await supabase.from("contact_requests").insert(payload);
        if (error) throw error;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section-divider section-shell lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="max-w-2xl">
          <p className="label-caps">Contact</p>
          <h2 className="section-heading mt-5">Parlons de votre projet</h2>
          <p className="section-lead mt-6">
            Indiquez-nous le modèle, la finition et la quantité souhaités.
            Nous vous répondons rapidement avec un devis personnalisé.
          </p>
          <p className="mt-4 text-sm text-[#c9bfb0]">
            {brand.email} · {brand.delivery}
          </p>
        </div>

        {status === "success" ? (
          <div className="mt-12 max-w-2xl border border-[rgba(138,154,120,0.3)] bg-[#252220] p-10 text-center">
            <CheckCircle className="mx-auto text-[#8a9a78]" size={40} />
            <p className="mt-4 font-serif text-xl text-[#e8e2d3]">
              Message envoyé avec succès
            </p>
            <p className="mt-2 text-sm text-[#a6917c]">
              Nous vous répondrons sous 48h.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="link-arrow mt-6"
            >
              Envoyer un autre message →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-12 max-w-3xl">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="label-caps mb-3 block">
                  Nom *
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  placeholder="Marie Dupont"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="email" className="label-caps mb-3 block">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="marie@exemple.ma"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="phone" className="label-caps mb-3 block">
                  Téléphone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+212 6 00 00 00 00"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="subject" className="label-caps mb-3 block">
                  Sujet
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="input-field"
                >
                  {contactSubjects.map((s) => (
                    <option key={s} value={s} className="bg-[#252220]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="message" className="label-caps mb-3 block">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder="Modèle, finition, quantité, ville de livraison…"
                className="input-field resize-none"
              />
            </div>

            {status === "error" && (
              <p className="mt-4 text-sm text-red-400">
                Une erreur est survenue. Veuillez réessayer.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary mt-8 disabled:opacity-60"
            >
              {status === "loading" ? "Envoi..." : "Envoyer ma demande"}
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
