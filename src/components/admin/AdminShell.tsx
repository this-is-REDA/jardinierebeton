"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { brand } from "@/lib/data/site-data";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    <div className="admin-shell min-h-screen text-[#171717]">
      <button
        type="button"
        className={`admin-sidebar-backdrop${mobileOpen ? " admin-sidebar-backdrop-visible" : ""}`}
        aria-label="Fermer le menu"
        onClick={closeMenu}
        tabIndex={mobileOpen ? 0 : -1}
      />
      <div className="admin-layout-inner mx-auto flex min-h-screen max-w-[1680px]">
        <AdminNav mobileOpen={mobileOpen} onClose={closeMenu} />
        <div className="admin-main flex min-w-0 flex-1 flex-col">
          <header className="admin-mobile-header">
            <button
              type="button"
              className="admin-mobile-menu-btn"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="admin-sidebar"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <p className="admin-mobile-header-title">{brand.name}</p>
            <span className="admin-mobile-header-spacer" aria-hidden />
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
