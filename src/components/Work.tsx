"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, PROJECTS, type Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailModal } from "./ProjectDetailModal";

export function Work() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("ALL");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = useMemo(
    () =>
      PROJECTS.filter(
        (p) => filter === "ALL" || p.category.toUpperCase() === filter
      ),
    [filter]
  );

  return (
    <>
      <div className="filter-bar" id="work">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip${filter === c ? " active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
        <div className="filter-count">
          SHOWING {filtered.length} / {PROJECTS.length}
        </div>
      </div>

      <section className="grid-section">
        <div className="project-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">No projects logged in this category yet.</div>
          ) : (
            filtered.map((p) => (
              <ProjectCard key={p.code} project={p} onOpen={() => setSelected(p)} />
            ))
          )}
        </div>
      </section>

      {selected && (
        <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
