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

export async function updateProjectMedia(
  id: string,
  media: { images: string[]; modelUrl: string | null }
) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("projects")
    .update({ images: media.images, model_url: media.modelUrl })
    .eq("id", id);
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

/**
 * Photos and 3D model files upload directly from the browser to Supabase Storage
 * (not through this server's Server Actions), because Vercel serverless functions
 * cap request bodies at a few MB — too small for real photos or GLB files. This
 * issues a one-time signed URL the browser can PUT the file to directly.
 */
export async function createMediaUploadTicket(
  originalName: string
): Promise<{ signedUrl: string; publicUrl: string }> {
  const supabase = getSupabaseAdmin();
  const ext = originalName.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(PROJECT_PHOTOS_BUCKET)
    .createSignedUploadUrl(path);
  if (error) throw new Error(error.message);

  const { data: publicData } = supabase.storage.from(PROJECT_PHOTOS_BUCKET).getPublicUrl(path);
  return { signedUrl: data.signedUrl, publicUrl: publicData.publicUrl };
}

const STRING_SETTINGS_COLUMNS: Record<string, keyof SiteSettings> = {
  hero_name: "heroName",
  hero_disc: "heroDisc",
  hero_rev: "heroRev",
  hero_prefix: "heroPrefix",
  hero_emphasis: "heroEmphasis",
  hero_suffix: "heroSuffix",
  hero_lede: "heroLede",
  stat_hours: "statHours",
  stat_rating: "statRating",
  stat_cert_value: "statCertValue",
  stat_cert_label: "statCertLabel",
  color_bg: "colorBg",
  color_panel: "colorPanel",
  color_panel_hover: "colorPanelHover",
  color_text: "colorText",
  color_text_dim: "colorTextDim",
  color_accent: "colorAccent",
  color_verified: "colorVerified",
  nav_cta_label: "navCtaLabel",
  nav_cta_anchor: "navCtaAnchor",
};

export async function updateSettings(settings: SiteSettings) {
  const supabase = getSupabaseAdmin();
  const row: Record<string, string | SiteSettings["navLinks"]> = { nav_links: settings.navLinks };
  for (const [column, key] of Object.entries(STRING_SETTINGS_COLUMNS)) {
    row[column] = settings[key] as string;
  }
  const { error } = await supabase.from("settings").upsert({ id: 1, ...row }, { onConflict: "id" });
  if (error) throw new Error(error.message);
}

export async function listSectionsAdmin() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("sections").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSectionAdmin(id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("sections").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function createSection(type: string, anchor: string, content: object) {
  const supabase = getSupabaseAdmin();
  const { data: maxRow } = await supabase
    .from("sections")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("sections")
    .insert({ type, anchor, content, sort_order: nextSortOrder, enabled: true })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateSection(
  id: string,
  fields: { anchor?: string; content?: object; enabled?: boolean }
) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("sections").update(fields).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteSection(id: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("sections").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function moveSection(id: string, direction: "up" | "down") {
  const supabase = getSupabaseAdmin();
  const { data: rows, error } = await supabase
    .from("sections")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  if (!rows) return;

  const index = rows.findIndex((r) => r.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];
  await supabase.from("sections").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("sections").update({ sort_order: a.sort_order }).eq("id", b.id);
}
