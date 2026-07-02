import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { listCategoriesAdmin } from "@/lib/adminData";
import { DEFAULT_CATEGORIES } from "@/data/projects";
import {
  addCategoryAction,
  deleteCategoryAction,
  moveCategoryAction,
  renameCategoryAction,
  toggleCategoryAction,
} from "../actions";
import { AdminSidebar } from "../AdminSidebar";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import { ToggleSectionCheckbox } from "../ToggleSectionCheckbox";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = isSupabaseAdminConfigured
    ? ((await listCategoriesAdmin()) as { id: string; name: string; enabled: boolean; sort_order: number }[])
    : DEFAULT_CATEGORIES.map((c) => ({ id: c.id, name: c.name, enabled: c.enabled, sort_order: c.sortOrder }));

  return (
    <div className="admin-shell">
      <AdminSidebar active="categories" />
      <div className="admin-main">
        {!isSupabaseAdminConfigured && (
          <div className="form-error" style={{ marginBottom: 24 }}>
            Supabase isn&apos;t connected yet — nothing you change here will save. Add SUPABASE_URL,
            SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY to your environment (see README).
          </div>
        )}

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>Project Categories</h2>
          </div>
          <p className="admin-hint">
            These show up as filter chips on the public projects list and as the category dropdown
            when editing a project. Hide a category to remove it from the public filter bar without
            touching projects already assigned to it; reorder to change the order chips appear in.
          </p>

          <form action={addCategoryAction} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <input type="text" name="name" placeholder="New category name" required style={{ flex: 1 }} />
            <button type="submit" className="admin-btn admin-btn-accent">
              + ADD CATEGORY
            </button>
          </form>

          <div className="admin-table">
            {categories.map((c, i) => (
              <div className="admin-row" key={c.id}>
                <div className="admin-row-main">
                  <form action={renameCategoryAction} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="text" name="name" defaultValue={c.name} style={{ maxWidth: 260 }} />
                    <button type="submit" className="admin-btn">
                      SAVE
                    </button>
                  </form>
                </div>
                <div className="admin-row-actions">
                  <form action={toggleCategoryAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <ToggleSectionCheckbox defaultChecked={c.enabled} />
                  </form>
                  <form action={moveCategoryAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button type="submit" className="admin-btn" disabled={i === 0}>
                      ↑
                    </button>
                  </form>
                  <form action={moveCategoryAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button type="submit" className="admin-btn" disabled={i === categories.length - 1}>
                      ↓
                    </button>
                  </form>
                  <form action={deleteCategoryAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <ConfirmDeleteButton />
                  </form>
                </div>
              </div>
            ))}
            {categories.length === 0 && <div className="admin-row-empty">No categories yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
