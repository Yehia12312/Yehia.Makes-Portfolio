import type { Project } from "@/data/projects";
import { WireIcon } from "./WireIcon";

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  return (
    <button type="button" className="card" onClick={onOpen}>
      <div className="card-thumb">
        <span className="card-tag">{project.code}</span>
        {project.modelUrl && <span className="card-3d-badge">● 3D</span>}
        {project.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.images[0]} alt="" className="card-thumb-img" />
        ) : (
          <WireIcon kind={project.icon} className="wireframe-icon" />
        )}
      </div>
      <div className="card-body">
        <div className="card-category">{project.category}</div>
        <div className="card-title">{project.title}</div>
        <div className="card-specs">
          <div className="spec-item">
            <span className="v">{project.time}</span>
            <span className="k">TIME</span>
          </div>
          <div className="spec-item">
            <span className="v">{project.cost}</span>
            <span className="k">COST</span>
          </div>
          <div className="spec-item">
            <span className="v">{project.tool}</span>
            <span className="k">TOOL</span>
          </div>
        </div>
      </div>
    </button>
  );
}
