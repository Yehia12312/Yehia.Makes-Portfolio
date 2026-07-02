"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { ICON_KINDS, PROJECT_CATEGORY_OPTIONS, type Project } from "@/data/projects";
import { createMediaUploadTicketAction, saveProjectAction } from "../actions";

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

type ImageItem =
  | { key: string; kind: "existing"; url: string }
  | { key: string; kind: "new"; file: File; previewUrl: string };

type ModelItem =
  | { kind: "existing"; url: string }
  | { kind: "new"; file: File; name: string }
  | null;

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

export function ProjectForm({ project }: { project?: Project }) {
  const [tools, addTool, removeTool] = useKeyedList<{ value: string }>(
    (project?.tools ?? [""]).map((value) => ({ value }))
  );
  const [reviews, addReview, removeReview] = useKeyedList<{ who: string; quote: string }>(
    project?.reviews && project.reviews.length > 0 ? project.reviews : [{ who: "", quote: "" }]
  );

  const imageCounter = useRef(project?.images?.length ?? 0);
  const [images, setImages] = useState<ImageItem[]>(
    (project?.images ?? []).map((url, i) => ({ key: `existing-${i}`, kind: "existing", url }))
  );
  const [model, setModel] = useState<ModelItem>(project?.modelUrl ? { kind: "existing", url: project.modelUrl } : null);

  useEffect(() => {
    return () => {
      for (const img of images) {
        if (img.kind === "new") URL.revokeObjectURL(img.previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addImageFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newItems: ImageItem[] = Array.from(fileList).map((file) => ({
      key: `new-${imageCounter.current++}`,
      kind: "new",
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newItems]);
  }

  function removeImage(key: string) {
    setImages((prev) => {
      const target = prev.find((i) => i.key === key);
      if (target?.kind === "new") URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.key !== key);
    });
  }

  const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (images.some((i) => i.kind === "new") || (model && model.kind === "new")) {
        setStatus("uploading");
      }

      const finalImageUrls: string[] = [];
      for (const img of images) {
        finalImageUrls.push(img.kind === "existing" ? img.url : await uploadFile(img.file));
      }
      for (const url of finalImageUrls) formData.append("images", url);

      const finalModelUrl = model ? (model.kind === "existing" ? model.url : await uploadFile(model.file)) : "";
      formData.set("modelUrl", finalModelUrl);
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Upload failed.");
      return;
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
            {status === "uploading" ? "UPLOADING…" : status === "saving" ? "SAVING…" : "SAVE PROJECT"}
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
          <label>ICON (fallback shape, used only when there&apos;s no photo or 3D model)</label>
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
        <label>PHOTOS (first one is used as the card thumbnail)</label>
        {images.length > 0 && (
          <div className="admin-media-grid">
            {images.map((img) => (
              <div className="admin-media-item" key={img.key}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.kind === "existing" ? img.url : img.previewUrl} alt="" />
                <button type="button" className="admin-media-remove" onClick={() => removeImage(img.key)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <input type="file" accept="image/*" multiple onChange={(e) => addImageFiles(e.target.files)} />
      </div>

      <div className="form-field">
        <label>3D MODEL (.glb or .gltf — shown in an interactive viewer on the project page)</label>
        {model && (
          <div className="admin-model-current">
            <span>{model.kind === "existing" ? model.url.split("/").pop() : model.name}</span>
            <button type="button" className="admin-btn" onClick={() => setModel(null)}>
              REMOVE
            </button>
          </div>
        )}
        {!model && (
          <input
            type="file"
            accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setModel({ kind: "new", file, name: file.name });
            }}
          />
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
