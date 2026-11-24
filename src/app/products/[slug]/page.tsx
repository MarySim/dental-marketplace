import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { StarRating } from "@/components/StarRating";
import { getProduct } from "@/lib/products";
import { formatRub } from "@/lib/format";
import { messages, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const product = await getProduct(slug, locale);
  return { title: product?.name ?? messages[locale].product.listing };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const locale = await getLocale();
  return (
    <Suspense fallback={<p className="text-slate-500">{messages[locale].product.loading}</p>}>
      <ProductDetails params={params} locale={locale} />
    </Suspense>
  );
}

async function ProductDetails({ params, locale }: ProductPageProps & { locale: Locale }) {
  const { slug } = await params;
  const product = await getProduct(slug, locale);
  if (!product) notFound();
  const copy = messages[locale];

  return (
    <article className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div
        className="min-h-72 rounded-3xl border border-sky-100"
        style={{
          background: `linear-gradient(165deg, ${product.accent} 0%, #f7fbfe 72%)`,
        }}
      />
      <div className="rounded-3xl border border-sky-100 bg-white/80 p-6 sm:p-8">
        <h1 className="mt-2 text-3xl font-semibold text-sky-950">{product.name}</h1>
        <div className="mt-3">
          <StarRating rating={product.rating} count={product.reviewCount} locale={locale} />
        </div>
        <p className="mt-4 text-3xl font-semibold text-sky-900">
          {formatRub(product.priceRub, locale)}
        </p>
        <p className="text-sm text-slate-500">{product.unit}</p>
        <p className="mt-4 leading-7 text-slate-600">{product.description}</p>
        <ul className="mt-5 space-y-2 text-sm text-slate-700">
          {product.highlights.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-sky-600">•</span>
              {item}
            </li>
          ))}
        </ul>
        {product.shipsWorldwide ? (
          <p className="mt-6 rounded-2xl bg-sky-50 p-4 text-sm leading-6 text-sky-900">
            {copy.product.deliveryNote}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <AddToCartButton slug={product.slug} />
          <Link
            href="/cart"
            className="rounded-full border border-sky-200 px-5 py-2.5 text-sm font-medium text-sky-800"
          >
            {copy.product.openCart}
          </Link>
        </div>
      </div>
    </article>
  );
}
