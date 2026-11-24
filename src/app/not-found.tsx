import Link from "next/link";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";

export default async function NotFound() {
  const { common } = messages[await getLocale()];
  return (
    <div className="rounded-3xl border border-sky-100 bg-white p-8">
      <h1 className="text-2xl font-semibold text-sky-950">{common.notFound}</h1>
      <Link href="/" className="mt-4 inline-block text-sky-700">
        {common.backHome}
      </Link>
    </div>
  );
}
