import type { SiteSettings } from "@/data/projects";

export function Hero({ settings, projectCount }: { settings: SiteSettings; projectCount: number }) {
  const stats = [
    { num: String(projectCount).padStart(2, "0"), label: "PROJECTS LOGGED" },
    { num: settings.statHours, label: "TOTAL HOURS TRACKED" },
    { num: settings.statRating, label: "AVG CLIENT RATING" },
    { num: settings.statCertValue, label: settings.statCertLabel },
  ];

  const headlineStyle: React.CSSProperties = {
    textAlign: settings.heroTextAlign,
    fontSize: settings.heroFontSize,
    fontFamily: settings.heroFontFamily === "arabic" ? "var(--font-arabic)" : undefined,
  };

  return (
    <section className="hero" id="about" dir={settings.heroDirection}>
      <div className="title-block" style={{ textAlign: settings.heroTextAlign }}>
        <span>
          NAME: <b>{settings.heroName}</b>
        </span>
        <span>
          DISC: <b>{settings.heroDisc}</b>
        </span>
        <span>
          REV: <b>{settings.heroRev}</b>
        </span>
      </div>
      <h1 style={headlineStyle}>
        {settings.heroPrefix}
        <em>{settings.heroEmphasis}</em>
        {settings.heroSuffix}
      </h1>
      <p
        className="lede"
        style={{
          textAlign: settings.heroTextAlign,
          fontFamily: settings.heroFontFamily === "arabic" ? "var(--font-arabic)" : undefined,
        }}
      >
        {settings.heroLede}
      </p>
      <div className="hero-stats" style={{ textAlign: settings.heroTextAlign }}>
        {stats.map((stat) => (
          <div className="hero-stat" key={stat.label}>
            <div className="num">{stat.num}</div>
            <div className="label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
