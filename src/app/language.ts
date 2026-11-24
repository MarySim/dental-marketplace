"use server";

import { cookies } from "next/headers";
import { isLocale, localeCookie } from "@/lib/i18n";

export async function setLanguage(formData: FormData) {
  const value = formData.get("locale");
  if (!isLocale(value)) return;

  (await cookies()).set(localeCookie, value, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: "lax",
  });
}
