"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { brand } from "@/lib/data/site-data";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        setError("Supabase n'est pas configuré. Ajoutez vos clés dans .env.local");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push("/admin");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Email ou mot de passe incorrect.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <div className="flex flex-wrap justify-center">
          <Image
            src={brand.logo}
            alt={brand.name}
            width={140}
            height={180}
            unoptimized
            className="h-16 w-auto object-contain"
          />
        </div>
        <p className="label-caps mt-6 text-center">Administration</p>
        <h1 className="mt-3 text-center font-serif text-3xl text-[#171717]">
          Connexion
        </h1>
        <p className="mt-2 text-sm text-[#a3a3a3]">
          Gérez vos produits, tarifs et photos depuis cet espace.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="label-caps mb-2 block">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="password" className="label-caps mb-2 block">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary w-full"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <Link
          href="/"
          className="admin-btn admin-btn-ghost mt-6 w-full"
        >
          ← Retour au site
        </Link>
      </div>
    </div>
  );
}
