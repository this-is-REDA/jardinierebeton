import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [families, variants, photos, contacts] = await Promise.all([
    supabase?.from("product_families").select("id", { count: "exact", head: true }),
    supabase?.from("product_variants").select("id", { count: "exact", head: true }),
    supabase?.from("product_photos").select("id", { count: "exact", head: true }),
    supabase?.from("contact_requests").select("id", { count: "exact", head: true }),
  ]);

  return (
    <AdminDashboard
      counts={{
        families: families?.count ?? 0,
        variants: variants?.count ?? 0,
        photos: photos?.count ?? 0,
        contacts: contacts?.count ?? 0,
      }}
    />
  );
}
