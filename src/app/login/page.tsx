import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { readSession } from "@/lib/auth";
import { DISPLAY_USERS } from "@/lib/single-user-auth";

export default async function LoginPage() {
  const session = await readSession();
  if (session) {
    redirect("/inbox");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-8">
      <div className="vcd-shell w-full p-6 md:p-10">
        <div className="mb-6 flex items-center justify-center">
          <Image src="/brand/logo-vcd.svg" alt="Você Digital Propaganda" width={170} height={52} priority />
        </div>

        <div className="mx-auto max-w-md space-y-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-[0.08em] text-white">Entrar no WPP Hub</h1>
            <p className="vcd-muted mt-1 text-sm">CRM de atendimento e performance com identidade VCD.</p>
          </div>
          <section className="vcd-card space-y-2 p-4">
            <h2 className="text-xs font-semibold tracking-[0.2em] text-white/75">USUÁRIOS</h2>
            <ul className="space-y-2">
              {DISPLAY_USERS.map((user) => (
                <li
                  key={user.email}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    user.enabled
                      ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                      : "border-white/10 bg-white/5 text-white/45"
                  }`}
                >
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs">{user.email}</p>
                  {!user.enabled ? <p className="text-[11px]">Acesso bloqueado</p> : null}
                </li>
              ))}
            </ul>
            <p className="text-xs text-white/65">
              Login ativo: <span className="font-semibold text-white">Bruno Ravaglia</span> com senha{" "}
              <span className="font-semibold text-amber-300">vcd123</span>.
            </p>
          </section>
          <AuthForm mode="login" />
          <p className="vcd-muted text-sm">
            Cadastro desativado no momento.
            {" "}
            <Link href="/register" className="vcd-link font-semibold">
              Ver aviso
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
