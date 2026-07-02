const CAL_API_BASE = "https://api.cal.com/v2";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function calHeaders(apiVersion: string) {
  return {
    Authorization: `Bearer ${requireEnv("CAL_API_KEY")}`,
    "cal-api-version": apiVersion,
    "Content-Type": "application/json",
  };
}

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export type CalSlot = { start: string };

export async function fetchAvailableSlots(
  startISO: string,
  endISO: string,
  timeZone: string
): Promise<Record<string, CalSlot[]>> {
  const username = requireEnv("CAL_USERNAME");
  const eventTypeSlug = requireEnv("CAL_EVENT_SLUG");
  const url = new URL(`${CAL_API_BASE}/slots`);
  url.searchParams.set("username", username);
  url.searchParams.set("eventTypeSlug", eventTypeSlug);
  url.searchParams.set("start", startISO);
  url.searchParams.set("end", endISO);
  url.searchParams.set("timeZone", timeZone);

  const res = await fetch(url, { headers: calHeaders("2024-09-04"), cache: "no-store" });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error(json?.error?.message || `Cal.com slots request failed (${res.status}).`);
  }
  return json?.data ?? {};
}

export async function createBooking(params: {
  startISO: string;
  name: string;
  email: string;
  timeZone: string;
}) {
  const username = requireEnv("CAL_USERNAME");
  const eventTypeSlug = requireEnv("CAL_EVENT_SLUG");
  const res = await fetch(`${CAL_API_BASE}/bookings`, {
    method: "POST",
    headers: calHeaders("2024-08-13"),
    body: JSON.stringify({
      username,
      eventTypeSlug,
      start: params.startISO,
      attendee: {
        name: params.name,
        email: params.email,
        timeZone: params.timeZone,
      },
    }),
  });
  const json = await parseJson(res);
  if (!res.ok) {
    throw new Error(json?.error?.message || `Cal.com booking failed (${res.status}).`);
  }
  return json;
}
