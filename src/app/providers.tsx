"use client";

import { CartProvider } from "@/context/CartContext";
import { createContext, useContext, type ReactNode } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>(defaultLocale);

export function Providers({ children, locale }: { children: ReactNode; locale: Locale }) {
  return (
    <LocaleContext.Provider value={locale}>
      <CartProvider>{children}</CartProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
