import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  ImageIcon,
  Layers,
  Mail,
  Package,
  Settings,
  Tags,
} from "lucide-react";

type StatAccent = "sage" | "sand" | "clay" | "rose";

const statConfig: {
  key: string;
  label: string;
  href: string;
  icon: typeof Layers;
  accent: StatAccent;
}[] = [
  { key: "families", label: "Gammes produits", href: "/admin/produits", icon: Layers, accent: "sage" },
  { key: "variants", label: "Modèles catalogue", href: "/admin/products", icon: Tags, accent: "sand" },
  { key: "photos", label: "Photos produits", href: "/admin/produits", icon: ImageIcon, accent: "clay" },
  { key: "contacts", label: "Messages reçus", href: "/admin/contacts", icon: Mail, accent: "rose" },
];

const quickLinks = [
  {
    href: "/admin/produits",
    title: "Gammes & photos",
    description: "Ajouter des gammes, modifier les noms et gérer les visuels.",
    icon: Package,
    primary: true,
  },
  {
    href: "/admin/products",
    title: "Tarifs H.T",
    description: "Mettre à jour les prix et les modèles du catalogue.",
    icon: Tags,
    primary: false,
  },
  {
    href: "/admin/settings",
    title: "Email & WhatsApp",
    description: "Coordonnées de contact et options de livraison.",
    icon: Settings,
    primary: false,
  },
  {
    href: "/admin/contacts",
    title: "Messages clients",
    description: "Consulter et répondre aux demandes reçues.",
    icon: Mail,
    primary: false,
  },
];

export function AdminDashboard({
  counts,
}: {
  counts: Record<string, number>;
}) {
  return (
    <div className="admin-page">
      <div className="admin-page-header admin-dashboard-header">
        <div>
          <p className="admin-dashboard-eyebrow">Administration</p>
          <h1 className="admin-title">Tableau de bord</h1>
          <p className="admin-subtitle">
            Modifiez le catalogue, les photos et les paramètres — les changements
            apparaissent automatiquement sur le site.
          </p>
        </div>
        <Link href="/produits" className="admin-btn admin-btn-secondary admin-dashboard-site-link">
          <ExternalLink size={16} />
          Voir le site
        </Link>
      </div>

      <div className="admin-dashboard-stats">
        {statConfig.map((stat) => {
          const Icon = stat.icon;
          const value = counts[stat.key] ?? 0;
          const hasMessages = stat.key === "contacts" && value > 0;

          return (
            <Link
              key={stat.key}
              href={stat.href}
              className={`admin-card admin-card-hover admin-stat-card admin-stat-card-${stat.accent}`}
            >
              <div className="admin-stat-card-top">
                <div className="admin-stat-icon-wrap">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <ArrowUpRight size={18} className="admin-stat-arrow" aria-hidden />
              </div>
              <div>
                <p className="label-caps">{stat.label}</p>
                <div className="admin-stat-value-row">
                  <p className="admin-stat-value">{value}</p>
                  {hasMessages && (
                    <span className="admin-stat-badge">Nouveau</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="admin-card admin-dashboard-quick">
        <div className="admin-dashboard-quick-header">
          <div>
            <p className="label-caps">Navigation</p>
            <h2 className="admin-dashboard-section-title">Accès rapide</h2>
          </div>
        </div>

        <div className="admin-quick-grid">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`admin-quick-card${link.primary ? " admin-quick-card-primary" : ""}`}
              >
                <div className="admin-quick-card-icon">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <div className="admin-quick-card-body">
                  <p className="admin-quick-card-title">{link.title}</p>
                  <p className="admin-quick-card-desc">{link.description}</p>
                </div>
                <ArrowUpRight size={16} className="admin-quick-card-arrow" aria-hidden />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
