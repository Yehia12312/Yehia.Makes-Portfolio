import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/cal";
import { recordBooking } from "@/lib/adminData";

const TIMEZONE = process.env.CAL_TIMEZONE || "Africa/Cairo";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const iso = body?.iso;
  const name = body?.name;
  const email = body?.email;
  const slotDisplay = typeof body?.slotDisplay === "string" ? body.slotDisplay : iso;

  if (!iso || !name || !email) {
    return NextResponse.json({ error: "Missing slot, name, or email." }, { status: 400 });
  }

  try {
    const booking = await createBooking({ startISO: iso, name, email, timeZone: TIMEZONE });
    await recordBooking({ name, email, slotIso: iso, slotDisplay });
    return NextResponse.json({ booking });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Booking failed." },
      { status: 502 }
    );
  }
}
