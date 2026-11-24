import Link from "next/link";
import { messages, type Locale } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const { footer, nav } = messages[locale];
  return (
    <footer className="mt-auto border-t border-sky-100 bg-sky-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/shipping" className="self-start text-sm font-semibold text-sky-800 hover:underline sm:self-auto">
          {nav.shipping}
        </Link>
        <p className="text-sm leading-6 text-slate-500">
          {footer.note}
        </p>
      </div>
    </footer>
  );
}
