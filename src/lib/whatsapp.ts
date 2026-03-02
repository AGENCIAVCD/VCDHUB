export type IncomingWhatsAppMessage = {
  from: string;
  body: string;
  timestamp: Date;
  contactName?: string;
};

type WhatsAppWebhookValue = {
  contacts?: Array<{ profile?: { name?: string } }>;
  messages?: Array<{
    from?: string;
    timestamp?: string;
    text?: { body?: string };
    type?: string;
  }>;
};

type WhatsAppWebhookPayload = {
  entry?: Array<{
    changes?: Array<{
      value?: WhatsAppWebhookValue;
    }>;
  }>;
};

export function parseIncomingMessages(payload: WhatsAppWebhookPayload) {
  const parsed: IncomingWhatsAppMessage[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      const contactName = value?.contacts?.[0]?.profile?.name;

      for (const message of value?.messages ?? []) {
        if (message.type !== "text") {
          continue;
        }

        const from = message.from;
        const body = message.text?.body;
        if (!from || !body) {
          continue;
        }

        parsed.push({
          from,
          body,
          contactName,
          timestamp: message.timestamp
            ? new Date(Number(message.timestamp) * 1000)
            : new Date(),
        });
      }
    }
  }

  return parsed;
}

export async function sendWhatsAppMessage(to: string, body: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    throw new Error("WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID must be set.");
  }

  const response = await fetch(
    `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.message || "Failed to send WhatsApp message.";
    throw new Error(errorMessage);
  }

  return data;
}
