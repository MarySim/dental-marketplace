import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { requireBuyer } from "@/lib/buyer-auth";
import { messages } from "@/lib/i18n";
import { listBuyerFavorites } from "@/lib/products";
import { getLocale } from "@/lib/server-locale";

export default async function FavoritesPage() {
  const [buyer, locale] = await Promise.all([requireBuyer("/favorites", "favorite"), getLocale()]);
  const { common, favorites } = messages[locale];
  const products = await listBuyerFavorites(buyer.id, locale);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-sky-950">{favorites.title}</h1>
      {products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => <ProductCard key={product.slug} product={product} locale={locale} />)}
        </div>
      ) : (
        <div className="rounded-3xl border border-sky-100 bg-white p-8">
          <p className="text-slate-600">{favorites.empty}</p>
          <Link href="/catalog" className="mt-4 inline-block text-sky-700 underline">{common.browse}</Link>
        </div>
      )}
    </div>
  );
}
