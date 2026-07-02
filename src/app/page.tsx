import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { getProjects, getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function safeColor(value: string, fallback: string): string {
  return HEX_COLOR.test(value) ? value : fallback;
}

export default async function Home() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);

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
      <div className="blueprint-bg" />
      <Nav />
      <Hero settings={settings} projectCount={projects.length} />
      <Work projects={projects} />
      <ContactSection />
      <Footer />
    </>
  );
}
