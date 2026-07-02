"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Section, TestimonialsContent, StatsContent, AboutContent } from "@/data/sections";
import { BUILT_IN_SECTION_LABELS } from "@/data/sections";
import { deleteSectionAction, saveSectionContentAction } from "../actions";

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

export function SectionForm({ section }: { section: Section }) {
  const testimonials = section.content as TestimonialsContent;
  const stats = section.content as StatsContent;
  const about = section.content as AboutContent;

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

  return (
    <form action={saveSectionContentAction} className="admin-section">
      <input type="hidden" name="id" value={section.id} />
      <input type="hidden" name="type" value={section.type} />

      <div className="admin-section-header">
        <h2>{BUILT_IN_SECTION_LABELS[section.type]}</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/sections" className="admin-btn">
            CANCEL
          </Link>
          <button type="submit" className="admin-btn admin-btn-accent">
            SAVE
          </button>
        </div>
      </div>

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

      {section.type === "testimonials" && (
        <div className="form-field">
          <label>TITLE</label>
          <input type="text" name="title" defaultValue={testimonials.title} />
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

      <div className="admin-section-header" style={{ marginTop: 24 }}>
        <h3>Danger zone</h3>
      </div>
      <button
        type="submit"
        formAction={deleteSectionAction}
        className="admin-btn admin-btn-danger"
        onClick={(e) => {
          if (!confirm("Delete this section? This can't be undone.")) e.preventDefault();
        }}
      >
        DELETE SECTION
      </button>
    </form>
  );
}
