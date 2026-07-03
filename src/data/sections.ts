export type SectionType =
  | "hero"
  | "projects"
  | "testimonials"
  | "stats"
  | "about"
  | "certifications"
  | "logos"
  | "experience"
  | "contact"
  | "footer";

export type TestimonialItem = { quote: string; who: string };
export type TestimonialsContent = { title: string; items: TestimonialItem[] };

export type StatItem = { value: string; label: string };
export type StatsContent = { items: StatItem[] };

export type AboutContent = { title: string; body: string };

export type CertificationItem = { title: string; issuer: string; date: string; imageUrl: string | null };
export type CertificationsContent = { title: string; items: CertificationItem[] };

export type LogoItem = { name: string; imageUrl: string };
export type LogosContent = { title: string; items: LogoItem[] };

export type ExperienceItem = { role: string; org: string; period: string; description: string };
export type ExperienceContent = { items: ExperienceItem[] };

export type SectionContent =
  | TestimonialsContent
  | StatsContent
  | AboutContent
  | CertificationsContent
  | LogosContent
  | ExperienceContent
  | Record<string, never>;

export type Section = {
  id: string;
  type: SectionType;
  enabled: boolean;
  sortOrder: number;
  anchor: string;
  content: SectionContent;
};

/** Section types an admin can add more than one of, from the admin UI. */
export const ADDABLE_SECTION_TYPES: { type: SectionType; label: string }[] = [
  { type: "testimonials", label: "Testimonials" },
  { type: "stats", label: "Stats Band" },
  { type: "about", label: "About / Text" },
  { type: "experience", label: "Experience" },
  { type: "certifications", label: "Certifications" },
  { type: "logos", label: "Company Logos" },
];

export const BUILT_IN_SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  projects: "Project Grid",
  testimonials: "Testimonials",
  stats: "Stats Band",
  about: "About / Text",
  certifications: "Certifications",
  logos: "Company Logos",
  experience: "Experience",
  contact: "Contact",
  footer: "Footer",
};

export function defaultContentFor(type: SectionType): SectionContent {
  switch (type) {
    case "testimonials":
      return { title: "What people say", items: [{ quote: "", who: "" }] } satisfies TestimonialsContent;
    case "stats":
      return { items: [{ value: "", label: "" }] } satisfies StatsContent;
    case "about":
      return { title: "About", body: "" } satisfies AboutContent;
    case "certifications":
      return {
        title: "Certifications",
        items: [{ title: "", issuer: "", date: "", imageUrl: null }],
      } satisfies CertificationsContent;
    case "logos":
      return { title: "Worked with", items: [{ name: "", imageUrl: "" }] } satisfies LogosContent;
    case "experience":
      return { items: [{ role: "", org: "", period: "", description: "" }] } satisfies ExperienceContent;
    default:
      return {};
  }
}

export const DEFAULT_SECTIONS: Section[] = [
  { id: "hero", type: "hero", enabled: true, sortOrder: 0, anchor: "about", content: {} },
  { id: "projects", type: "projects", enabled: true, sortOrder: 1, anchor: "work", content: {} },
  { id: "contact", type: "contact", enabled: true, sortOrder: 2, anchor: "contact", content: {} },
  { id: "footer", type: "footer", enabled: true, sortOrder: 3, anchor: "", content: {} },
];
