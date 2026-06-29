import { AdminProduitsContent } from "@/components/admin/AdminProduitsContent";

export default function AdminProduitsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-title">Produits</h1>
      </div>
      <AdminProduitsContent />
    </div>
  );
}
