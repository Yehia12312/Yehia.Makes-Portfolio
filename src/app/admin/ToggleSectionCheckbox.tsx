"use client";

export function ToggleSectionCheckbox({ defaultChecked }: { defaultChecked: boolean }) {
  return (
    <input
      type="checkbox"
      name="enabled"
      defaultChecked={defaultChecked}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      style={{ width: "auto" }}
      title="Enabled"
    />
  );
}
