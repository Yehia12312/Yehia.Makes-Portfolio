import type { LogoPosition, NavLink } from "@/data/projects";

export function Nav({
  navLinks,
  ctaLabel,
  ctaAnchor,
  logoUrl,
  logoEnabled,
  logoWidth,
  logoPosition,
}: {
  navLinks: NavLink[];
  ctaLabel: string;
  ctaAnchor: string;
  logoUrl: string | null;
  logoEnabled: boolean;
  logoWidth: number;
  logoPosition: LogoPosition;
}) {
  const logo = logoEnabled && logoUrl && (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoUrl} alt="" className="logo-img" style={{ width: logoWidth, height: "auto" }} />
  );

  return (
    <nav className="nav">
      <div className="logo">
        {logo && logoPosition === "before" && logo}
        YEHIA.MAKES
        {logo && logoPosition === "after" && logo}
      </div>
      <input type="checkbox" id="nav-toggle" className="nav-toggle-checkbox" />
      <div className="nav-links">
        {navLinks.map((link) => (
          <a key={link.anchor} href={`#${link.anchor}`}>
            {link.label}
          </a>
        ))}
      </div>
      <div className="nav-right">
        <a href={`#${ctaAnchor}`} className="nav-cta">
          {ctaLabel}
        </a>
        <label htmlFor="nav-toggle" className="nav-toggle-label" aria-label="Toggle menu">
          ☰
        </label>
      </div>
    </nav>
  );
}
