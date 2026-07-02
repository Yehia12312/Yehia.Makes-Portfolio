import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { recordLead } from "@/lib/adminData";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = body?.name?.trim();
  const email = body?.email?.trim();
  const brief = body?.brief?.trim();
  const slotDisplay = typeof body?.slotDisplay === "string" ? body.slotDisplay : null;

  if (!name || !email || !brief) {
    return NextResponse.json(
      { error: "Name, email, and project brief are all required." },
      { status: 400 }
    );
  }

  await recordLead({ name, email, brief, slotDisplay });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { error: "Contact form isn't configured yet — email me directly instead." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `New project brief from ${name}`,
    text: `From: ${name} <${email}>\n\n${brief}`,
  });

  if (error) {
    return NextResponse.json({ error: error.message || "Failed to send brief." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
