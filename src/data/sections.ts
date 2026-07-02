export type SectionType = "hero" | "projects" | "testimonials" | "stats" | "about" | "contact" | "footer";

export type TestimonialItem = { quote: string; who: string };
export type TestimonialsContent = { title: string; items: TestimonialItem[] };

export type StatItem = { value: string; label: string };
export type StatsContent = { items: StatItem[] };

export type AboutContent = { title: string; body: string };

export type SectionContent = TestimonialsContent | StatsContent | AboutContent | Record<string, never>;

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
];

export const BUILT_IN_SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  projects: "Project Grid",
  testimonials: "Testimonials",
  stats: "Stats Band",
  about: "About / Text",
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
