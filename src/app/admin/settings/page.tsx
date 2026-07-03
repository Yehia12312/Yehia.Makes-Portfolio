import { getSettings } from "@/lib/content";
import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { saveSettingsAction } from "../actions";
import { AdminSidebar } from "../AdminSidebar";
import { ColorField } from "../ColorField";
import { SubmitButton } from "../SubmitButton";
import { NavLinksEditor } from "../NavLinksEditor";
import { LogoField } from "../LogoField";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [settings, { saved }] = await Promise.all([getSettings(), searchParams]);

  return (
    <div className="admin-shell">
      <AdminSidebar active="settings" />
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

        <form action={saveSettingsAction} className="admin-section">
          <div className="admin-section-header">
            <h2>Navigation, Hero &amp; Text</h2>
            <SubmitButton pendingLabel="SAVING…" className="admin-btn admin-btn-accent">
              SAVE
            </SubmitButton>
          </div>

          <div className="admin-section-header" style={{ marginTop: 0 }}>
            <h3>Logo</h3>
          </div>
          <LogoField
            initialUrl={settings.logoUrl}
            initialEnabled={settings.logoEnabled}
            initialWidth={settings.logoWidth}
            initialPosition={settings.logoPosition}
          />

          <div className="admin-section-header" style={{ marginTop: 12 }}>
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

          <div className="admin-section-header" style={{ marginTop: 0 }}>
            <h3>Hero language &amp; typography</h3>
          </div>
          <p className="admin-hint">
            Write the headline/subtext above in Arabic (or any other language) and use these to make
            it render correctly — right-to-left direction, a proper Arabic font, and your own size.
          </p>
          <div className="admin-grid-3">
            <div className="form-field">
              <label>TEXT DIRECTION</label>
              <select name="heroDirection" defaultValue={settings.heroDirection}>
                <option value="ltr">Left-to-right</option>
                <option value="rtl">Right-to-left (Arabic, Hebrew, etc.)</option>
              </select>
            </div>
            <div className="form-field">
              <label>TEXT POSITION</label>
              <select name="heroTextAlign" defaultValue={settings.heroTextAlign}>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="form-field">
              <label>FONT</label>
              <select name="heroFontFamily" defaultValue={settings.heroFontFamily}>
                <option value="default">Default (Space Grotesk)</option>
                <option value="arabic">Arabic (Cairo)</option>
              </select>
            </div>
          </div>
          <div className="form-field" style={{ maxWidth: 200 }}>
            <label>HEADLINE SIZE (px)</label>
            <input type="number" name="heroFontSize" defaultValue={settings.heroFontSize} min={24} max={120} />
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
    </div>
  );
}
