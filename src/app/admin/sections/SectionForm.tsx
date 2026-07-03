"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import type {
  Section,
  TestimonialsContent,
  StatsContent,
  AboutContent,
  CertificationsContent,
  LogosContent,
  ExperienceContent,
} from "@/data/sections";
import { BUILT_IN_SECTION_LABELS } from "@/data/sections";
import { createMediaUploadTicketAction, deleteSectionAction, saveSectionContentAction } from "../actions";

type ListItem<T> = T & { key: string };

function useKeyedList<T>(initial: T[]): [ListItem<T>[], (item: T) => void, (key: string) => void] {
  const counter = useRef(initial.length);
  const [items, setItems] = useState<ListItem<T>[]>(
    initial.map((item, i) => ({ ...item, key: `init-${i}` }))
  );
  const add = (item: T) => setItems((prev) => [...prev, { ...item, key: `new-${counter.current++}` }]);
  const remove = (key: string) => setItems((prev) => prev.filter((i) => i.key !== key));
  return [items, add, remove];
}

type ImageValue = { kind: "existing"; url: string } | { kind: "new"; file: File; previewUrl: string } | null;

async function uploadFile(file: File): Promise<string> {
  const { signedUrl, publicUrl } = await createMediaUploadTicketAction(file.name);
  const res = await fetch(signedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });
  if (!res.ok) throw new Error(`Upload failed for ${file.name} — try a smaller file.`);
  return publicUrl;
}

function ImagePicker({
  image,
  onChange,
  label,
}: {
  image: ImageValue;
  onChange: (img: ImageValue) => void;
  label: string;
}) {
  const url = image?.kind === "existing" ? image.url : image?.kind === "new" ? image.previewUrl : null;
  return (
    <div>
      {url && (
        <div className="admin-model-current" style={{ marginBottom: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" style={{ height: 32, width: "auto" }} />
          <button type="button" className="admin-btn" onClick={() => onChange(null)}>
            REMOVE
          </button>
        </div>
      )}
      {!url && (
        <input
          type="file"
          accept="image/*"
          aria-label={label}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange({ kind: "new", file, previewUrl: URL.createObjectURL(file) });
          }}
        />
      )}
    </div>
  );
}

