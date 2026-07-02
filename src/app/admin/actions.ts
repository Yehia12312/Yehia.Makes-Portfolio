"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_DURATION_SECONDS,
  checkAdminPassword,
  createSessionToken,
  requireAdminSession,
} from "@/lib/adminAuth";
import {
  createMediaUploadTicket,
  createProject,
  createSection,
  deleteProject,
  deleteSection,
  moveProject,
  moveSection,
  updateProject,
  updateProjectMedia,
  updateSection,
  updateSettings,
  type ProjectInput,
} from "@/lib/adminData";
import { isSupabaseAdminConfigured } from "@/lib/supabase";
import type { IconKind, NavLink, Review, SiteSettings } from "@/data/projects";
import { defaultContentFor, type SectionType } from "@/data/sections";

function requireSupabaseConfigured(): void {
  if (!isSupabaseAdminConfigured) {
    throw new Error("Supabase isn't configured yet — add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
}

export type LoginState = { error?: string } | undefined;

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return { error: "Admin login isn't configured yet (missing ADMIN_PASSWORD / ADMIN_SESSION_SECRET)." };
  }

  if (!checkAdminPassword(password)) {
    return { error: "Wrong password." };
  }

  const token = await createSessionToken();
  (await cookies()).set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  });

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

function parseProjectInput(formData: FormData): ProjectInput {
  const tools = formData.getAll("tools").map(String).map((t) => t.trim()).filter(Boolean);
  const whos = formData.getAll("reviewWho").map(String);
  const quotes = formData.getAll("reviewQuote").map(String);
  const reviews: Review[] = whos
    .map((who, i) => ({ who: who.trim(), quote: (quotes[i] ?? "").trim() }))
    .filter((r) => r.who && r.quote);

  return {
    code: String(formData.get("code") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    time: String(formData.get("time") ?? "").trim(),
    cost: String(formData.get("cost") ?? "").trim(),
    tool: String(formData.get("tool") ?? "").trim(),
    icon: String(formData.get("icon") ?? "roll") as IconKind,
    role: String(formData.get("role") ?? "").trim(),
    status: String(formData.get("status") ?? "").trim(),
    tools,
    reviews,
  };
}

/**
 * Called directly from the client (not as a <form action>) before the rest of
 * the project form submits, so photo/model bytes go straight from the browser
 * to Supabase Storage instead of through this server.
 */
export async function createMediaUploadTicketAction(
  fileName: string
): Promise<{ signedUrl: string; publicUrl: string }> {
  await requireAdminSession();
  requireSupabaseConfigured();
  return createMediaUploadTicket(fileName);
}

export async function saveProjectAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  requireSupabaseConfigured();

  const id = String(formData.get("id") ?? "").trim();
  const input = parseProjectInput(formData);

  let projectId = id;
  if (id) {
    await updateProject(id, input);
  } else {
    const created = await createProject(input);
    projectId = created.id;
  }

  const images = formData.getAll("images").map(String).filter(Boolean);
  const modelUrl = String(formData.get("modelUrl") ?? "").trim() || null;
  await updateProjectMedia(projectId, { images, modelUrl });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  requireSupabaseConfigured();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteProject(id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function moveProjectAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  requireSupabaseConfigured();
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (id) await moveProject(id, direction);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveSettingsAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  requireSupabaseConfigured();

  const settings: SiteSettings = {
    heroName: String(formData.get("heroName") ?? ""),
    heroDisc: String(formData.get("heroDisc") ?? ""),
    heroRev: String(formData.get("heroRev") ?? ""),
    heroPrefix: String(formData.get("heroPrefix") ?? ""),
    heroEmphasis: String(formData.get("heroEmphasis") ?? ""),
    heroSuffix: String(formData.get("heroSuffix") ?? ""),
    heroLede: String(formData.get("heroLede") ?? ""),
    statHours: String(formData.get("statHours") ?? ""),
    statRating: String(formData.get("statRating") ?? ""),
    statCertValue: String(formData.get("statCertValue") ?? ""),
    statCertLabel: String(formData.get("statCertLabel") ?? ""),
    colorBg: String(formData.get("colorBg") ?? ""),
    colorPanel: String(formData.get("colorPanel") ?? ""),
    colorPanelHover: String(formData.get("colorPanelHover") ?? ""),
    colorText: String(formData.get("colorText") ?? ""),
    colorTextDim: String(formData.get("colorTextDim") ?? ""),
    colorAccent: String(formData.get("colorAccent") ?? ""),
    colorVerified: String(formData.get("colorVerified") ?? ""),
    navLinks: parseNavLinks(formData),
    navCtaLabel: String(formData.get("navCtaLabel") ?? ""),
    navCtaAnchor: String(formData.get("navCtaAnchor") ?? ""),
  };

  await updateSettings(settings);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}

function parseNavLinks(formData: FormData): NavLink[] {
  const labels = formData.getAll("navLinkLabel").map(String);
  const anchors = formData.getAll("navLinkAnchor").map(String);
  return labels
    .map((label, i) => ({ label: label.trim(), anchor: (anchors[i] ?? "").trim() }))
    .filter((l) => l.label && l.anchor);
}

const BUILT_IN_SECTION_TYPES: SectionType[] = ["hero", "projects", "contact", "footer"];

export async function addSectionAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  requireSupabaseConfigured();
  const type = String(formData.get("type") ?? "") as SectionType;
  const created = await createSection(type, "", defaultContentFor(type));
  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/admin/sections/${created.id}`);
}

export async function toggleSectionAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  requireSupabaseConfigured();
  const id = String(formData.get("id") ?? "");
  const enabled = formData.get("enabled") === "on";
  if (id) await updateSection(id, { enabled });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function moveSectionAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  requireSupabaseConfigured();
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (id) await moveSection(id, direction);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteSectionAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  requireSupabaseConfigured();
  const id = String(formData.get("id") ?? "");
  const type = String(formData.get("type") ?? "") as SectionType;
  if (BUILT_IN_SECTION_TYPES.includes(type)) {
    throw new Error(`"${type}" is a built-in section — disable it instead of deleting it.`);
  }
  if (id) await deleteSection(id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveSectionContentAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  requireSupabaseConfigured();

  const id = String(formData.get("id") ?? "");
  const type = String(formData.get("type") ?? "") as SectionType;
  const enabled = formData.get("enabled") === "on";

  let content: object;
  if (type === "testimonials") {
    const whos = formData.getAll("itemWho").map(String);
    const quotes = formData.getAll("itemQuote").map(String);
    content = {
      title: String(formData.get("title") ?? ""),
      items: whos
        .map((who, i) => ({ who: who.trim(), quote: (quotes[i] ?? "").trim() }))
        .filter((i) => i.who && i.quote),
    };
  } else if (type === "stats") {
    const values = formData.getAll("itemValue").map(String);
    const labels = formData.getAll("itemLabel").map(String);
    content = {
      items: values
        .map((value, i) => ({ value: value.trim(), label: (labels[i] ?? "").trim() }))
        .filter((i) => i.value && i.label),
    };
  } else if (type === "about") {
    content = {
      title: String(formData.get("title") ?? ""),
      body: String(formData.get("body") ?? ""),
    };
  } else {
    content = {};
  }

  await updateSection(id, { anchor: String(formData.get("anchor") ?? "").trim(), content, enabled });
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}
