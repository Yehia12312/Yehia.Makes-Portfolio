"use client";

import { useEffect, useState } from "react";

type Slot = { iso: string; time: string };
type Day = { label: string; slots: Slot[] };

type FormState = { name: string; email: string; brief: string };

export function ContactSection() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", brief: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [bookingNote, setBookingNote] = useState<string | null>(null);

  const [days, setDays] = useState<Day[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ iso: string; display: string } | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/schedule/slots")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setDays(data.days ?? []);
        setScheduleError(data.error ?? null);
      })
      .catch(() => {
        if (!cancelled) setScheduleError("Couldn't load availability right now.");
      })
      .finally(() => {
        if (!cancelled) setScheduleLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.brief.trim()) {
      setError("Fill in name, email, and a project brief.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError(null);
    setBookingNote(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send brief.");

      if (selectedSlot) {
        const bookRes = await fetch("/api/schedule/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ iso: selectedSlot.iso, name: form.name, email: form.email }),
        });
        const bookData = await bookRes.json();
        if (!bookRes.ok) {
          setBookingNote(
            bookData.error || "Brief sent, but that slot couldn't be held — I'll follow up to reschedule."
          );
        }
      }

      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <section className="contact-section" id="contact">
      <div className="contact-grid">
        <div>
          <h3>Have a project in mind?</h3>
          <p className="contact-copy">
            Tell me what you&apos;re trying to build. I&apos;ll reply with feasibility notes
            and a rough cost/time estimate before we get on a call.
          </p>

          {status === "sent" ? (
            <div className="form-sent">
              ✓ BRIEF LOGGED — I&apos;ll reply within 48h with feasibility notes.
              {bookingNote && (
                <div style={{ marginTop: 10, color: "var(--accent)" }}>{bookingNote}</div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {status === "error" && error && <div className="form-error">{error}</div>}
              <div className="form-field">
                <label>NAME</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="form-field">
                <label>EMAIL</label>
                <input
                  type="text"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                />
              </div>
              <div className="form-field">
                <label>PROJECT BRIEF</label>
                <textarea
                  value={form.brief}
                  onChange={(e) => setForm({ ...form, brief: e.target.value })}
                  placeholder="What are you building, and what stage is it at?"
                />
              </div>
              <button type="submit" className="form-submit" disabled={status === "sending"}>
                {status === "sending" ? "SENDING…" : "SEND BRIEF →"}
              </button>
            </form>
          )}
        </div>

        <div className="schedule-panel">
          <div className="label">Schedule a Call · 30 min</div>

          {scheduleLoading && <div className="schedule-status">Loading availability…</div>}

          {!scheduleLoading && scheduleError && (
            <div className="schedule-status">
              Scheduling is temporarily unavailable — send a brief and I&apos;ll propose times.
            </div>
          )}

          {!scheduleLoading && !scheduleError && days.length === 0 && (
            <div className="schedule-status">No open slots in the next few days — send a brief.</div>
          )}

          {!scheduleLoading &&
            !scheduleError &&
            days.map((d) => (
              <div className="day-row" key={d.label}>
                <span>{d.label}</span>
                <div className="slots">
                  {d.slots.map((s) => {
                    const isSelected = selectedSlot?.iso === s.iso;
                    return (
                      <button
                        type="button"
                        key={s.iso}
                        className={`slot available${isSelected ? " selected" : ""}`}
                        onClick={() =>
                          setSelectedSlot(
                            isSelected ? null : { iso: s.iso, display: `${d.label} @ ${s.time}` }
                          )
                        }
                      >
                        {s.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {selectedSlot && (
            <div className="schedule-held">✓ HELD: {selectedSlot.display} — confirm via brief</div>
          )}
        </div>
      </div>
    </section>
  );
}
