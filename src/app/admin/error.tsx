"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="admin-shell">
      <div className="form-error" style={{ marginBottom: 20 }}>
        {error.message || "Something went wrong."}
      </div>
      <button type="button" className="admin-btn" onClick={reset}>
        TRY AGAIN
      </button>
    </div>
  );
}
