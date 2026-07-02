import Link from "next/link";
import { getProjects } from "@/lib/content";
import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { deleteProjectAction, moveProjectAction } from "../actions";
import { AdminSidebar } from "../AdminSidebar";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="admin-shell">
      <AdminSidebar active="projects" />
      <div className="admin-main">
        {!isSupabaseAdminConfigured && (
          <div className="form-error" style={{ marginBottom: 24 }}>
            Supabase isn&apos;t connected yet — you&apos;re viewing the built-in default projects, and
            nothing you edit here will save. Add SUPABASE_URL, SUPABASE_ANON_KEY, and
            SUPABASE_SERVICE_ROLE_KEY to your environment (see README).
          </div>
        )}

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>Projects</h2>
            <Link href="/admin/projects/new" className="admin-btn admin-btn-accent">
              + ADD PROJECT
            </Link>
          </div>

          <div className="admin-table">
            {projects.map((p, i) => (
              <div className="admin-row" key={p.id}>
                <div className="admin-row-thumb">
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt="" />
                  ) : (
                    <span className="admin-row-thumb-placeholder">{p.icon}</span>
                  )}
                </div>
                <div className="admin-row-main">
                  <div className="admin-row-code">
                    {p.code}
                    {p.modelUrl && <span className="admin-row-3d-badge"> · 3D MODEL</span>}
                    {p.images.length > 1 && <span> · {p.images.length} PHOTOS</span>}
                  </div>
                  <div className="admin-row-title">{p.title}</div>
                  <div className="admin-row-category">{p.category}</div>
                </div>
                <div className="admin-row-actions">
                  <form action={moveProjectAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button type="submit" className="admin-btn" disabled={i === 0}>
                      ↑
                    </button>
                  </form>
                  <form action={moveProjectAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button type="submit" className="admin-btn" disabled={i === projects.length - 1}>
                      ↓
                    </button>
                  </form>
                  <Link href={`/admin/projects/${p.id}`} className="admin-btn">
                    EDIT
                  </Link>
                  <form action={deleteProjectAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmDeleteButton />
                  </form>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="admin-row-empty">No projects yet — add your first one.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
