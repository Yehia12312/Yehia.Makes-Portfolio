import Link from "next/link";
import { getProjects, getSettings } from "@/lib/content";
import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { deleteProjectAction, logoutAction, moveProjectAction, saveSettingsAction } from "./actions";
import { ConfirmDeleteButton } from "./ConfirmDeleteButton";
import { ColorField } from "./ColorField";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div className="logo">
          <div className="logo-mark">
            <span>Y</span>
          </div>
          YEHIA.MAKES ADMIN
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/" target="_blank" rel="noreferrer" className="admin-btn">
            VIEW SITE →
          </a>
          <form action={logoutAction}>
            <button type="submit" className="admin-btn">
              LOG OUT
            </button>
          </form>
        </div>
      </div>

      {!isSupabaseAdminConfigured && (
        <div className="form-error" style={{ margin: "24px 48px 0" }}>
          Supabase isn&apos;t connected yet — you&apos;re viewing the built-in default content, and
          nothing you edit below will save. Add SUPABASE_URL, SUPABASE_ANON_KEY, and
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
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt="" />
                ) : (
                  <span className="admin-row-thumb-placeholder">{p.icon}</span>
                )}
              </div>
              <div className="admin-row-main">
                <div className="admin-row-code">{p.code}</div>
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

      <form action={saveSettingsAction} className="admin-section">
        <div className="admin-section-header">
          <h2>Hero &amp; Text</h2>
          <button type="submit" className="admin-btn admin-btn-accent">
            SAVE
          </button>
        </div>

        <div className="admin-grid-2">
          <div className="form-field">
            <label>NAME</label>
            <input type="text" name="heroName" defaultValue={settings.heroName} />
          </div>
          <div className="form-field">
            <label>DISCIPLINE</label>
            <input type="text" name="heroDisc" defaultValue={settings.heroDisc} />
          </div>
          <div className="form-field">
            <label>REVISION</label>
            <input type="text" name="heroRev" defaultValue={settings.heroRev} />
          </div>
        </div>

        <div className="form-field">
          <label>HEADLINE (before the highlighted word)</label>
          <input type="text" name="heroPrefix" defaultValue={settings.heroPrefix} />
        </div>
        <div className="form-field">
          <label>HEADLINE (highlighted word, shown in orange)</label>
          <input type="text" name="heroEmphasis" defaultValue={settings.heroEmphasis} />
        </div>
        <div className="form-field">
          <label>HEADLINE (after the highlighted word)</label>
          <input type="text" name="heroSuffix" defaultValue={settings.heroSuffix} />
        </div>
        <div className="form-field">
          <label>SUBTEXT</label>
          <textarea name="heroLede" defaultValue={settings.heroLede} style={{ height: 90 }} />
        </div>

        <div className="admin-grid-2">
          <div className="form-field">
            <label>HOURS STAT</label>
            <input type="text" name="statHours" defaultValue={settings.statHours} />
          </div>
          <div className="form-field">
            <label>RATING STAT</label>
            <input type="text" name="statRating" defaultValue={settings.statRating} />
          </div>
          <div className="form-field">
            <label>CERTIFICATION VALUE</label>
            <input type="text" name="statCertValue" defaultValue={settings.statCertValue} />
          </div>
          <div className="form-field">
            <label>CERTIFICATION LABEL</label>
            <input type="text" name="statCertLabel" defaultValue={settings.statCertLabel} />
          </div>
        </div>

        <div className="admin-section-header" style={{ marginTop: 12 }}>
          <h3>Colors</h3>
        </div>
        <p className="admin-hint">
          Per the brand system: teal is meant only for &quot;verified&quot; badges, not decoration.
        </p>
        <div className="admin-grid-2">
          <ColorField name="colorBg" label="Background" defaultValue={settings.colorBg} />
          <ColorField name="colorPanel" label="Panel" defaultValue={settings.colorPanel} />
          <ColorField name="colorPanelHover" label="Panel Hover" defaultValue={settings.colorPanelHover} />
          <ColorField name="colorText" label="Text" defaultValue={settings.colorText} />
          <ColorField name="colorTextDim" label="Text Dim" defaultValue={settings.colorTextDim} />
          <ColorField name="colorAccent" label="Accent (orange)" defaultValue={settings.colorAccent} />
          <ColorField name="colorVerified" label="Verified (teal)" defaultValue={settings.colorVerified} />
        </div>
      </form>
    </div>
  );
}
