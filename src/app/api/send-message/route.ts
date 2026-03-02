import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { getConversationById } from "@/lib/crm";
import { query } from "@/lib/db";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const session = await readSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const conversationId = Number(body.conversationId);
    const messageBody = String(body.body || "").trim();

    if (!conversationId || !messageBody) {
      return NextResponse.json(
        { error: "conversationId and body are required." },
        { status: 400 }
      );
    }

    const conversation = await getConversationById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    await sendWhatsAppMessage(conversation.phone, messageBody);

    await query(
      "INSERT INTO messages (conversation_id, from_me, body, timestamp) VALUES ($1, $2, $3, NOW())",
      [conversationId, true, messageBody]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
