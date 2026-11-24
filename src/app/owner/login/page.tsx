import { redirect } from "next/navigation";
import { messages } from "@/lib/i18n";
import { hasOwnerAuthSecret } from "@/lib/owner-auth-options.mjs";
import { getOwnerSession } from "@/lib/owner-auth";
import { getLocale } from "@/lib/server-locale";
import { LoginForm } from "./LoginForm";

export default async function OwnerLoginPage() {
  const [session, locale] = await Promise.all([getOwnerSession(), getLocale()]);
  if (session) redirect("/owner");
  const copy = messages[locale].owner;

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-sky-100 bg-white/80 p-6 sm:p-8">
      <h1 className="text-3xl font-semibold text-sky-950">{copy.login}</h1>
      <p className="mt-2 text-slate-600">{copy.intro}</p>
      {hasOwnerAuthSecret()
        ? <LoginForm />
        : <p role="status" className="mt-4 text-sm text-slate-600">{copy.unavailable}</p>}
    </section>
  );
}
