import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="min-h-screen px-3 py-4 md:px-6 md:py-6">
      <div className="vcd-shell mx-auto w-full max-w-7xl overflow-hidden">
        <header className="border-b border-[var(--border-subtle)] bg-black/20 backdrop-blur">
          <div className="mx-auto flex w-full items-center justify-between px-4 py-4 md:px-8">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-amber-400/30 bg-black/30 p-3 shadow-[0_0_24px_rgba(255,181,0,0.12)]">
                <Image
                  src="/brand/logo-vcd.svg"
                  alt="Você Digital Propaganda"
                  width={130}
                  height={40}
                  priority
                />
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-[0.24em] text-[var(--text-primary)] md:text-base">
                  WPP HUB
                </h1>
                <p className="vcd-muted text-[11px] md:text-xs">Mini-CRM WhatsApp Cloud API</p>
              </div>
            </div>

            <nav className="flex items-center gap-2">
              <Link href="/inbox" className="rounded-xl px-3 py-2 text-sm text-white/85 hover:bg-white/10">
                Inbox
              </Link>
              <Link href="/pipeline" className="rounded-xl px-3 py-2 text-sm text-white/85 hover:bg-white/10">
                Funil
              </Link>
              <LogoutButton />
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full px-4 py-6 md:px-8 md:py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-[0.08em] text-white md:text-3xl">{title}</h2>
            {subtitle ? <p className="vcd-muted mt-1 text-sm">{subtitle}</p> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
