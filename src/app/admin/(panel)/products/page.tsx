import { AdminPricingManager } from "@/components/admin/AdminPricingManager";

export default function AdminProductsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-title">Tarifs & modèles</h1>
        <p className="admin-subtitle">
          Ajoutez les dimensions, poids et prix H.T pour chaque gamme. Les
          tableaux apparaissent sur le catalogue du site.
        </p>
      </div>
      <AdminPricingManager />
    </div>
  );
}
