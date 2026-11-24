import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { defaultLocale, isLocale, localeCookie } from "./i18n";

export const getLocale = cache(async () => {
  const value = (await cookies()).get(localeCookie)?.value;
  return isLocale(value) ? value : defaultLocale;
});
