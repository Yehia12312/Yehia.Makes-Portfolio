"use client";

import { useMemo, useState } from "react";
import type { Category, Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailModal } from "./ProjectDetailModal";

export function Work({ projects, categories }: { projects: Project[]; categories: Category[] }) {
  const chips = useMemo(() => ["ALL", ...categories.map((c) => c.name.toUpperCase())], [categories]);
  const [filter, setFilter] = useState<string>("ALL");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = useMemo(
    () => projects.filter((p) => filter === "ALL" || p.category.toUpperCase() === filter),
    [filter, projects]
  );

  return (
    <>
      <div className="filter-bar">
        {chips.map((c) => (
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
          SHOWING {filtered.length} / {projects.length}
        </div>
      </div>

      <section className="grid-section">
        <div className="project-list">
          {filtered.length === 0 ? (
            <div className="empty-state">No projects logged in this category yet.</div>
          ) : (
            filtered.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={() => setSelected(p)} />
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
