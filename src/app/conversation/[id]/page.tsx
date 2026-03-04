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
        <Link href="/inbox" className="vcd-link">
          Voltar para inbox
        </Link>
        <Link href={`/contact/${conversation.contact_id}`} className="vcd-link">
          Ver contato
        </Link>
      </div>

      <div className="vcd-card mb-4 space-y-2 p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-white/65">Sem histórico de mensagens.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[82%] rounded-2xl border px-3 py-2 text-sm ${
                message.from_me
                  ? "ml-auto border-amber-300/30 bg-amber-300/15 text-white"
                  : "mr-auto border-white/15 bg-black/25 text-white"
              }`}
            >
              <p>{message.body}</p>
              <p className="mt-1 text-[11px] text-white/60">
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
