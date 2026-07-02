import { HERO_STATS } from "@/data/projects";

export function Hero() {
  return (
    <section className="hero" id="about">
      <div className="title-block">
        <span>
          NAME: <b>YEHIA EL MOHAMADY</b>
        </span>
        <span>
          DISC: <b>MFG / MOLD DESIGN</b>
        </span>
        <span>
          REV: <b>2026.01</b>
        </span>
      </div>
      <h1>
        Design work that&apos;s been <em>built</em>, not just rendered.
      </h1>
      <p className="lede">
        A working register of mold design, reverse engineering, and mechanical
        projects — each one with the real numbers attached: time spent, cost,
        and the tools used to get there.
      </p>
      <div className="hero-stats">
        {HERO_STATS.map((stat) => (
          <div className="hero-stat" key={stat.label}>
            <div className="num">{stat.num}</div>
            <div className="label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
