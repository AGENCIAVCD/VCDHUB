"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ConversationComposerProps = {
  conversationId: number;
};

export function ConversationComposer({ conversationId }: ConversationComposerProps) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const normalized = body.trim();
    if (!normalized) {
      return;
    }

    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, body: normalized }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Não foi possível enviar a mensagem.");
        return;
      }

      setBody("");
      router.refresh();
    } catch {
      setError("Erro de rede ao enviar mensagem.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Digite sua resposta..."
        rows={3}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={sending}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
      >
        {sending ? "Enviando..." : "Enviar no WhatsApp"}
      </button>
    </form>
  );
}
