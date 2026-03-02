import { getClient, query } from "@/lib/db";

export type ConversationListItem = {
  id: number;
  status: string;
  created_at: string;
  contact_id: number;
  contact_name: string;
  phone: string;
  last_message: string | null;
  last_message_at: string | null;
};

export async function getOrCreateContact(phone: string, name?: string) {
  const existing = await query<{ id: number; name: string; phone: string }>(
    "SELECT id, name, phone FROM contacts WHERE phone = $1 LIMIT 1",
    [phone]
  );

  if (existing[0]) {
    return existing[0];
  }

  const inserted = await query<{ id: number; name: string; phone: string }>(
    "INSERT INTO contacts (name, phone) VALUES ($1, $2) RETURNING id, name, phone",
    [name || phone, phone]
  );

  return inserted[0];
}

export async function getOrCreateConversation(contactId: number) {
  const existing = await query<{ id: number; contact_id: number }>(
    "SELECT id, contact_id FROM conversations WHERE contact_id = $1 LIMIT 1",
    [contactId]
  );

  if (existing[0]) {
    return existing[0];
  }

  const inserted = await query<{ id: number; contact_id: number }>(
    "INSERT INTO conversations (contact_id, status) VALUES ($1, 'open') RETURNING id, contact_id",
    [contactId]
  );

  return inserted[0];
}

export async function ensureDeal(contactId: number) {
  const existing = await query<{ id: number }>(
    "SELECT id FROM deals WHERE contact_id = $1 LIMIT 1",
    [contactId]
  );

  if (existing[0]) {
    return existing[0].id;
  }

  const firstStage = await query<{ id: number }>(
    "SELECT id FROM pipeline_stages ORDER BY \"order\" ASC LIMIT 1"
  );

  if (!firstStage[0]) {
    throw new Error("No pipeline stages found. Seed pipeline_stages first.");
  }

  const inserted = await query<{ id: number }>(
    "INSERT INTO deals (contact_id, stage_id) VALUES ($1, $2) RETURNING id",
    [contactId, firstStage[0].id]
  );

  return inserted[0].id;
}

export async function saveIncomingMessage(input: {
  phone: string;
  body: string;
  timestamp: Date;
  contactName?: string;
}) {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const contactResult = await client.query<{
      id: number;
      name: string;
      phone: string;
    }>("SELECT id, name, phone FROM contacts WHERE phone = $1 LIMIT 1", [input.phone]);

    let contact = contactResult.rows[0];

    if (!contact) {
      const insertedContact = await client.query<{
        id: number;
        name: string;
        phone: string;
      }>(
        "INSERT INTO contacts (name, phone) VALUES ($1, $2) RETURNING id, name, phone",
        [input.contactName || input.phone, input.phone]
      );
      contact = insertedContact.rows[0];
    }

    const conversationResult = await client.query<{ id: number; contact_id: number }>(
      "SELECT id, contact_id FROM conversations WHERE contact_id = $1 LIMIT 1",
      [contact.id]
    );

    let conversation = conversationResult.rows[0];

    if (!conversation) {
      const insertedConversation = await client.query<{ id: number; contact_id: number }>(
        "INSERT INTO conversations (contact_id, status) VALUES ($1, 'open') RETURNING id, contact_id",
        [contact.id]
      );
      conversation = insertedConversation.rows[0];
    }

    await client.query(
      "INSERT INTO messages (conversation_id, from_me, body, timestamp) VALUES ($1, $2, $3, $4)",
      [conversation.id, false, input.body, input.timestamp]
    );

    const dealResult = await client.query<{ id: number }>(
      "SELECT id FROM deals WHERE contact_id = $1 LIMIT 1",
      [contact.id]
    );

    if (!dealResult.rows[0]) {
      const stageResult = await client.query<{ id: number }>(
        'SELECT id FROM pipeline_stages ORDER BY "order" ASC LIMIT 1'
      );

      if (stageResult.rows[0]) {
        await client.query("INSERT INTO deals (contact_id, stage_id) VALUES ($1, $2)", [
          contact.id,
          stageResult.rows[0].id,
        ]);
      }
    }

    await client.query("COMMIT");
    return { contactId: contact.id, conversationId: conversation.id };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getInboxConversations() {
  return query<ConversationListItem>(
    `
    SELECT
      c.id,
      c.status,
      c.created_at,
      ct.id as contact_id,
      ct.name as contact_name,
      ct.phone,
      lm.body as last_message,
      lm.timestamp as last_message_at
    FROM conversations c
    JOIN contacts ct ON ct.id = c.contact_id
    LEFT JOIN LATERAL (
      SELECT m.body, m.timestamp
      FROM messages m
      WHERE m.conversation_id = c.id
      ORDER BY m.timestamp DESC
      LIMIT 1
    ) lm ON true
    ORDER BY COALESCE(lm.timestamp, c.created_at) DESC
    `
  );
}

export async function getConversationById(conversationId: number) {
  const rows = await query<{
    id: number;
    status: string;
    contact_id: number;
    contact_name: string;
    phone: string;
  }>(
    `
    SELECT
      c.id,
      c.status,
      ct.id as contact_id,
      ct.name as contact_name,
      ct.phone
    FROM conversations c
    JOIN contacts ct ON ct.id = c.contact_id
    WHERE c.id = $1
    LIMIT 1
    `,
    [conversationId]
  );

  return rows[0] || null;
}

export async function getMessagesByConversation(conversationId: number) {
  return query<{
    id: number;
    from_me: boolean;
    body: string;
    timestamp: string;
  }>(
    `
    SELECT id, from_me, body, timestamp
    FROM messages
    WHERE conversation_id = $1
    ORDER BY timestamp ASC
    `,
    [conversationId]
  );
}

export async function getPipelineData() {
  const stages = await query<{
    id: number;
    name: string;
    order: number;
  }>('SELECT id, name, "order" as order FROM pipeline_stages ORDER BY "order" ASC');

  const deals = await query<{
    id: number;
    stage_id: number;
    contact_id: number;
    contact_name: string;
    phone: string;
    created_at: string;
  }>(
    `
    SELECT
      d.id,
      d.stage_id,
      d.contact_id,
      ct.name AS contact_name,
      ct.phone,
      d.created_at
    FROM deals d
    JOIN contacts ct ON ct.id = d.contact_id
    ORDER BY d.created_at DESC
    `
  );

  return { stages, deals };
}

export async function getContactWithHistory(contactId: number) {
  const contacts = await query<{ id: number; name: string; phone: string; created_at: string }>(
    "SELECT id, name, phone, created_at FROM contacts WHERE id = $1 LIMIT 1",
    [contactId]
  );

  const contact = contacts[0];
  if (!contact) {
    return null;
  }

  const conversations = await query<{
    id: number;
    status: string;
    created_at: string;
  }>(
    "SELECT id, status, created_at FROM conversations WHERE contact_id = $1 ORDER BY created_at DESC",
    [contactId]
  );

  const messages = await query<{
    id: number;
    conversation_id: number;
    from_me: boolean;
    body: string;
    timestamp: string;
  }>(
    `
    SELECT id, conversation_id, from_me, body, timestamp
    FROM messages
    WHERE conversation_id IN (
      SELECT id FROM conversations WHERE contact_id = $1
    )
    ORDER BY timestamp DESC
    `,
    [contactId]
  );

  return { contact, conversations, messages };
}
