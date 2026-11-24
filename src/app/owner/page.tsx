import { messages } from "@/lib/i18n";
import { requireOwner } from "@/lib/owner-auth";
import { getLocale } from "@/lib/server-locale";
import { signOutOwner } from "./actions";

export default async function OwnerPage() {
  const [owner, locale] = await Promise.all([requireOwner(), getLocale()]);
  const copy = messages[locale].owner;

  return (
    <section className="rounded-3xl border border-sky-100 bg-white/80 p-6 sm:p-8">
      <h1 className="text-3xl font-semibold text-sky-950">{copy.title}</h1>
      <p className="mt-2 text-slate-600">{copy.active}</p>
      <p className="mt-1 break-all font-semibold text-sky-950">{owner.email}</p>
      <form action={signOutOwner} className="mt-6">
        <button
          type="submit"
          className="rounded-full border border-sky-200 bg-white px-5 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-50"
        >
          {copy.signOut}
        </button>
      </form>
    </section>
  );
}
