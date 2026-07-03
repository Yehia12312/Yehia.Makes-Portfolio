import type { LogosContent } from "@/data/sections";

export function LogosSection({ content, anchor }: { content: LogosContent; anchor: string }) {
  const items = content.items.filter((item) => item.imageUrl);
  if (items.length === 0) return null;

  return (
    <section className="page-section" id={anchor || undefined}>
      {content.title && <h3 className="section-title">{content.title}</h3>}
      <div className="logos-strip">
        {items.map((item, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={item.imageUrl} alt={item.name} className="logos-strip-img" />
        ))}
      </div>
    </section>
  );
}
