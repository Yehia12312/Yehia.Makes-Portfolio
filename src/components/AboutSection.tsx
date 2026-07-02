import type { AboutContent } from "@/data/sections";

export function AboutSection({ content, anchor }: { content: AboutContent; anchor: string }) {
  return (
    <section className="page-section" id={anchor || undefined}>
      <h3 className="section-title">{content.title}</h3>
      <p className="about-body">{content.body}</p>
    </section>
  );
}
