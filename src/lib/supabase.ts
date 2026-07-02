import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);
export const isSupabaseAdminConfigured = Boolean(url && serviceRoleKey);

let publicClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

export function getSupabasePublic(): SupabaseClient {
  if (!url || !anonKey) throw new Error("Supabase is not configured.");
  if (!publicClient) {
    publicClient = createClient(url, anonKey, { auth: { persistSession: false } });
  }
  return publicClient;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!url || !serviceRoleKey) throw new Error("Supabase admin access is not configured.");
  if (!adminClient) {
    adminClient = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  }
  return adminClient;
}

// Holds project photos and 3D model (.glb/.gltf) files — named for its original
// purpose, kept as-is since it's already live with real files.
export const PROJECT_PHOTOS_BUCKET = "project-photos";
