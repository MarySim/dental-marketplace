import type { Metadata } from "next";
import type { ReactNode } from "react";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: messages[await getLocale()].owner.title,
    robots: { index: false, follow: false },
  };
}

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return children;
}
