import { Suspense } from "react";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductCard } from "@/components/ProductCard";
import { listProducts } from "@/lib/products";
import { messages, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";

export async function generateMetadata() {
  return { title: messages[await getLocale()].nav.catalog };
}

type CatalogProps = {
  searchParams: Promise<{ category?: string | string[] }>;
};

export default async function CatalogPage({ searchParams }: CatalogProps) {
  const locale = await getLocale();
  const copy = messages[locale];
  return (
    <div>
      <h1 className="text-3xl font-semibold text-sky-950">{copy.nav.catalog}</h1>
      <div className="mt-6">
        <Suspense>
          <CatalogFilters />
        </Suspense>
        <Suspense fallback={<p className="text-slate-500">{copy.common.loadingProducts}</p>}>
          <CatalogProducts searchParams={searchParams} locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}

async function CatalogProducts({ searchParams, locale }: CatalogProps & { locale: Locale }) {
  const value = (await searchParams).category;
  const category = Array.isArray(value) ? value[0] : value;
  const products = await listProducts(locale, category && category !== "all" ? category : undefined);

  if (products.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-8 text-slate-500">
        {messages[locale].catalog.empty}
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} locale={locale} />
      ))}
    </div>
  );
}
