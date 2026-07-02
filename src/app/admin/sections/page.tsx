import Link from "next/link";
import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { listSectionsAdmin } from "@/lib/adminData";
import { ADDABLE_SECTION_TYPES, BUILT_IN_SECTION_LABELS, DEFAULT_SECTIONS, type SectionType } from "@/data/sections";
import { addSectionAction, deleteSectionAction, moveSectionAction, toggleSectionAction } from "../actions";
import { AdminSidebar } from "../AdminSidebar";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import { ToggleSectionCheckbox } from "../ToggleSectionCheckbox";

export const dynamic = "force-dynamic";

const CUSTOM_SECTION_TYPES: SectionType[] = ["testimonials", "stats", "about"];

export default async function AdminSectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;

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
      <AdminSidebar active="sections" />
      <div className="admin-main">
        {!isSupabaseAdminConfigured && (
          <div className="form-error" style={{ marginBottom: 24 }}>
            Supabase isn&apos;t connected yet — nothing you change here will save. Add SUPABASE_URL,
            SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY to your environment (see README).
          </div>
        )}

        {saved && (
          <div className="form-sent" style={{ marginBottom: 24 }}>
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
            built-in; their content is edited in Projects or Nav/Hero/Colors. Testimonials, Stats, and
            About sections can be added, edited, and removed freely.
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
      </div>
    </div>
  );
}
