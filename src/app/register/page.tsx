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
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <div className="w-full space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Criar conta</h1>
          <p className="text-sm text-slate-600">Autenticação simples por email e senha.</p>
        </div>
        <AuthForm mode="register" />
        <p className="text-sm text-slate-600">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-slate-900 underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
