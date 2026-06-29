import { AdminContactsManager } from "@/components/admin/AdminContactsManager";

export default function AdminContactsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-title">Messages contact</h1>
        <p className="admin-subtitle">
          Demandes reçues depuis le formulaire du site.
        </p>
      </div>
      <AdminContactsManager />
    </div>
  );
}
