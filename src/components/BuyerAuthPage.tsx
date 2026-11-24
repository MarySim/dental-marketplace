import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getBuyer } from "@/lib/buyer-auth";
import { buyerAuthLink, buyerReturnPath } from "@/lib/buyer-links";
import { messages, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";
import { BuyerAuthForm } from "./BuyerAuthForm";

type Query = Promise<{ next?: string | string[]; reason?: string | string[] }>;
type AuthPageProps = { mode: "register" | "login"; searchParams: Query };

export async function BuyerAuthPage(props: AuthPageProps) {
  const locale = await getLocale();
  const copy = messages[locale].buyer;
  const title = props.mode === "register" ? copy.registerTitle : copy.loginTitle;

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-sky-100 bg-white/80 p-6 sm:p-8">
      <h1 className="text-3xl font-semibold text-sky-950">{title}</h1>
      <Suspense fallback={<p role="status" className="mt-4 text-sm text-slate-600">{copy.pending}</p>}>
        <BuyerAuthContent {...props} locale={locale} />
      </Suspense>
    </section>
  );
}

async function BuyerAuthContent({ mode, searchParams, locale }: AuthPageProps & { locale: Locale }) {
  const [query, buyer] = await Promise.all([searchParams, getBuyer()]);
  const next = buyerReturnPath(query.next);
  if (buyer) redirect(next);
  const { buyer: copy, owner } = messages[locale];
  const registering = mode === "register";
  const reason = query.reason === "cart" || query.reason === "favorite" ? query.reason : undefined;
  const notice = reason === "cart" ? copy.cartNotice : reason === "favorite" ? copy.favoriteNotice : null;

  return (
    <>
      {notice && <p role="status" className="mt-4 rounded-xl bg-sky-50 p-3 text-sm text-sky-900">{notice}</p>}
      <BuyerAuthForm mode={mode} next={next} />
      <p className="mt-4 text-sm text-slate-600">
        {registering ? copy.hasAccount : copy.noAccount}{" "}
        <Link className="font-semibold text-sky-800 underline" href={buyerAuthLink(registering ? "login" : "register", next, reason)}>
          {registering ? copy.login : copy.register}
        </Link>
      </p>
      {!registering && (
        <Link href="/owner/login" prefetch={false} className="mt-3 inline-block text-sm text-sky-800 underline">
          {owner.login}
        </Link>
      )}
    </>
  );
}
