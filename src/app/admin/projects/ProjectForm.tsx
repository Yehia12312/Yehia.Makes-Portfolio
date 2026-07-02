"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { ICON_KINDS, PROJECT_CATEGORY_OPTIONS, type Project } from "@/data/projects";
import { createPhotoUploadTicketAction, saveProjectAction } from "../actions";

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

export function ProjectForm({ project }: { project?: Project }) {
  const [tools, addTool, removeTool] = useKeyedList<{ value: string }>(
    (project?.tools ?? [""]).map((value) => ({ value }))
  );
  const [reviews, addReview, removeReview] = useKeyedList<{ who: string; quote: string }>(
    project?.reviews && project.reviews.length > 0 ? project.reviews : [{ who: "", quote: "" }]
  );
  const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const photo = formData.get("photo");
    formData.delete("photo");

    if (photo instanceof File && photo.size > 0) {
      setStatus("uploading");
      try {
        const { signedUrl, publicUrl } = await createPhotoUploadTicketAction(photo.name);
        const res = await fetch(signedUrl, {
          method: "PUT",
          body: photo,
          headers: { "Content-Type": photo.type || "application/octet-stream" },
        });
        if (!res.ok) throw new Error("Photo upload failed — try a smaller image.");
        formData.set("imageUrl", publicUrl);
      } catch (err) {
        setStatus("idle");
        setError(err instanceof Error ? err.message : "Photo upload failed.");
        return;
      }
    }

    setStatus("saving");
    try {
      await saveProjectAction(formData);
    } catch (err) {
      unstable_rethrow(err); // saveProjectAction redirects on success — let that navigation through
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Save failed.");
    }
  }

  const busy = status !== "idle";

  return (
    <form onSubmit={handleSubmit} className="admin-section">
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="admin-section-header">
        <h2>{project ? `Edit ${project.code}` : "New Project"}</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin" className="admin-btn">
            CANCEL
          </Link>
          <button type="submit" className="admin-btn admin-btn-accent" disabled={busy}>
            {status === "uploading" ? "UPLOADING PHOTO…" : status === "saving" ? "SAVING…" : "SAVE PROJECT"}
          </button>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="admin-grid-2">
        <div className="form-field">
          <label>CODE</label>
          <input type="text" name="code" defaultValue={project?.code} placeholder="PRJ-008" required />
        </div>
        <div className="form-field">
          <label>CATEGORY</label>
          <select name="category" defaultValue={project?.category ?? PROJECT_CATEGORY_OPTIONS[0]} required>
            {PROJECT_CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-field">
        <label>TITLE</label>
        <input type="text" name="title" defaultValue={project?.title} required />
      </div>

      <div className="admin-grid-3">
        <div className="form-field">
          <label>TIME</label>
          <input type="text" name="time" defaultValue={project?.time} placeholder="40h" required />
        </div>
        <div className="form-field">
          <label>COST</label>
          <input type="text" name="cost" defaultValue={project?.cost} placeholder="$200" required />
        </div>
        <div className="form-field">
          <label>TOOL (short, for the card)</label>
          <input type="text" name="tool" defaultValue={project?.tool} placeholder="SW2024" required />
        </div>
      </div>

      <div className="admin-grid-3">
        <div className="form-field">
          <label>ROLE</label>
          <input type="text" name="role" defaultValue={project?.role} required />
        </div>
        <div className="form-field">
          <label>STATUS</label>
          <input type="text" name="status" defaultValue={project?.status ?? "Published"} required />
        </div>
        <div className="form-field">
          <label>ICON (thumbnail shape, used when there&apos;s no photo)</label>
          <select name="icon" defaultValue={project?.icon ?? "roll"}>
            {ICON_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-field">
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" name="has3d" defaultChecked={project?.has3d} style={{ width: "auto" }} />
          Show the &quot;3D&quot; badge on this project&apos;s card
        </label>
      </div>

      <div className="form-field">
        <label>PHOTO</label>
        {project?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.imageUrl} alt="" className="admin-photo-preview" />
        )}
        <input type="file" name="photo" accept="image/*" />
        {project?.imageUrl && (
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <input type="checkbox" name="removePhoto" style={{ width: "auto" }} />
            Remove current photo (falls back to the wireframe icon)
          </label>
        )}
      </div>

      <div className="form-field">
        <label>TOOLS USED (shown as pills on the project detail page)</label>
        {tools.map((t) => (
          <div key={t.key} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input type="text" name="tools" defaultValue={t.value} style={{ flex: 1 }} />
            <button type="button" className="admin-btn" onClick={() => removeTool(t.key)}>
              REMOVE
            </button>
          </div>
        ))}
        <button type="button" className="admin-btn" onClick={() => addTool({ value: "" })}>
          + ADD TOOL
        </button>
      </div>

      <div className="form-field">
        <label>REVIEWS</label>
        {reviews.map((r) => (
          <div key={r.key} className="admin-review-row">
            <input type="text" name="reviewWho" defaultValue={r.who} placeholder="Name, Title" />
            <input type="text" name="reviewQuote" defaultValue={r.quote} placeholder="What they said" />
            <button type="button" className="admin-btn" onClick={() => removeReview(r.key)}>
              REMOVE
            </button>
          </div>
        ))}
        <button type="button" className="admin-btn" onClick={() => addReview({ who: "", quote: "" })}>
          + ADD REVIEW
        </button>
      </div>
    </form>
  );
}
