import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getLocale } from "@/lib/server-locale";
import { messages } from "@/lib/i18n";
import { Providers } from "./providers";
import { getBuyer } from "@/lib/buyer-auth";
import { getBuyerCartCount } from "@/lib/buyer-cart";
import "./globals.css";

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
});

// The language cookie determines the document's lang and its first render.
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { meta, nav } = messages[await getLocale()];
  return {
    title: { default: meta.title, template: `%s · ${nav.brand}` },
    description: meta.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, buyer] = await Promise.all([getLocale(), getBuyer()]);
  const itemCount = buyer ? await getBuyerCartCount(buyer.id) : 0;
  return (
    <html lang={locale} className={`${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Providers locale={locale}>
          <Header signedIn={Boolean(buyer)} itemCount={itemCount} />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
          <Footer locale={locale} />
        </Providers>
      </body>
    </html>
  );
}
