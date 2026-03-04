import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";

export default async function RegisterPage() {
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
            <h1 className="text-3xl font-semibold tracking-[0.08em] text-white">Cadastro desativado</h1>
            <p className="vcd-muted mt-1 text-sm">
              O sistema está em modo de usuário único.
            </p>
          </div>
          <div className="vcd-card space-y-3 p-6">
            <p className="text-sm text-white/80">
              Apenas o usuário <span className="font-semibold text-white">Bruno Ravaglia</span> pode acessar
              esta plataforma no momento.
            </p>
            <p className="text-sm text-white/80">
              Senha ativa: <span className="font-semibold text-amber-300">vcd123</span>
            </p>
            <Link href="/login" className="vcd-button inline-flex px-4 py-2 text-sm">
              Ir para login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
