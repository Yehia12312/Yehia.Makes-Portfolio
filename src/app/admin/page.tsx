import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { getAnalyticsSummary, listBookingsAdmin, listLeadsAdmin } from "@/lib/adminData";
import { AdminSidebar } from "./AdminSidebar";
import { Overview } from "./Overview";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const overviewData = isSupabaseAdminConfigured
    ? await Promise.all([listLeadsAdmin(), listBookingsAdmin(), getAnalyticsSummary()])
    : null;

  return (
    <div className="admin-shell">
      <AdminSidebar active="dashboard" />
      <div className="admin-main">
        {!isSupabaseAdminConfigured && (
          <div className="form-error" style={{ marginBottom: 24 }}>
            Supabase isn&apos;t connected yet — you&apos;re viewing the built-in default content, and
            nothing you edit will save. Add SUPABASE_URL, SUPABASE_ANON_KEY, and
            SUPABASE_SERVICE_ROLE_KEY to your environment (see README).
          </div>
        )}

        {overviewData && (
          <Overview leads={overviewData[0]} bookings={overviewData[1]} analytics={overviewData[2]} />
        )}
      </div>
    </div>
  );
}
