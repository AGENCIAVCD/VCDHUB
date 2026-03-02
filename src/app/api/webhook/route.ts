import { NextRequest, NextResponse } from "next/server";
import { saveIncomingMessage } from "@/lib/crm";
import { parseIncomingMessages } from "@/lib/whatsapp";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Invalid webhook verification." }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const incoming = parseIncomingMessages(payload);

    for (const message of incoming) {
      await saveIncomingMessage({
        phone: message.from,
        body: message.body,
        timestamp: message.timestamp,
        contactName: message.contactName,
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Failed to process webhook." }, { status: 500 });
  }
}
