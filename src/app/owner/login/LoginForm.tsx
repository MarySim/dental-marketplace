"use client";

import { useActionState } from "react";
import { useLocale } from "@/app/providers";
import { messages } from "@/lib/i18n";
import { signInOwner } from "../actions";

export function LoginForm() {
  const copy = messages[useLocale()].owner;
  const [error, action, pending] = useActionState(signInOwner, null);

  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        {copy.email}
        <input
          name="email"
          type="email"
          autoComplete="username"
          maxLength={254}
          required
          className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        {copy.password}
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={128}
          required
          className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2"
        />
      </label>
      {error ? <p role="alert" className="text-sm text-red-700">{copy[error]}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
      >
        {pending ? copy.signingIn : copy.signIn}
      </button>
    </form>
  );
}
