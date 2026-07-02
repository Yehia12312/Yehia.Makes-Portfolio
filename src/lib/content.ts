import { getSupabasePublic, isSupabaseConfigured } from "./supabase";
import { DEFAULT_PROJECTS, DEFAULT_SETTINGS, type Project, type SiteSettings } from "@/data/projects";

type ProjectRow = {
  id: string;
  code: string;
  category: string;
  title: string;
  time: string;
  cost: string;
  tool: string;
  has3d: boolean;
  icon: Project["icon"];
  image_url: string | null;
  role: string;
  status: string;
  tools: string[];
  reviews: Project["reviews"];
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
    has3d: row.has3d,
    icon: row.icon,
    imageUrl: row.image_url,
    role: row.role,
    status: row.status,
    tools: row.tools ?? [],
    reviews: row.reviews ?? [],
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
