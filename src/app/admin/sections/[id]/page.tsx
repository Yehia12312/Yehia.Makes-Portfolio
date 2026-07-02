import { notFound } from "next/navigation";
import { getSectionAdmin } from "@/lib/adminData";
import type { Section, SectionType } from "@/data/sections";
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
      <SectionForm section={section} />
    </div>
  );
}
