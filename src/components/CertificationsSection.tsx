import type { CertificationsContent } from "@/data/sections";
import { WireIcon } from "./WireIcon";

export function CertificationsSection({
  content,
  anchor,
}: {
  content: CertificationsContent;
  anchor: string;
}) {
  if (content.items.length === 0) return null;

  return (
    <section className="page-section" id={anchor || undefined}>
      <h3 className="section-title">{content.title}</h3>
      <div className="cert-grid">
        {content.items.map((item, i) => (
          <div className="cert-card" key={i}>
            <div className="cert-badge">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt="" />
              ) : (
                <WireIcon kind="cavity" opacity={0.4} />
              )}
            </div>
            <div className="cert-title">{item.title}</div>
            <div className="cert-meta">
              {item.issuer}
              {item.issuer && item.date ? " · " : ""}
              {item.date}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
