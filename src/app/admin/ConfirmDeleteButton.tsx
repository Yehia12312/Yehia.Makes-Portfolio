"use client";

export function ConfirmDeleteButton({ label = "DELETE" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="admin-btn admin-btn-danger"
      onClick={(e) => {
        if (!confirm("Delete this project? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      {label}
    </button>
  );
}
