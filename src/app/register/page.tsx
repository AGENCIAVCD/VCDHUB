import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { readSession } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await readSession();
  if (session) {
    redirect("/inbox");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-8">
      <div className="vcd-shell w-full p-6 md:p-10">
        <div className="mb-6 flex items-center justify-center md:justify-start">
          <Image src="/brand/logo-vcd.svg" alt="Você Digital Propaganda" width={170} height={52} priority />
        </div>

        <div className="mx-auto max-w-md space-y-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-[0.08em] text-white">Criar conta</h1>
            <p className="vcd-muted mt-1 text-sm">Acesso seguro para operação do mini-CRM.</p>
          </div>
          <AuthForm mode="register" />
          <p className="vcd-muted text-sm">
            Já tem conta?{" "}
            <Link href="/login" className="vcd-link font-semibold">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
