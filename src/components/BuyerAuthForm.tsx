"use client";

import { useActionState } from "react";
import { authenticateBuyer } from "@/app/buyer-actions";
import { useLocale } from "@/app/providers";
import { messages } from "@/lib/i18n";

export function BuyerAuthForm({ mode, next }: { mode: "register" | "login"; next: string }) {
  const copy = messages[useLocale()].buyer;
  const [error, action, pending] = useActionState(authenticateBuyer.bind(null, mode), null);
  const registering = mode === "register";
  const input = "mt-1 w-full rounded-xl border border-sky-200 px-3 py-2";

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      {registering && (
        <label className="block text-sm font-medium text-slate-700">
          {copy.name}
          <input className={input} name="name" autoComplete="name" required maxLength={100} />
        </label>
      )}
      <label className="block text-sm font-medium text-slate-700">
        {copy.email}
        <input className={input} type="email" name="email" autoComplete="username" required maxLength={254} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        {copy.password}
        <input className={input} type="password" name="password"
          autoComplete={registering ? "new-password" : "current-password"}
          minLength={registering ? 12 : undefined} maxLength={128} required />
        {registering && <span className="mt-1 block text-xs text-slate-500">{copy.passwordHint}</span>}
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{copy[error]}</p>}
      <button type="submit" disabled={pending}
        className="w-full rounded-full bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? copy.pending : registering ? copy.register : copy.login}
      </button>
    </form>
  );
}
