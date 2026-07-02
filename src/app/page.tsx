import { Nav } from "@/components/Nav";
import { PageViewTracker } from "@/components/PageViewTracker";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { StatsSection } from "@/components/StatsSection";
import { AboutSection } from "@/components/AboutSection";
import { getProjects, getSections, getSettings } from "@/lib/content";
import type { AboutContent, StatsContent, TestimonialsContent } from "@/data/sections";

export const dynamic = "force-dynamic";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function safeColor(value: string, fallback: string): string {
  return HEX_COLOR.test(value) ? value : fallback;
}

export default async function Home() {
  const [projects, settings, sections] = await Promise.all([getProjects(), getSettings(), getSections()]);

  const colorOverrides = `:root {
  --bg: ${safeColor(settings.colorBg, "#0B0E11")};
  --panel: ${safeColor(settings.colorPanel, "#1A1F26")};
  --panel-hover: ${safeColor(settings.colorPanelHover, "#20262E")};
  --text: ${safeColor(settings.colorText, "#E8E6E0")};
  --text-dim: ${safeColor(settings.colorTextDim, "#6B7280")};
  --accent: ${safeColor(settings.colorAccent, "#FF6B35")};
  --verified: ${safeColor(settings.colorVerified, "#2DD4BF")};
}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: colorOverrides }} />
      <PageViewTracker />
      <div className="blueprint-bg" />
      <Nav navLinks={settings.navLinks} ctaLabel={settings.navCtaLabel} ctaAnchor={settings.navCtaAnchor} />
      {sections.map((section) => {
        switch (section.type) {
          case "hero":
            return <Hero key={section.id} settings={settings} projectCount={projects.length} />;
          case "projects":
            return <Work key={section.id} projects={projects} />;
          case "testimonials":
            return (
              <TestimonialsSection
                key={section.id}
                content={section.content as TestimonialsContent}
                anchor={section.anchor}
              />
            );
          case "stats":
            return (
              <StatsSection key={section.id} content={section.content as StatsContent} anchor={section.anchor} />
            );
          case "about":
            return (
              <AboutSection key={section.id} content={section.content as AboutContent} anchor={section.anchor} />
            );
          case "contact":
            return <ContactSection key={section.id} />;
          case "footer":
            return <Footer key={section.id} />;
          default:
            return null;
        }
      })}
    </>
  );
}
