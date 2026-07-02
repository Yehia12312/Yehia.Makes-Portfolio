"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailModal } from "./ProjectDetailModal";

export function FeaturedWork({ projects, anchor }: { projects: Project[]; anchor: string }) {
  const [selected, setSelected] = useState<Project | null>(null);

  const shown = useMemo(() => {
    const featured = projects.filter((p) => p.featured).slice(0, 3);
    return featured.length > 0 ? featured : projects.slice(0, 3);
  }, [projects]);

  return (
    <>
      <section className="grid-section" id={anchor}>
        <div className="section-label-row">
          <div className="section-label">Selected Work</div>
        </div>

        <div className="project-list">
          {shown.length === 0 ? (
            <div className="empty-state">No projects logged yet.</div>
          ) : (
            shown.map((p) => <ProjectCard key={p.id} project={p} onOpen={() => setSelected(p)} />)
          )}
        </div>

        <div className="view-all-row">
          <Link href="/projects" className="view-all-btn">
            VIEW ALL PROJECTS →
          </Link>
        </div>
      </section>

      {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
