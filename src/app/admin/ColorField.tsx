"use client";

import { useState } from "react";

export function ColorField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="form-field">
      <label>{label}</label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="color"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: 44, height: 38, padding: 2, background: "var(--panel)", border: "1px solid var(--border-strong)" }}
        />
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
}
