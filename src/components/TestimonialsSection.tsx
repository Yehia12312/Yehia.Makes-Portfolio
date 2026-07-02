import type { TestimonialsContent } from "@/data/sections";

export function TestimonialsSection({ content, anchor }: { content: TestimonialsContent; anchor: string }) {
  if (content.items.length === 0) return null;

  return (
    <section className="page-section" id={anchor || undefined}>
      <h3 className="section-title">{content.title}</h3>
      <div className="review-cards standalone">
        {content.items.map((item, i) => (
          <div className="review-card" key={i}>
            <div className="quote-mark">&quot;</div>
            {item.quote}
            <div className="who">
              — {item.who}
              <span className="verified-badge">✓ VERIFIED</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
