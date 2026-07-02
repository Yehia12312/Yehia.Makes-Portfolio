import type { StatsContent } from "@/data/sections";

export function StatsSection({ content, anchor }: { content: StatsContent; anchor: string }) {
  if (content.items.length === 0) return null;

  return (
    <section className="page-section" id={anchor || undefined}>
      <div className="hero-stats standalone">
        {content.items.map((item, i) => (
          <div className="hero-stat" key={i}>
            <div className="num">{item.value}</div>
            <div className="label">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
