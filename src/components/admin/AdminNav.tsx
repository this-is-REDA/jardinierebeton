"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { brand } from "@/lib/data/site-data";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/products", label: "Tarifs", icon: Tags },
  { href: "/admin/contacts", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

type AdminNavProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export function AdminNav({ mobileOpen = false, onClose }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside
      id="admin-sidebar"
      className={cn("admin-sidebar", mobileOpen && "admin-sidebar-open")}
    >
      <div className="admin-sidebar-brand">
        <Image
          src={brand.adminLogo}
          alt={brand.name}
          width={64}
          height={64}
          unoptimized
          className="h-10 w-auto object-contain opacity-90"
        />
        <p className="label-caps mt-5">Administration</p>
        <p className="mt-1 font-serif text-lg text-[#e8e2d3]">{brand.name}</p>
      </div>

      <nav className="admin-nav">
        <p className="admin-nav-label">Menu</p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn("admin-nav-link", isActive && "admin-nav-link-active")}
            >
              <Icon size={18} strokeWidth={1.75} className="shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/" onClick={onClose} className="admin-btn admin-btn-secondary w-full">
          <ExternalLink size={16} />
          Voir le site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="admin-btn admin-btn-ghost w-full"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
