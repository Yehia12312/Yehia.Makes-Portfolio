import { Nav } from "@/components/Nav";
import { PageViewTracker } from "@/components/PageViewTracker";
import { Hero } from "@/components/Hero";
import { FeaturedWork } from "@/components/FeaturedWork";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { StatsSection } from "@/components/StatsSection";
import { AboutSection } from "@/components/AboutSection";
import { getProjects, getSections, getSettings } from "@/lib/content";
import { buildColorOverrideCss } from "@/lib/colorOverrides";
import type { AboutContent, StatsContent, TestimonialsContent } from "@/data/sections";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, settings, sections] = await Promise.all([getProjects(), getSettings(), getSections()]);

  const colorOverrides = buildColorOverrideCss(settings);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: colorOverrides }} />
      <PageViewTracker />
      <div className="blueprint-bg" />
      <Nav
        navLinks={settings.navLinks}
        ctaLabel={settings.navCtaLabel}
        ctaAnchor={settings.navCtaAnchor}
        logoUrl={settings.logoUrl}
        logoEnabled={settings.logoEnabled}
        logoWidth={settings.logoWidth}
        logoPosition={settings.logoPosition}
      />
      {sections.map((section) => {
        switch (section.type) {
          case "hero":
            return <Hero key={section.id} settings={settings} projectCount={projects.length} />;
          case "projects":
            return <FeaturedWork key={section.id} projects={projects} anchor={section.anchor || "work"} />;
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
