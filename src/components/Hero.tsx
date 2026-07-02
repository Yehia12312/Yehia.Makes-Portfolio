import type { SiteSettings } from "@/data/projects";

export function Hero({ settings, projectCount }: { settings: SiteSettings; projectCount: number }) {
  const stats = [
    { num: String(projectCount).padStart(2, "0"), label: "PROJECTS LOGGED" },
    { num: settings.statHours, label: "TOTAL HOURS TRACKED" },
    { num: settings.statRating, label: "AVG CLIENT RATING" },
    { num: settings.statCertValue, label: settings.statCertLabel },
  ];

  return (
    <section className="hero" id="about">
      <div className="title-block">
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
      <h1>
        {settings.heroPrefix}
        <em>{settings.heroEmphasis}</em>
        {settings.heroSuffix}
      </h1>
      <p className="lede">{settings.heroLede}</p>
      <div className="hero-stats">
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
