import { isUpcomingBooking, type AnalyticsSummary, type Booking, type Lead } from "@/lib/adminData";

export function Overview({
  leads,
  bookings,
  analytics,
}: {
  leads: Lead[];
  bookings: Booking[];
  analytics: AnalyticsSummary;
}) {
  const newLeads = leads.filter((l) => l.status === "new").length;
  const upcomingBookings = bookings.filter((b) => isUpcomingBooking(b.slotIso)).length;
  const maxDaily = Math.max(1, ...analytics.dailyViews.map((d) => d.count));

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Overview</h2>
      </div>

      <div className="admin-stats-grid">
        <a href="/admin/leads" className="admin-stat-tile">
          <div className="num">{newLeads}</div>
          <div className="label">NEW LEADS</div>
        </a>
        <a href="/admin/bookings" className="admin-stat-tile">
          <div className="num">{upcomingBookings}</div>
          <div className="label">UPCOMING CALLS</div>
        </a>
        <div className="admin-stat-tile">
          <div className="num">{analytics.viewsLast7Days}</div>
          <div className="label">SITE VISITS (7D)</div>
        </div>
        <div className="admin-stat-tile">
          <div className="num">{analytics.viewsLast30Days}</div>
          <div className="label">SITE VISITS (30D)</div>
        </div>
      </div>

      <div className="admin-grid-2" style={{ marginTop: 24, alignItems: "start" }}>
        <div>
          <div className="admin-hint" style={{ margin: "0 0 10px" }}>
            PAGE VIEWS, LAST 14 DAYS
          </div>
          <div className="admin-trend-chart">
            {analytics.dailyViews.map((d) => (
              <div
                key={d.date}
                className="admin-trend-bar"
                style={{ height: `${Math.max(4, (d.count / maxDaily) * 100)}%` }}
                title={`${d.date}: ${d.count} view${d.count === 1 ? "" : "s"}`}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="admin-hint" style={{ margin: "0 0 10px" }}>
            MOST-VIEWED PROJECTS (30D)
          </div>
          {analytics.topProjects.length === 0 ? (
            <div className="admin-hint" style={{ margin: 0 }}>
              No project views logged yet.
            </div>
          ) : (
            <div className="admin-top-list">
              {analytics.topProjects.map((p) => (
                <div className="admin-top-list-row" key={p.path}>
                  <span>{p.path}</span>
                  <span className="admin-top-list-count">{p.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
