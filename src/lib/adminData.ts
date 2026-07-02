import "server-only";
import { getSupabaseAdmin, PROJECT_PHOTOS_BUCKET } from "./supabase";
import type { Project, Review, SiteSettings } from "@/data/projects";

export type ProjectInput = {
  code: string;
  category: string;
  title: string;
  time: string;
  cost: string;
  tool: string;
  has3d: boolean;
  icon: Project["icon"];
  role: string;
  status: string;
  tools: string[];
  reviews: Review[];
};

function toRow(input: ProjectInput) {
  return {
    code: input.code,
    category: input.category,
    title: input.title,
    time: input.time,
    cost: input.cost,
    tool: input.tool,
    has3d: input.has3d,
    icon: input.icon,
    role: input.role,
    status: input.status,
    tools: input.tools,
    reviews: input.reviews,
  };
}

export async function listProjectsAdmin() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProjectAdmin(id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function createProject(input: ProjectInput) {
  const supabase = getSupabaseAdmin();
  const { data: maxRow } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...toRow(input), sort_order: nextSortOrder })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProject(id: string, input: ProjectInput) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("projects").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteProject(id: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setProjectPhoto(id: string, imageUrl: string | null) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("projects").update({ image_url: imageUrl }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function moveProject(id: string, direction: "up" | "down") {
  const supabase = getSupabaseAdmin();
  const { data: rows, error } = await supabase
    .from("projects")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  if (!rows) return;

  const index = rows.findIndex((r) => r.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];
  await supabase.from("projects").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("projects").update({ sort_order: a.sort_order }).eq("id", b.id);
}

export async function uploadProjectPhoto(file: File): Promise<string> {
  const supabase = getSupabaseAdmin();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(PROJECT_PHOTOS_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(PROJECT_PHOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

const SETTINGS_COLUMNS: Record<keyof SiteSettings, string> = {
  heroName: "hero_name",
  heroDisc: "hero_disc",
  heroRev: "hero_rev",
  heroPrefix: "hero_prefix",
  heroEmphasis: "hero_emphasis",
  heroSuffix: "hero_suffix",
  heroLede: "hero_lede",
  statHours: "stat_hours",
  statRating: "stat_rating",
  statCertValue: "stat_cert_value",
  statCertLabel: "stat_cert_label",
  colorBg: "color_bg",
  colorPanel: "color_panel",
  colorPanelHover: "color_panel_hover",
  colorText: "color_text",
  colorTextDim: "color_text_dim",
  colorAccent: "color_accent",
  colorVerified: "color_verified",
};

export async function updateSettings(settings: SiteSettings) {
  const supabase = getSupabaseAdmin();
  const row: Record<string, string> = {};
  for (const key of Object.keys(SETTINGS_COLUMNS) as (keyof SiteSettings)[]) {
    row[SETTINGS_COLUMNS[key]] = settings[key];
  }
  const { error } = await supabase.from("settings").upsert({ id: 1, ...row });
  if (error) throw new Error(error.message);
}
