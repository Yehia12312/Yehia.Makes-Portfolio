import { Nav } from "@/components/Nav";
import { PageViewTracker } from "@/components/PageViewTracker";
import { Work } from "@/components/Work";
import { Footer } from "@/components/Footer";
import { getCategories, getProjects, getSettings } from "@/lib/content";
import { buildColorOverrideCss } from "@/lib/colorOverrides";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, settings, categories] = await Promise.all([
    getProjects(),
    getSettings(),
    getCategories(),
  ]);

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
      <div className="projects-page-header">
        <div className="section-label">All Projects</div>
        <h1>The full register</h1>
      </div>
      <Work projects={projects} categories={categories} />
      <Footer />
    </>
  );
}
