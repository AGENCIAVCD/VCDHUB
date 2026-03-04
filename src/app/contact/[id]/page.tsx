import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { requireAuth } from "@/lib/auth";
import { getContactWithHistory } from "@/lib/crm";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();

  const { id } = await params;
  const contactId = Number(id);

  if (!contactId) {
    notFound();
  }

  const data = await getContactWithHistory(contactId);
  if (!data) {
    notFound();
  }

  const { contact, conversations, messages } = data;

  return (
    <AppShell title={contact.name} subtitle={contact.phone}>
      <div className="mb-4 flex items-center gap-4 text-sm">
        <Link href="/inbox" className="vcd-link">
          Voltar para inbox
        </Link>
      </div>

      <section className="vcd-card mb-6 p-4">
        <h3 className="mb-2 text-sm font-semibold tracking-[0.08em] text-white">Dados do contato</h3>
        <p className="text-sm text-white/80">Telefone: {contact.phone}</p>
        <p className="text-sm text-white/80">Criado em: {new Date(contact.created_at).toLocaleString("pt-BR")}</p>
      </section>

      <section className="vcd-card mb-6 p-4">
        <h3 className="mb-2 text-sm font-semibold tracking-[0.08em] text-white">Conversas</h3>
        {conversations.length === 0 ? (
          <p className="text-sm text-white/65">Nenhuma conversa para este contato.</p>
        ) : (
          <ul className="space-y-2">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <Link href={`/conversation/${conversation.id}`} className="vcd-link text-sm">
                  Conversa #{conversation.id} ({conversation.status})
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="vcd-card p-4">
        <h3 className="mb-2 text-sm font-semibold tracking-[0.08em] text-white">Histórico de mensagens</h3>
        {messages.length === 0 ? (
          <p className="text-sm text-white/65">Sem mensagens.</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((message) => (
              <li key={message.id} className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
                <p className="font-semibold text-white">{message.from_me ? "Você" : "Contato"}</p>
                <p className="text-white/80">{message.body}</p>
                <p className="text-xs text-white/55">{new Date(message.timestamp).toLocaleString("pt-BR")}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
