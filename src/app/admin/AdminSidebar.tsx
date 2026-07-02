import Link from "next/link";
import { logoutAction } from "./actions";

type AdminSection = "dashboard" | "leads" | "bookings" | "projects" | "categories" | "sections" | "settings";

const NAV_GROUPS: { label: string; items: { href: string; section: AdminSection; label: string }[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", section: "dashboard", label: "Dashboard" }],
  },
  {
    label: "Inbox",
    items: [
      { href: "/admin/leads", section: "leads", label: "Leads" },
      { href: "/admin/bookings", section: "bookings", label: "Bookings" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/projects", section: "projects", label: "Projects" },
      { href: "/admin/categories", section: "categories", label: "Categories" },
      { href: "/admin/sections", section: "sections", label: "Site Sections" },
      { href: "/admin/settings", section: "settings", label: "Nav, Hero & Colors" },
    ],
  },
];

export function AdminSidebar({ active }: { active: AdminSection }) {
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="logo-mark">
          <span>Y</span>
        </div>
        YEHIA.MAKES
      </div>

      <nav className="admin-sidebar-nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="admin-sidebar-group-label">{group.label}</div>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-sidebar-link${active === item.section ? " active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <a href="/" target="_blank" rel="noreferrer" className="admin-btn">
          VIEW SITE →
        </a>
        <form action={logoutAction}>
          <button type="submit" className="admin-btn">
            LOG OUT
          </button>
        </form>
      </div>
    </div>
  );
}
