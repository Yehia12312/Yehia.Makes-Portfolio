"use client";

import { useState } from "react";
import { createMediaUploadTicketAction } from "./actions";

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

export function LogoField({
  initialUrl,
  initialEnabled,
  initialWidth,
  initialPosition,
}: {
  initialUrl: string | null;
  initialEnabled: boolean;
  initialWidth: number;
  initialPosition: "before" | "after";
}) {
  const [url, setUrl] = useState(initialUrl);
  const [status, setStatus] = useState<"idle" | "uploading">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setStatus("uploading");
    setError(null);
    try {
      setUrl(await uploadFile(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <>
      <input type="hidden" name="logoUrl" value={url ?? ""} />

      <div className="form-field">
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" name="logoEnabled" defaultChecked={initialEnabled} style={{ width: "auto" }} />
          SHOW LOGO IN NAV
        </label>
        <p className="admin-hint" style={{ margin: "4px 0 0" }}>
          Off by default (matches the site&apos;s original look — just the &quot;YEHIA.MAKES&quot;
          text, no mark beside it).
        </p>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="admin-grid-2">
        <div className="form-field">
          <label>LOGO IMAGE</label>
          {url && (
            <div className="admin-model-current" style={{ marginBottom: 10 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" style={{ height: 32, width: "auto" }} />
              <button type="button" className="admin-btn" onClick={() => setUrl(null)}>
                REMOVE
              </button>
            </div>
          )}
          <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
          {status === "uploading" && (
            <p className="admin-hint" style={{ margin: "6px 0 0" }}>
              Uploading…
            </p>
          )}
        </div>
        <div className="form-field">
          <label>WIDTH (px)</label>
          <input type="number" name="logoWidth" defaultValue={initialWidth} min={12} max={200} />
        </div>
      </div>

      <div className="form-field">
        <label>POSITION</label>
        <select name="logoPosition" defaultValue={initialPosition}>
          <option value="before">Before &quot;YEHIA.MAKES&quot; text</option>
          <option value="after">After &quot;YEHIA.MAKES&quot; text</option>
        </select>
      </div>
    </>
  );
}
