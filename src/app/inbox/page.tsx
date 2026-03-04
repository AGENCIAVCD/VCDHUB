import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { requireAuth } from "@/lib/auth";
import { getInboxConversations } from "@/lib/crm";

export default async function InboxPage() {
  await requireAuth();
  const conversations = await getInboxConversations();

  return (
    <AppShell title="Inbox" subtitle="Conversas recebidas via WhatsApp Cloud API">
      <div className="vcd-card overflow-hidden">
        {conversations.length === 0 ? (
          <div className="p-6 text-sm text-white/70">Nenhuma conversa ainda.</div>
        ) : (
          <ul className="divide-y divide-white/10">
            {conversations.map((conversation) => (
              <li key={conversation.id} className="p-4 transition hover:bg-white/5">
                <Link href={`/conversation/${conversation.id}`} className="block">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-white">{conversation.contact_name}</p>
                    <span className="text-xs text-white/55">{conversation.phone}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-white/70">
                    {conversation.last_message || "Sem mensagens"}
                  </p>
                </Link>
                <div className="mt-2">
                  <Link href={`/contact/${conversation.contact_id}`} className="vcd-link text-xs">
                    Ver contato
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
