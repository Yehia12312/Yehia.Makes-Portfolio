"use client";

import { useRef, useState } from "react";
import type { NavLink } from "@/data/projects";

export function NavLinksEditor({ initial }: { initial: NavLink[] }) {
  const counter = useRef(initial.length);
  const [links, setLinks] = useState(initial.map((link, i) => ({ ...link, key: `init-${i}` })));

  function add() {
    setLinks((prev) => [...prev, { label: "", anchor: "", key: `new-${counter.current++}` }]);
  }
  function remove(key: string) {
    setLinks((prev) => prev.filter((l) => l.key !== key));
  }

  return (
    <div className="form-field">
      <label>NAV LINKS (each points to a section&apos;s anchor, e.g. &quot;work&quot;, &quot;about&quot;)</label>
      {links.map((link) => (
        <div key={link.key} className="admin-review-row">
          <input type="text" name="navLinkLabel" defaultValue={link.label} placeholder="Label (e.g. Work)" />
          <input type="text" name="navLinkAnchor" defaultValue={link.anchor} placeholder="Anchor (e.g. work)" />
          <button type="button" className="admin-btn" onClick={() => remove(link.key)}>
            REMOVE
          </button>
        </div>
      ))}
      <button type="button" className="admin-btn" onClick={add}>
        + ADD NAV LINK
      </button>
    </div>
  );
}
