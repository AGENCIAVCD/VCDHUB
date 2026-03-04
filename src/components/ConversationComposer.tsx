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
    <form onSubmit={onSubmit} className="vcd-card space-y-3 p-4">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Digite sua resposta..."
        rows={3}
        className="vcd-input w-full px-3 py-2 text-sm"
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button type="submit" disabled={sending} className="vcd-button px-4 py-2 text-sm disabled:opacity-50">
        {sending ? "Enviando..." : "Enviar no WhatsApp"}
      </button>
    </form>
  );
}
