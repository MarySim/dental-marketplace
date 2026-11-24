import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { StarRating } from "@/components/StarRating";
import { clinic } from "@/lib/data";
import { listProducts } from "@/lib/products";
import { messages, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";

export default async function Home() {
  const locale = await getLocale();
  const { home, common, nav } = messages[locale];
  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-[0_20px_50px_-28px_rgba(47,108,148,0.5)] sm:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-700">
          {nav.store}
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-sky-950 sm:text-5xl">
          {home.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          {home.intro}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <StarRating rating={clinic.rating} count={clinic.reviewCount} locale={locale} />
          {clinic.verifiedByOwner ? (
            <span className="rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-800">
              {common.verified}
            </span>
          ) : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/catalog"
            className="rounded-full bg-sky-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-800"
          >
            {common.browse}
          </Link>
          <Link
            href="/clinic"
            className="rounded-full border border-sky-200 bg-white px-5 py-2.5 text-sm font-medium text-sky-800 hover:bg-sky-50"
          >
            {home.profile}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: home.listings,
            body: home.listingsNote,
          },
          {
            title: home.sales,
            body: home.salesNote,
          },
          {
            title: home.shipping,
            body: home.shippingNote,
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-sky-100 bg-white/70 p-5"
          >
            <h2 className="font-semibold text-sky-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-sky-950">{home.featured}</h2>
          <Link href="/catalog" className="text-sm font-medium text-sky-700">
            {common.prices}
          </Link>
        </div>
        <Suspense fallback={<p className="text-slate-500">{common.loadingProducts}</p>}>
          <FeaturedProducts locale={locale} />
        </Suspense>
      </section>
    </div>
  );
}

async function FeaturedProducts({ locale }: { locale: Locale }) {
  const products = await listProducts(locale, { limit: 4 });
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} locale={locale} />
      ))}
    </div>
  );
}
