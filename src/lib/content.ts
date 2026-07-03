import { getSupabasePublic, isSupabaseConfigured } from "./supabase";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PROJECTS,
  DEFAULT_SETTINGS,
  type Category,
  type NavLink,
  type Project,
  type SiteSettings,
} from "@/data/projects";
import { DEFAULT_SECTIONS, type Section, type SectionType } from "@/data/sections";

type ProjectRow = {
  id: string;
  code: string;
  category: string;
  title: string;
  time: string;
  cost: string;
  tool: string;
  icon: Project["icon"];
  images: string[];
  model_url: string | null;
  role: string;
  status: string;
  tools: string[];
  reviews: Project["reviews"];
  sort_order: number;
  featured: boolean;
};

type CategoryRow = {
  id: string;
  name: string;
  enabled: boolean;
  sort_order: number;
};

type SettingsRow = {
  hero_name: string;
  hero_disc: string;
  hero_rev: string;
  hero_prefix: string;
  hero_emphasis: string;
  hero_suffix: string;
  hero_lede: string;
  hero_direction: SiteSettings["heroDirection"];
  hero_text_align: SiteSettings["heroTextAlign"];
  hero_font_family: SiteSettings["heroFontFamily"];
  hero_font_size: number;
  stat_hours: string;
  stat_rating: string;
  stat_cert_value: string;
  stat_cert_label: string;
  color_bg: string;
  color_panel: string;
  color_panel_hover: string;
  color_text: string;
  color_text_dim: string;
  color_accent: string;
  color_verified: string;
  nav_links: NavLink[];
  nav_cta_label: string;
  nav_cta_anchor: string;
  logo_url: string | null;
  logo_enabled: boolean;
  logo_width: number;
  logo_position: SiteSettings["logoPosition"];
};

type SectionRow = {
  id: string;
  type: SectionType;
  enabled: boolean;
  sort_order: number;
  anchor: string;
  content: Section["content"];
};

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    code: row.code,
    category: row.category,
    title: row.title,
    time: row.time,
    cost: row.cost,
    tool: row.tool,
    icon: row.icon,
    images: row.images ?? [],
    modelUrl: row.model_url,
    role: row.role,
    status: row.status,
    tools: row.tools ?? [],
    reviews: row.reviews ?? [],
    sortOrder: row.sort_order,
    featured: row.featured ?? false,
  };
}

function rowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    enabled: row.enabled,
    sortOrder: row.sort_order,
  };
}

function rowToSettings(row: SettingsRow): SiteSettings {
  return {
    heroName: row.hero_name,
    heroDisc: row.hero_disc,
    heroRev: row.hero_rev,
    heroPrefix: row.hero_prefix,
    heroEmphasis: row.hero_emphasis,
    heroSuffix: row.hero_suffix,
    heroLede: row.hero_lede,
    heroDirection: row.hero_direction,
    heroTextAlign: row.hero_text_align,
    heroFontFamily: row.hero_font_family,
    heroFontSize: row.hero_font_size,
    statHours: row.stat_hours,
    statRating: row.stat_rating,
    statCertValue: row.stat_cert_value,
    statCertLabel: row.stat_cert_label,
    colorBg: row.color_bg,
    colorPanel: row.color_panel,
    colorPanelHover: row.color_panel_hover,
    colorText: row.color_text,
    colorTextDim: row.color_text_dim,
    colorAccent: row.color_accent,
    colorVerified: row.color_verified,
    navLinks: row.nav_links ?? [],
    navCtaLabel: row.nav_cta_label,
    navCtaAnchor: row.nav_cta_anchor,
    logoUrl: row.logo_url,
    logoEnabled: row.logo_enabled,
    logoWidth: row.logo_width,
    logoPosition: row.logo_position,
  };
}

function rowToSection(row: SectionRow): Section {
  return {
    id: row.id,
    type: row.type,
    enabled: row.enabled,
    sortOrder: row.sort_order,
    anchor: row.anchor,
    content: row.content ?? {},
  };
}

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return DEFAULT_PROJECTS;
  try {
    const supabase = getSupabasePublic();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_PROJECTS;
    return (data as ProjectRow[]).map(rowToProject);
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;
  try {
    const supabase = getSupabasePublic();
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    return rowToSettings(data as SettingsRow);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return DEFAULT_CATEGORIES;
  try {
    const supabase = getSupabasePublic();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("enabled", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_CATEGORIES;
    return (data as CategoryRow[]).map(rowToCategory);
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export async function getSections(): Promise<Section[]> {
  if (!isSupabaseConfigured) return DEFAULT_SECTIONS;
  try {
    const supabase = getSupabasePublic();
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .eq("enabled", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_SECTIONS;
    return (data as SectionRow[]).map(rowToSection);
  } catch {
    return DEFAULT_SECTIONS;
  }
}
