import { notFound } from "next/navigation";
import { getProjects } from "@/lib/content";
import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { ProjectForm } from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);

  if (!project) notFound();

  return (
    <div className="admin-shell">
      {!isSupabaseAdminConfigured && (
        <div className="form-error" style={{ marginBottom: 24 }}>
          Supabase isn&apos;t connected yet — saving will fail. Add SUPABASE_URL and
          SUPABASE_SERVICE_ROLE_KEY to your environment first (see README).
        </div>
      )}
      <ProjectForm project={project} />
    </div>
  );
}
