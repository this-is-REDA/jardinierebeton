"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ContactRequest } from "@/types/database";

function parseMessage(message: string) {
  const match = message.match(/^\[(.+?)\]\s*([\s\S]*)$/);
  if (match) {
    return { subject: match[1], body: match[2].trim() || "—" };
  }
  return { subject: "—", body: message };
}

function whatsappClientHref(
  contact: ContactRequest,
  subject: string
): string | null {
  if (!contact.phone) return null;

  const number = contact.phone.replace(/\D/g, "");
  if (!number) return null;

  const text = encodeURIComponent(
    `Bonjour ${contact.name}, merci pour votre message concernant « ${subject} ». `
  );

  return `https://wa.me/${number}?text=${text}`;
}

export function AdminContactsManager() {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setContacts(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function deleteContact(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    const supabase = createSupabaseBrowserClient();
    await supabase.from("contact_requests").delete().eq("id", id);
    await loadData();
  }

  if (loading) {
    return <p className="text-[#a3a3a3]">Chargement...</p>;
  }

  if (!contacts.length) {
    return (
      <div className="admin-card">
        <p className="text-[#a3a3a3]">Aucun message pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-mobile-only admin-mobile-list">
        {contacts.map((contact) => {
          const { subject, body } = parseMessage(contact.message);
          const whatsappHref = whatsappClientHref(contact, subject);

          return (
            <article key={contact.id} className="admin-mobile-card">
              <div className="admin-mobile-card-header">
                <p className="admin-mobile-card-title">{contact.name}</p>
                <p className="admin-mobile-card-meta">
                  {new Date(contact.created_at).toLocaleString("fr-FR")}
                </p>
              </div>
              <div className="admin-mobile-card-row">
                <p className="admin-mobile-card-label">Email</p>
                <p className="admin-mobile-card-value">{contact.email}</p>
              </div>
              <div className="admin-mobile-card-row">
                <p className="admin-mobile-card-label">Téléphone</p>
                <p className="admin-mobile-card-value">{contact.phone ?? "—"}</p>
              </div>
              <div className="admin-mobile-card-row">
                <p className="admin-mobile-card-label">Sujet</p>
                <p className="admin-mobile-card-value text-[#171717]">{subject}</p>
              </div>
              <div className="admin-mobile-card-row">
                <p className="admin-mobile-card-label">Message</p>
                <p className="admin-mobile-card-value whitespace-pre-wrap">{body}</p>
              </div>
              <div className="admin-mobile-card-actions">
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-whatsapp admin-btn-sm"
                  >
                    Contacter
                  </a>
                ) : (
                  <span
                    className="admin-btn admin-btn-sm cursor-not-allowed opacity-40"
                    title="Aucun numéro de téléphone"
                  >
                    Contacter
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => deleteContact(contact.id)}
                  className="admin-btn admin-btn-danger admin-btn-sm"
                >
                  Supprimer
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="admin-desktop-only admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Sujet</th>
              <th>Message</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => {
              const { subject, body } = parseMessage(contact.message);
              const whatsappHref = whatsappClientHref(contact, subject);

              return (
                <tr key={contact.id}>
                  <td className="font-medium text-[#171717]">{contact.name}</td>
                  <td className="text-[#a3a3a3]">{contact.email}</td>
                  <td className="text-[#a3a3a3]">{contact.phone ?? "—"}</td>
                  <td className="text-[#171717]">{subject}</td>
                  <td className="max-w-xs whitespace-pre-wrap text-[#525252]">
                    {body}
                  </td>
                  <td className="whitespace-nowrap text-xs text-[#a3a3a3]">
                    {new Date(contact.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {whatsappHref ? (
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-btn admin-btn-whatsapp admin-btn-sm"
                        >
                          Contacter
                        </a>
                      ) : (
                        <span
                          className="admin-btn admin-btn-sm cursor-not-allowed opacity-40"
                          title="Aucun numéro de téléphone"
                        >
                          Contacter
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteContact(contact.id)}
                        className="admin-btn admin-btn-danger admin-btn-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
