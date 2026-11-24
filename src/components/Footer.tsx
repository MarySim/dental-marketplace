import Link from "next/link";
import { messages, type Locale } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const { clinic, footer, nav } = messages[locale];
  return (
    <footer className="mt-auto border-t border-sky-100 bg-sky-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-semibold text-sky-950">{nav.brand}</p>
          <p className="mt-2 text-sm text-slate-600">{clinic.address}</p>
          <p className="text-sm text-slate-600">{clinic.hours}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-sky-900">{nav.store}</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>
              <Link href="/catalog" className="hover:text-sky-800">
                {nav.catalog}
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-sky-800">
                {footer.shipping}
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-sky-800">
                {footer.checkout}
              </Link>
            </li>
          </ul>
        </div>
        <p className="text-sm leading-6 text-slate-500">
          {footer.note}
        </p>
      </div>
    </footer>
  );
}
