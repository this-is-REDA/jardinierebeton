import { AdminSettingsManager } from "@/components/admin/AdminSettingsManager";

export default function AdminSettingsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-title">Paramètres</h1>
        <p className="admin-subtitle">
          Email, WhatsApp et texte de livraison affichés sur le site.
        </p>
      </div>
      <AdminSettingsManager />
    </div>
  );
}
