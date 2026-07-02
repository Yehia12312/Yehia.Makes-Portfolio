import Link from "next/link";
import { logoutAction } from "./actions";

export function AdminHeader({ active }: { active: "dashboard" | "leads" | "bookings" }) {
  return (
    <>
      <div className="admin-header">
        <div className="logo">
          <div className="logo-mark">
            <span>Y</span>
          </div>
          YEHIA.MAKES ADMIN
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
      <div className="admin-subnav">
        <Link href="/admin" className={`admin-subnav-link${active === "dashboard" ? " active" : ""}`}>
          Dashboard
        </Link>
        <Link href="/admin/leads" className={`admin-subnav-link${active === "leads" ? " active" : ""}`}>
          Leads
        </Link>
        <Link href="/admin/bookings" className={`admin-subnav-link${active === "bookings" ? " active" : ""}`}>
          Bookings
        </Link>
      </div>
    </>
  );
}
