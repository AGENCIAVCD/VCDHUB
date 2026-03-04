"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.details ? `${data.error} (${data.details})` : data.error || "Erro na autenticação.");
        return;
      }

      router.push("/inbox");
      router.refresh();
    } catch {
      setError("Falha de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="vcd-card space-y-5 p-6 md:p-7">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-white/90">
          {mode === "login" ? "Usuário ou email" : "Email"}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="vcd-input w-full px-3 py-2.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-white/90">
          Senha
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="vcd-input w-full px-3 py-2.5 text-sm"
        />
      </div>

      {error ? <p className="text-sm font-medium text-red-400">{error}</p> : null}

      <button type="submit" disabled={loading} className="vcd-button w-full px-4 py-2.5 text-sm disabled:opacity-50">
        {loading ? "Processando..." : mode === "login" ? "Entrar" : "Criar conta"}
      </button>
    </form>
  );
}
