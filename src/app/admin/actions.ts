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
  createProject,
  deleteProject,
  moveProject,
  setProjectPhoto,
  updateProject,
  updateSettings,
  uploadProjectPhoto,
  type ProjectInput,
} from "@/lib/adminData";
import { isSupabaseAdminConfigured } from "@/lib/supabase";
import type { IconKind, Review, SiteSettings } from "@/data/projects";

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
    has3d: formData.get("has3d") === "on",
    icon: String(formData.get("icon") ?? "roll") as IconKind,
    role: String(formData.get("role") ?? "").trim(),
    status: String(formData.get("status") ?? "").trim(),
    tools,
    reviews,
  };
}

export async function saveProjectAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  if (!isSupabaseAdminConfigured) {
    throw new Error("Supabase isn't configured yet — add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  const id = String(formData.get("id") ?? "").trim();
  const input = parseProjectInput(formData);

  let projectId = id;
  if (id) {
    await updateProject(id, input);
  } else {
    const created = await createProject(input);
    projectId = created.id;
  }

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const url = await uploadProjectPhoto(photo);
    await setProjectPhoto(projectId, url);
  } else if (formData.get("removePhoto") === "on") {
    await setProjectPhoto(projectId, null);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteProject(id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function moveProjectAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (id) await moveProject(id, direction);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveSettingsAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  if (!isSupabaseAdminConfigured) {
    throw new Error("Supabase isn't configured yet — add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

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
  };

  await updateSettings(settings);
  revalidatePath("/");
  revalidatePath("/admin");
}
