import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { readSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await readSession();
  if (session) {
    redirect("/inbox");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <div className="w-full space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Entrar no WPP Hub</h1>
          <p className="text-sm text-slate-600">CRM mínimo integrado ao WhatsApp.</p>
        </div>
        <AuthForm mode="login" />
        <p className="text-sm text-slate-600">
          Sem conta?{" "}
          <Link href="/register" className="font-medium text-slate-900 underline">
            Criar agora
          </Link>
        </p>
      </div>
    </div>
  );
}
