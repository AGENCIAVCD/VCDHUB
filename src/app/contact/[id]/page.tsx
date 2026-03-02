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
        <Link href="/inbox" className="text-slate-600 underline">
          Voltar para inbox
        </Link>
      </div>

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">Dados do contato</h3>
        <p className="text-sm text-slate-700">Telefone: {contact.phone}</p>
        <p className="text-sm text-slate-700">
          Criado em: {new Date(contact.created_at).toLocaleString("pt-BR")}
        </p>
      </section>

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">Conversas</h3>
        {conversations.length === 0 ? (
          <p className="text-sm text-slate-600">Nenhuma conversa para este contato.</p>
        ) : (
          <ul className="space-y-2">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <Link href={`/conversation/${conversation.id}`} className="text-sm text-emerald-700 underline">
                  Conversa #{conversation.id} ({conversation.status})
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">Histórico de mensagens</h3>
        {messages.length === 0 ? (
          <p className="text-sm text-slate-600">Sem mensagens.</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((message) => (
              <li key={message.id} className="rounded-md border border-slate-100 bg-slate-50 p-3 text-sm">
                <p className="font-medium text-slate-800">{message.from_me ? "Você" : "Contato"}</p>
                <p className="text-slate-700">{message.body}</p>
                <p className="text-xs text-slate-500">
                  {new Date(message.timestamp).toLocaleString("pt-BR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
