import Link from "next/link";
import { getProjects, getSettings } from "@/lib/content";
import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { listSectionsAdmin } from "@/lib/adminData";
import { ADDABLE_SECTION_TYPES, BUILT_IN_SECTION_LABELS, DEFAULT_SECTIONS, type SectionType } from "@/data/sections";
import {
  addSectionAction,
  deleteProjectAction,
  deleteSectionAction,
  logoutAction,
  moveProjectAction,
  moveSectionAction,
  saveSettingsAction,
  toggleSectionAction,
} from "./actions";
import { ConfirmDeleteButton } from "./ConfirmDeleteButton";
import { ColorField } from "./ColorField";
import { SubmitButton } from "./SubmitButton";
import { NavLinksEditor } from "./NavLinksEditor";
import { ToggleSectionCheckbox } from "./ToggleSectionCheckbox";

export const dynamic = "force-dynamic";

const CUSTOM_SECTION_TYPES: SectionType[] = ["testimonials", "stats", "about"];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [[projects, settings], { saved }] = await Promise.all([
    Promise.all([getProjects(), getSettings()]),
    searchParams,
  ]);

  const sections = isSupabaseAdminConfigured
    ? (await listSectionsAdmin()).map((r) => ({
        id: r.id as string,
        type: r.type as SectionType,
        enabled: r.enabled as boolean,
        sortOrder: r.sort_order as number,
      }))
    : DEFAULT_SECTIONS.map((s) => ({ id: s.id, type: s.type, enabled: s.enabled, sortOrder: s.sortOrder }));

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

      {saved && (
        <div className="form-sent" style={{ margin: "24px 48px 0" }}>
          ✓ Saved — your live site now reflects these changes.
        </div>
      )}

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Site Sections</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ADDABLE_SECTION_TYPES.map((t) => (
              <form action={addSectionAction} key={t.type}>
                <input type="hidden" name="type" value={t.type} />
                <button type="submit" className="admin-btn admin-btn-accent">
                  + {t.label.toUpperCase()}
                </button>
              </form>
            ))}
          </div>
        </div>
        <p className="admin-hint">
          Toggle sections on/off and reorder them here. Hero, Project Grid, Contact, and Footer are
          built-in; their content is edited below (or in Projects). Testimonials, Stats, and About
          sections can be added, edited, and removed freely.
        </p>
        <div className="admin-table">
          {sections.map((s, i) => (
            <div className="admin-row" key={s.id}>
              <div className="admin-row-main">
                <div className="admin-row-title">{BUILT_IN_SECTION_LABELS[s.type]}</div>
              </div>
              <div className="admin-row-actions">
                <form action={toggleSectionAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <ToggleSectionCheckbox defaultChecked={s.enabled} />
                </form>
                <form action={moveSectionAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button type="submit" className="admin-btn" disabled={i === 0}>
                    ↑
                  </button>
                </form>
                <form action={moveSectionAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button type="submit" className="admin-btn" disabled={i === sections.length - 1}>
                    ↓
                  </button>
                </form>
                {CUSTOM_SECTION_TYPES.includes(s.type) && (
                  <>
                    <Link href={`/admin/sections/${s.id}`} className="admin-btn">
                      EDIT
                    </Link>
                    <form action={deleteSectionAction}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="type" value={s.type} />
                      <ConfirmDeleteButton />
                    </form>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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

      <form action={saveSettingsAction} className="admin-section">
        <div className="admin-section-header">
          <h2>Navigation, Hero &amp; Text</h2>
          <SubmitButton pendingLabel="SAVING…" className="admin-btn admin-btn-accent">
            SAVE
          </SubmitButton>
        </div>

        <div className="admin-section-header" style={{ marginTop: 0 }}>
          <h3>Navigation</h3>
        </div>
        <NavLinksEditor initial={settings.navLinks} />
        <div className="admin-grid-2">
          <div className="form-field">
            <label>CTA BUTTON LABEL (top right of nav)</label>
            <input type="text" name="navCtaLabel" defaultValue={settings.navCtaLabel} />
          </div>
          <div className="form-field">
            <label>CTA BUTTON ANCHOR</label>
            <input type="text" name="navCtaAnchor" defaultValue={settings.navCtaAnchor} />
          </div>
        </div>

        <div className="admin-section-header" style={{ marginTop: 12 }}>
          <h3>Hero &amp; Text</h3>
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
