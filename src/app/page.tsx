import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "WPP Hub",
  description: "Mini-CRM integrado ao WhatsApp Cloud API",
};

export default async function HomePage() {
  const session = await readSession();

  if (session) {
    redirect("/inbox");
  }

  redirect("/login");
}
