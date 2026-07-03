import type { ExperienceContent } from "@/data/sections";

export function ExperienceSection({ content, anchor }: { content: ExperienceContent; anchor: string }) {
  if (content.items.length === 0) return null;

  return (
    <section className="page-section" id={anchor || undefined}>
      <h3 className="section-title">Experience</h3>
      <div className="experience-list">
        {content.items.map((item, i) => (
          <div className="experience-item" key={i}>
            <div className="experience-period">{item.period}</div>
            <div className="experience-body">
              <div className="experience-role">{item.role}</div>
              <div className="experience-org">{item.org}</div>
              {item.description && <p className="experience-desc">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
