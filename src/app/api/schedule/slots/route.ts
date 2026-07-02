import { NextResponse } from "next/server";
import { fetchAvailableSlots } from "@/lib/cal";

const TIMEZONE = process.env.CAL_TIMEZONE || "Africa/Cairo";
const WINDOW_DAYS = 9;
const MAX_DAYS_SHOWN = 3;
const MAX_SLOTS_PER_DAY = 3;

export async function GET() {
  try {
    const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + WINDOW_DAYS * 24 * 60 * 60 * 1000);

    const data = await fetchAvailableSlots(start.toISOString(), end.toISOString(), TIMEZONE);

    const dateFmt = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: TIMEZONE,
    });
    const timeFmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: TIMEZONE,
    });

    const days = Object.values(data)
      .filter((slots) => slots.length > 0)
      .slice(0, MAX_DAYS_SHOWN)
      .map((slots) => ({
        label: dateFmt.format(new Date(slots[0].start)),
        slots: slots.slice(0, MAX_SLOTS_PER_DAY).map((s) => ({
          iso: s.start,
          time: timeFmt.format(new Date(s.start)),
        })),
      }));

    return NextResponse.json({ days, timeZone: TIMEZONE });
  } catch (err) {
    return NextResponse.json({
      days: [],
      timeZone: TIMEZONE,
      error: err instanceof Error ? err.message : "Failed to load availability.",
    });
  }
}
