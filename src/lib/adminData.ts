import "server-only";
import { getSupabaseAdmin, isSupabaseAdminConfigured, PROJECT_PHOTOS_BUCKET } from "./supabase";
import type { Project, Review, SiteSettings } from "@/data/projects";

export type Lead = {
  id: string;
  name: string;
  email: string;
  brief: string;
  status: "new" | "replied";
  slotDisplay: string | null;
  createdAt: string;
};

export type Booking = {
  id: string;
  name: string;
  email: string;
  slotIso: string;
  slotDisplay: string;
  createdAt: string;
};

/** Not a component — safe to call `Date.now()` here (React's purity rule only checks render bodies). */
export function isUpcomingBooking(slotIso: string, referenceTimeMs: number = Date.now()): boolean {
  return new Date(slotIso).getTime() > referenceTimeMs;
}

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
  featured: boolean;
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
    featured: input.featured,
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
  const row: Record<string, string | number | boolean | null | SiteSettings["navLinks"]> = {
    nav_links: settings.navLinks,
    logo_url: settings.logoUrl,
    logo_enabled: settings.logoEnabled,
    logo_width: settings.logoWidth,
    logo_position: settings.logoPosition,
  };
  for (const [column, key] of Object.entries(STRING_SETTINGS_COLUMNS)) {
    row[column] = settings[key] as string;
  }
  const { error } = await supabase.from("settings").upsert({ id: 1, ...row }, { onConflict: "id" });
  if (error) throw new Error(error.message);
}

export async function listCategoriesAdmin() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createCategory(name: string) {
  const supabase = getSupabaseAdmin();
  const { data: maxRow } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("categories").insert({ name, sort_order: nextSortOrder, enabled: true });
  if (error) throw new Error(error.message);
}

export async function renameCategory(id: string, name: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("categories").update({ name }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function toggleCategory(id: string, enabled: boolean) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("categories").update({ enabled }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteCategory(id: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function moveCategory(id: string, direction: "up" | "down") {
  const supabase = getSupabaseAdmin();
  const { data: rows, error } = await supabase
    .from("categories")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  if (!rows) return;

  const index = rows.findIndex((r) => r.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];
  await supabase.from("categories").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("categories").update({ sort_order: a.sort_order }).eq("id", b.id);
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

function rowToLead(row: Record<string, unknown>): Lead {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    brief: row.brief as string,
    status: row.status as "new" | "replied",
    slotDisplay: (row.slot_display as string | null) ?? null,
    createdAt: row.created_at as string,
  };
}

function rowToBooking(row: Record<string, unknown>): Booking {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    slotIso: row.slot_iso as string,
    slotDisplay: row.slot_display as string,
    createdAt: row.created_at as string,
  };
}

/** Best-effort: called from public /api routes, never blocks the actual email/booking. */
export async function recordLead(lead: {
  name: string;
  email: string;
  brief: string;
  slotDisplay: string | null;
}): Promise<void> {
  if (!isSupabaseAdminConfigured) return;
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("leads").insert({
      name: lead.name,
      email: lead.email,
      brief: lead.brief,
      slot_display: lead.slotDisplay,
    });
  } catch {
    // Never let analytics/logging failures break the actual contact flow.
  }
}

export async function recordBooking(booking: {
  name: string;
  email: string;
  slotIso: string;
  slotDisplay: string;
}): Promise<void> {
  if (!isSupabaseAdminConfigured) return;
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("bookings").insert({
      name: booking.name,
      email: booking.email,
      slot_iso: booking.slotIso,
      slot_display: booking.slotDisplay,
    });
  } catch {
    // Never let logging failures break a booking that already succeeded in Cal.com.
  }
}

export async function recordPageView(path: string): Promise<void> {
  if (!isSupabaseAdminConfigured) return;
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("page_views").insert({ path });
  } catch {
    // Analytics is best-effort; never surface a failure to the visitor.
  }
}

export async function listLeadsAdmin(): Promise<Lead[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToLead);
}

export async function setLeadStatus(id: string, status: "new" | "replied"): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteLead(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function listBookingsAdmin(): Promise<Booking[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("bookings").select("*").order("slot_iso", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToBooking);
}

export async function deleteBooking(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export type AnalyticsSummary = {
  viewsLast7Days: number;
  viewsLast30Days: number;
  dailyViews: { date: string; count: number }[];
  topProjects: { path: string; count: number }[];
};

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = getSupabaseAdmin();
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("page_views")
    .select("path, created_at")
    .gte("created_at", since30);
  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const since7 = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const dayBuckets = new Map<string, number>();
  const projectCounts = new Map<string, number>();
  let viewsLast7Days = 0;

  for (const row of rows) {
    const created = new Date(row.created_at as string);
    const dateKey = created.toISOString().slice(0, 10);
    dayBuckets.set(dateKey, (dayBuckets.get(dateKey) ?? 0) + 1);

    if (created.getTime() >= since7) viewsLast7Days++;

    const path = row.path as string;
    if (path.startsWith("project:")) {
      projectCounts.set(path, (projectCounts.get(path) ?? 0) + 1);
    }
  }

  const dailyViews: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    dailyViews.push({ date: d, count: dayBuckets.get(d) ?? 0 });
  }

  const topProjects = Array.from(projectCounts.entries())
    .map(([path, count]) => ({ path: path.replace("project:", ""), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return { viewsLast7Days, viewsLast30Days: rows.length, dailyViews, topProjects };
}
