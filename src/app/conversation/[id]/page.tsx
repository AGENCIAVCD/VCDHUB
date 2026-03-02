import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ConversationComposer } from "@/components/ConversationComposer";
import { requireAuth } from "@/lib/auth";
import { getConversationById, getMessagesByConversation } from "@/lib/crm";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();

  const { id } = await params;
  const conversationId = Number(id);

  if (!conversationId) {
    notFound();
  }

  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    notFound();
  }

  const messages = await getMessagesByConversation(conversationId);

  return (
    <AppShell title={`Conversa: ${conversation.contact_name}`} subtitle={conversation.phone}>
      <div className="mb-4 flex items-center gap-4 text-sm">
        <Link href="/inbox" className="text-slate-600 underline">
          Voltar para inbox
        </Link>
        <Link href={`/contact/${conversation.contact_id}`} className="text-emerald-700 underline">
          Ver contato
        </Link>
      </div>

      <div className="mb-4 space-y-2 rounded-lg border border-slate-200 bg-white p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">Sem histórico de mensagens.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                message.from_me
                  ? "ml-auto bg-emerald-600 text-white"
                  : "mr-auto bg-slate-100 text-slate-900"
              }`}
            >
              <p>{message.body}</p>
              <p
                className={`mt-1 text-[11px] ${
                  message.from_me ? "text-emerald-100" : "text-slate-500"
                }`}
              >
                {new Date(message.timestamp).toLocaleString("pt-BR")}
              </p>
            </div>
          ))
        )}
      </div>

      <ConversationComposer conversationId={conversationId} />
    </AppShell>
  );
}
