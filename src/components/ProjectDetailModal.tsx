import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/data/projects";
import { WireIcon } from "./WireIcon";
import { ModelViewer } from "./ModelViewer";
import { trackPageView } from "@/lib/track";

type MediaItem = { kind: "model"; url: string } | { kind: "image"; url: string };

export function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    trackPageView(`project:${project.code}`);
  }, [project.code]);

  const stats: { k: string; v: string; accent?: boolean }[] = [
    { k: "Time invested", v: project.time.replace("h", " hours"), accent: true },
    { k: "Cost", v: project.cost },
    { k: "Category", v: project.category },
    { k: "Role", v: project.role },
    { k: "Status", v: project.status },
  ];

  const media = useMemo<MediaItem[]>(() => {
    const items: MediaItem[] = [];
    if (project.modelUrl) items.push({ kind: "model", url: project.modelUrl });
    for (const url of project.images) items.push({ kind: "image", url });
    return items;
  }, [project.modelUrl, project.images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const active = media[activeIndex];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="eyebrow">
              {project.code} · {project.category.toUpperCase()} · OPENED PROJECT VIEW
            </div>
            <h2>{project.title}</h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            CLOSE ✕
          </button>
        </div>
        <div className="detail-grid">
          <div>
            <div className="viewer-stage">
              {!active && (
                <>
                  <div style={{ textAlign: "center" }}>
                    <div className="viewer-model">
                      <WireIcon kind={project.icon} opacity={0.5} />
                    </div>
                    <div className="viewer-hint">
                      model-viewer renders here
                      <br />
                      (drag to rotate · scroll to zoom)
                    </div>
                  </div>
                  <div className="viewer-controls">
                    <span>⟲ ROTATE</span>
                    <span>⊕ ZOOM</span>
                    <span>⛶ FULLSCREEN</span>
                  </div>
                </>
              )}
              {active?.kind === "model" && <ModelViewer src={active.url} alt={project.title} />}
              {active?.kind === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={active.url} alt={project.title} className="viewer-photo" />
              )}
            </div>
            {media.length > 1 && (
              <div className="viewer-thumbs">
                {media.map((item, i) => (
                  <button
                    key={item.url}
                    type="button"
                    className={`viewer-thumb${i === activeIndex ? " active" : ""}`}
                    onClick={() => setActiveIndex(i)}
                  >
                    {item.kind === "model" ? (
                      <span className="viewer-thumb-model">3D</span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt="" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="sidebar">
            <div className="sidebar-block">
              <div className="label">Project Stats</div>
              {stats.map((s) => (
                <div className="stat-row" key={s.k}>
                  <span className="k">{s.k}</span>
                  <span className={`v${s.accent ? " accent" : ""}`}>{s.v}</span>
                </div>
              ))}
            </div>
            <div className="sidebar-block">
              <div className="label">Tools Used</div>
              <div className="tool-pills">
                {project.tools.map((t) => (
                  <span className="tool-pill" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <a href="#contact" className="sidebar-cta" onClick={onClose}>
              DISCUSS THIS PROJECT →
            </a>
          </div>
        </div>
        <div className="reviews-strip" id="reviews">
          <div className="label">Reviews</div>
          <div className="review-cards">
            {project.reviews.map((r) => (
              <div className="review-card" key={r.who}>
                <div className="quote-mark">&quot;</div>
                {r.quote}
                <div className="who">
                  — {r.who}
                  <span className="verified-badge">✓ VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
