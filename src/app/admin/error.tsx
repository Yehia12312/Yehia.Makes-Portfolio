"use client";

import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="admin-shell">
      <div className="admin-main">
        <div className="form-error" style={{ marginBottom: 20 }}>
          {error.message || "Something went wrong."}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="admin-btn" onClick={reset}>
            TRY AGAIN
          </button>
          <Link href="/admin" className="admin-btn">
            BACK TO DASHBOARD
          </Link>
        </div>
      </div>
    </div>
  );
}
