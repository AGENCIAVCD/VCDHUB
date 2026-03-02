import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">WPP Hub</h1>
            <p className="text-xs text-slate-500">Mini-CRM WhatsApp Cloud API</p>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/inbox"
              className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Inbox
            </Link>
            <Link
              href="/pipeline"
              className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Funil
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {children}
      </main>
    </div>
  );
}
