import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { requireAuth } from "@/lib/auth";
import { getInboxConversations } from "@/lib/crm";

export default async function InboxPage() {
  await requireAuth();
  const conversations = await getInboxConversations();

  return (
    <AppShell title="Inbox" subtitle="Conversas recebidas via WhatsApp Cloud API">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {conversations.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">Nenhuma conversa ainda.</div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {conversations.map((conversation) => (
              <li key={conversation.id} className="p-4 hover:bg-slate-50">
                <Link href={`/conversation/${conversation.id}`} className="block">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{conversation.contact_name}</p>
                    <span className="text-xs text-slate-500">{conversation.phone}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-600">
                    {conversation.last_message || "Sem mensagens"}
                  </p>
                </Link>
                <div className="mt-2">
                  <Link
                    href={`/contact/${conversation.contact_id}`}
                    className="text-xs text-emerald-700 underline"
                  >
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
