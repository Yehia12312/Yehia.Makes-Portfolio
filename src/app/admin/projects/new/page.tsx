import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { AdminSidebar } from "../../AdminSidebar";
import { ProjectForm } from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="admin-shell">
      <AdminSidebar active="projects" />
      <div className="admin-main">
        {!isSupabaseAdminConfigured && (
          <div className="form-error" style={{ marginBottom: 24 }}>
            Supabase isn&apos;t connected yet — saving will fail. Add SUPABASE_URL and
            SUPABASE_SERVICE_ROLE_KEY to your environment first (see README).
          </div>
        )}
        <ProjectForm />
      </div>
    </div>
  );
}
