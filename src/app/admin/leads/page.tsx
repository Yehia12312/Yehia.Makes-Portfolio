import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { listLeadsAdmin } from "@/lib/adminData";
import { AdminSidebar } from "../AdminSidebar";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import { deleteLeadAction, markLeadStatusAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = isSupabaseAdminConfigured ? await listLeadsAdmin() : [];

  return (
    <div className="admin-shell">
      <AdminSidebar active="leads" />
      <div className="admin-main">
        {!isSupabaseAdminConfigured && (
          <div className="form-error" style={{ marginBottom: 24 }}>
            Supabase isn&apos;t connected yet — leads can&apos;t be stored or shown here. Add
            SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your environment (see README).
          </div>
        )}

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>Leads</h2>
          </div>
          <p className="admin-hint">
            Every contact form submission, newest first. Emails still go to your inbox via Resend —
            this is just a browsable record so you don&apos;t have to dig through email.
          </p>

          {leads.length === 0 ? (
            <div className="admin-row-empty">No leads yet.</div>
          ) : (
            <div className="admin-lead-list">
              {leads.map((lead) => (
                <div className="admin-lead-card" key={lead.id}>
                  <div className="admin-lead-header">
                    <div>
                      <div className="admin-lead-name">
                        {lead.name}{" "}
                        <span className={`admin-lead-status admin-lead-status-${lead.status}`}>
                          {lead.status === "new" ? "NEW" : "REPLIED"}
                        </span>
                      </div>
                      <div className="admin-lead-meta">
                        {lead.email} · {new Date(lead.createdAt).toLocaleString()}
                        {lead.slotDisplay && <> · requested call: {lead.slotDisplay}</>}
                      </div>
                    </div>
                    <div className="admin-row-actions">
                      <a href={`mailto:${lead.email}`} className="admin-btn">
                        REPLY
                      </a>
                      <form action={markLeadStatusAction}>
                        <input type="hidden" name="id" value={lead.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={lead.status === "new" ? "replied" : "new"}
                        />
                        <button type="submit" className="admin-btn">
                          {lead.status === "new" ? "MARK REPLIED" : "MARK NEW"}
                        </button>
                      </form>
                      <form action={deleteLeadAction}>
                        <input type="hidden" name="id" value={lead.id} />
                        <ConfirmDeleteButton />
                      </form>
                    </div>
                  </div>
                  <p className="admin-lead-brief">{lead.brief}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
