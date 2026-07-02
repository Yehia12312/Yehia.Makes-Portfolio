import type { NavLink } from "@/data/projects";

export function Nav({
  navLinks,
  ctaLabel,
  ctaAnchor,
}: {
  navLinks: NavLink[];
  ctaLabel: string;
  ctaAnchor: string;
}) {
  return (
    <nav className="nav">
      <div className="logo">
        <div className="logo-mark">
          <span>Y</span>
        </div>
        YEHIA.MAKES
      </div>
      <div className="nav-links">
        {navLinks.map((link) => (
          <a key={link.anchor} href={`#${link.anchor}`}>
            {link.label}
          </a>
        ))}
      </div>
      <a href={`#${ctaAnchor}`} className="nav-cta">
        {ctaLabel}
      </a>
    </nav>
  );
}
