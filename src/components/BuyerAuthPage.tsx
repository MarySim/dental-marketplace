import Link from "next/link";
import { redirect } from "next/navigation";
import { getBuyer } from "@/lib/buyer-auth";
import { buyerAuthLink, buyerReturnPath } from "@/lib/buyer-links";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";
import { BuyerAuthForm } from "./BuyerAuthForm";

type Query = Promise<{ next?: string | string[]; reason?: string | string[] }>;

export async function BuyerAuthPage({ mode, searchParams }: { mode: "register" | "login"; searchParams: Query }) {
  const [query, buyer, locale] = await Promise.all([searchParams, getBuyer(), getLocale()]);
  const next = buyerReturnPath(query.next);
  if (buyer) redirect(next);
  const { buyer: copy, owner } = messages[locale];
  const registering = mode === "register";
  const isCart = query.reason === "cart";

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-sky-100 bg-white/80 p-6 sm:p-8">
      <h1 className="text-3xl font-semibold text-sky-950">{registering ? copy.registerTitle : copy.loginTitle}</h1>
      {isCart && <p role="status" className="mt-4 rounded-xl bg-sky-50 p-3 text-sm text-sky-900">{copy.cartNotice}</p>}
      <BuyerAuthForm mode={mode} next={next} />
      <p className="mt-4 text-sm text-slate-600">
        {registering ? copy.hasAccount : copy.noAccount}{" "}
        <Link className="font-semibold text-sky-800 underline" href={buyerAuthLink(registering ? "login" : "register", next, isCart)}>
          {registering ? copy.login : copy.register}
        </Link>
      </p>
      {!registering && (
        <Link href="/owner/login" prefetch={false} className="mt-3 inline-block text-sm text-sky-800 underline">
          {owner.login}
        </Link>
      )}
    </section>
  );
}
