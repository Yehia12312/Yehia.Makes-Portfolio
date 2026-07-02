import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { isUpcomingBooking, listBookingsAdmin } from "@/lib/adminData";
import { AdminHeader } from "../AdminHeader";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import { deleteBookingAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const bookings = isSupabaseAdminConfigured ? await listBookingsAdmin() : [];

  return (
    <div className="admin-shell">
      <AdminHeader active="bookings" />

      {!isSupabaseAdminConfigured && (
        <div className="form-error" style={{ margin: "24px 48px 0" }}>
          Supabase isn&apos;t connected yet — bookings can&apos;t be stored or shown here. Add
          SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your environment (see README).
        </div>
      )}

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Bookings</h2>
        </div>
        <p className="admin-hint">
          Every call confirmed through the site, soonest first. These are also real bookings in
          your Cal.com calendar — this is just a browsable record.
        </p>

        {bookings.length === 0 ? (
          <div className="admin-row-empty">No bookings yet.</div>
        ) : (
          <div className="admin-table">
            {bookings.map((b) => (
              <div className="admin-row" key={b.id}>
                <div className="admin-row-main">
                  <div className="admin-row-code">{isUpcomingBooking(b.slotIso) ? "UPCOMING" : "PAST"}</div>
                  <div className="admin-row-title">{b.slotDisplay}</div>
                  <div className="admin-row-category">
                    {b.name} · {b.email}
                  </div>
                </div>
                <div className="admin-row-actions">
                  <a href={`mailto:${b.email}`} className="admin-btn">
                    EMAIL
                  </a>
                  <form action={deleteBookingAction}>
                    <input type="hidden" name="id" value={b.id} />
                    <ConfirmDeleteButton />
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
