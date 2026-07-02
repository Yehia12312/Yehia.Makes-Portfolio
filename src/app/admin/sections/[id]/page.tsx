import { notFound } from "next/navigation";
import { getSectionAdmin } from "@/lib/adminData";
import type { Section, SectionType } from "@/data/sections";
import { AdminSidebar } from "../../AdminSidebar";
import { SectionForm } from "../SectionForm";

export const dynamic = "force-dynamic";

export default async function EditSectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getSectionAdmin(id);
  if (!row) notFound();

  const section: Section = {
    id: row.id,
    type: row.type as SectionType,
    enabled: row.enabled,
    sortOrder: row.sort_order,
    anchor: row.anchor,
    content: row.content ?? {},
  };

  return (
    <div className="admin-shell">
      <AdminSidebar active="sections" />
      <div className="admin-main">
        <SectionForm section={section} />
      </div>
    </div>
  );
}