export function SectionForm({ section }: { section: Section }) {
  const testimonials = section.content as TestimonialsContent;
  const stats = section.content as StatsContent;
  const about = section.content as AboutContent;
  const certifications = section.content as CertificationsContent;
  const logos = section.content as LogosContent;
  const experience = section.content as ExperienceContent;

  const [items, addItem, removeItem] = useKeyedList<{ a: string; b: string }>(
    section.type === "testimonials"
      ? (testimonials.items?.length ? testimonials.items : [{ quote: "", who: "" }]).map((r) => ({
          a: r.who,
          b: r.quote,
        }))
      : section.type === "stats"
        ? (stats.items?.length ? stats.items : [{ value: "", label: "" }]).map((r) => ({
            a: r.value,
            b: r.label,
          }))
        : []
  );

  const [expItems, addExpItem, removeExpItem] = useKeyedList<{
    role: string;
    org: string;
    period: string;
    description: string;
  }>(
    section.type === "experience"
      ? experience.items?.length
        ? experience.items
        : [{ role: "", org: "", period: "", description: "" }]
      : []
  );

  const [certItems, setCertItems] = useState<
    ListItem<{ title: string; issuer: string; date: string; image: ImageValue }>[]
  >(() => {
    const counter = { current: 0 };
    const initial =
      section.type === "certifications"
        ? certifications.items?.length
          ? certifications.items
          : [{ title: "", issuer: "", date: "", imageUrl: null }]
        : [];
    return initial.map((item) => ({
      key: `init-${counter.current++}`,
      title: item.title,
      issuer: item.issuer,
      date: item.date,
      image: item.imageUrl ? { kind: "existing" as const, url: item.imageUrl } : null,
    }));
  });
  const certCounter = useRef(certItems.length);
  const addCertItem = () =>
    setCertItems((prev) => [
      ...prev,
      { key: `new-${certCounter.current++}`, title: "", issuer: "", date: "", image: null },
    ]);
  const removeCertItem = (key: string) => setCertItems((prev) => prev.filter((i) => i.key !== key));
  const updateCertItem = (key: string, fields: Partial<{ title: string; issuer: string; date: string; image: ImageValue }>) =>
    setCertItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...fields } : i)));

  const [logoItems, setLogoItems] = useState<ListItem<{ name: string; image: ImageValue }>[]>(() => {
    const counter = { current: 0 };
    const initial = section.type === "logos" ? (logos.items?.length ? logos.items : [{ name: "", imageUrl: "" }]) : [];
    return initial.map((item) => ({
      key: `init-${counter.current++}`,
      name: item.name,
      image: item.imageUrl ? { kind: "existing" as const, url: item.imageUrl } : null,
    }));
  });
  const logoCounter = useRef(logoItems.length);
  const addLogoItem = () =>
    setLogoItems((prev) => [...prev, { key: `new-${logoCounter.current++}`, name: "", image: null }]);
  const removeLogoItem = (key: string) => setLogoItems((prev) => prev.filter((i) => i.key !== key));
  const updateLogoItem = (key: string, fields: Partial<{ name: string; image: ImageValue }>) =>
    setLogoItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...fields } : i)));

  const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");
  const [error, setError] = useState<string | null>(null);
  const busy = status !== "idle";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    try {
      const hasNewUploads =
        certItems.some((i) => i.image?.kind === "new") || logoItems.some((i) => i.image?.kind === "new");
      if (hasNewUploads) setStatus("uploading");

      for (const item of certItems) {
        const url = item.image ? (item.image.kind === "existing" ? item.image.url : await uploadFile(item.image.file)) : "";
        formData.append("itemImageUrl", url);
      }
      for (const item of logoItems) {
        const url = item.image ? (item.image.kind === "existing" ? item.image.url : await uploadFile(item.image.file)) : "";
        formData.append("itemLogoUrl", url);
      }
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Upload failed.");
      return;
    }

    setStatus("saving");
    try {
      await saveSectionContentAction(formData);
    } catch (err) {
      unstable_rethrow(err); // saveSectionContentAction redirects on success — let that navigation through
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Save failed.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-section">
      <input type="hidden" name="id" value={section.id} />
      <input type="hidden" name="type" value={section.type} />

      <div className="admin-section-header">
        <h2>{BUILT_IN_SECTION_LABELS[section.type]}</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/sections" className="admin-btn">
            CANCEL
          </Link>
          <button type="submit" className="admin-btn admin-btn-accent" disabled={busy}>
            {status === "uploading" ? "UPLOADING…" : status === "saving" ? "SAVING…" : "SAVE"}
          </button>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-field">
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" name="enabled" defaultChecked={section.enabled} style={{ width: "auto" }} />
          Show this section on the live site
        </label>
      </div>

      <div className="form-field">
        <label>ANCHOR (used by nav links to scroll here, e.g. &quot;testimonials&quot;)</label>
        <input type="text" name="anchor" defaultValue={section.anchor} placeholder="testimonials" />
      </div>

      {section.type === "about" && (
        <>
          <div className="form-field">
            <label>TITLE</label>
            <input type="text" name="title" defaultValue={about.title} />
          </div>
          <div className="form-field">
            <label>BODY</label>
            <textarea name="body" defaultValue={about.body} style={{ height: 140 }} />
          </div>
        </>
      )}

      {(section.type === "testimonials" || section.type === "certifications" || section.type === "logos") && (
        <div className="form-field">
          <label>TITLE</label>
          <input
            type="text"
            name="title"
            defaultValue={
              section.type === "testimonials" ? testimonials.title : section.type === "certifications" ? certifications.title : logos.title
            }
          />
        </div>
      )}

      {(section.type === "testimonials" || section.type === "stats") && (
        <div className="form-field">
          <label>{section.type === "testimonials" ? "TESTIMONIALS" : "STATS"}</label>
          {items.map((item) => (
            <div key={item.key} className="admin-review-row">
              <input
                type="text"
                name={section.type === "testimonials" ? "itemWho" : "itemValue"}
                defaultValue={item.a}
                placeholder={section.type === "testimonials" ? "Name, Title" : "Value (e.g. 50+)"}
              />
              <input
                type="text"
                name={section.type === "testimonials" ? "itemQuote" : "itemLabel"}
                defaultValue={item.b}
                placeholder={section.type === "testimonials" ? "What they said" : "Label (e.g. Projects shipped)"}
              />
              <button type="button" className="admin-btn" onClick={() => removeItem(item.key)}>
                REMOVE
              </button>
            </div>
          ))}
          <button type="button" className="admin-btn" onClick={() => addItem({ a: "", b: "" })}>
            + ADD {section.type === "testimonials" ? "TESTIMONIAL" : "STAT"}
          </button>
        </div>
      )}

      {section.type === "experience" && (
        <div className="form-field">
          <label>EXPERIENCE ENTRIES</label>
          {expItems.map((item) => (
            <div
              key={item.key}
              style={{ border: "1px solid var(--border-strong)", padding: 14, marginBottom: 10 }}
            >
              <div className="admin-grid-3">
                <div className="form-field">
                  <label>ROLE</label>
                  <input type="text" name="itemRole" defaultValue={item.role} placeholder="Mold Design Engineer" />
                </div>
                <div className="form-field">
                  <label>ORGANIZATION</label>
                  <input type="text" name="itemOrg" defaultValue={item.org} placeholder="Company / School" />
                </div>
                <div className="form-field">
                  <label>PERIOD</label>
                  <input type="text" name="itemPeriod" defaultValue={item.period} placeholder="2023 — Present" />
                </div>
              </div>
              <div className="form-field">
                <label>DESCRIPTION</label>
                <textarea name="itemDescription" defaultValue={item.description} style={{ height: 70 }} />
              </div>
              <button type="button" className="admin-btn" onClick={() => removeExpItem(item.key)}>
                REMOVE
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-btn"
            onClick={() => addExpItem({ role: "", org: "", period: "", description: "" })}
          >
            + ADD EXPERIENCE
          </button>
        </div>
      )}

      {section.type === "certifications" && (
        <div className="form-field">
          <label>CERTIFICATIONS / BADGES</label>
          {certItems.map((item) => (
            <div
              key={item.key}
              style={{ border: "1px solid var(--border-strong)", padding: 14, marginBottom: 10 }}
            >
              <div className="admin-grid-3">
                <div className="form-field">
                  <label>TITLE</label>
                  <input
                    type="text"
                    name="itemTitle"
                    defaultValue={item.title}
                    placeholder="Certified SolidWorks Expert"
                  />
                </div>
                <div className="form-field">
                  <label>ISSUER</label>
                  <input type="text" name="itemIssuer" defaultValue={item.issuer} placeholder="Dassault Systèmes" />
                </div>
                <div className="form-field">
                  <label>DATE</label>
                  <input type="text" name="itemDate" defaultValue={item.date} placeholder="06.2025" />
                </div>
              </div>
              <div className="form-field">
                <label>BADGE IMAGE (optional)</label>
                <ImagePicker
                  image={item.image}
                  onChange={(img) => updateCertItem(item.key, { image: img })}
                  label="Badge image"
                />
              </div>
              <button type="button" className="admin-btn" onClick={() => removeCertItem(item.key)}>
                REMOVE
              </button>
            </div>
          ))}
          <button type="button" className="admin-btn" onClick={addCertItem}>
            + ADD CERTIFICATION
          </button>
        </div>
      )}

      {section.type === "logos" && (
        <div className="form-field">
          <label>COMPANY LOGOS</label>
          {logoItems.map((item) => (
            <div
              key={item.key}
              style={{ border: "1px solid var(--border-strong)", padding: 14, marginBottom: 10 }}
            >
              <div className="form-field">
                <label>COMPANY NAME</label>
                <input type="text" name="itemName" defaultValue={item.name} placeholder="Company name" />
              </div>
              <div className="form-field">
                <label>LOGO IMAGE</label>
                <ImagePicker
                  image={item.image}
                  onChange={(img) => updateLogoItem(item.key, { image: img })}
                  label="Logo image"
                />
              </div>
              <button type="button" className="admin-btn" onClick={() => removeLogoItem(item.key)}>
                REMOVE
              </button>
            </div>
          ))}
          <button type="button" className="admin-btn" onClick={addLogoItem}>
            + ADD LOGO
          </button>
        </div>
      )}

      <div className="admin-section-header" style={{ marginTop: 24 }}>
        <h3>Danger zone</h3>
      </div>
      <button
        type="button"
        className="admin-btn admin-btn-danger"
        onClick={async () => {
          if (!confirm("Delete this section? This can't be undone.")) return;
          setError(null);
          const formData = new FormData();
          formData.set("id", section.id);
          formData.set("type", section.type);
          try {
            await deleteSectionAction(formData);
          } catch (err) {
            unstable_rethrow(err); // no-op unless deleteSectionAction ever starts redirecting
            setError(err instanceof Error ? err.message : "Delete failed.");
          }
        }}
      >
        DELETE SECTION
      </button>
    </form>
  );
}
