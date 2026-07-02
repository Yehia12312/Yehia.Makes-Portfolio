import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { listCategoriesAdmin } from "@/lib/adminData";
import { DEFAULT_CATEGORIES, type Category } from "@/data/projects";
import { AdminSidebar } from "../../AdminSidebar";
import { ProjectForm } from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const categories: Category[] = isSupabaseAdminConfigured
    ? (await listCategoriesAdmin()).map((c) => ({
        id: c.id as string,
        name: c.name as string,
        enabled: c.enabled as boolean,
        sortOrder: c.sort_order as number,
      }))
    : DEFAULT_CATEGORIES;

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
        <ProjectForm categories={categories} />
      </div>
    </div>
  );
}
