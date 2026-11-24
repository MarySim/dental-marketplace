import { Suspense } from "react";
import Link from "next/link";
import { StarRating } from "@/components/StarRating";
import { clinic } from "@/lib/data";
import { listProducts } from "@/lib/products";
import { formatRating, formatRub } from "@/lib/format";
import { messages, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";

export async function generateMetadata() {
  return { title: messages[await getLocale()].nav.clinic };
}

export default async function ClinicPage() {
  const locale = await getLocale();
  const copy = messages[locale];
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-sky-100 bg-white/80 p-8">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-sky-700">
          {copy.clinic.type}
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-sky-950">{copy.nav.brand}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <StarRating rating={clinic.rating} count={clinic.reviewCount} locale={locale} />
          <span className="rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-800">
            {copy.common.verified}
          </span>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-sky-50 p-4">
            <dt className="text-xs uppercase tracking-wide text-sky-700">{copy.clinic.hoursLabel}</dt>
            <dd className="mt-1 font-medium text-sky-950">{copy.clinic.hours}</dd>
          </div>
          <div className="rounded-2xl bg-sky-50 p-4">
            <dt className="text-xs uppercase tracking-wide text-sky-700">{copy.clinic.addressLabel}</dt>
            <dd className="mt-1 font-medium text-sky-950">{copy.clinic.address}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-slate-500">{copy.clinic.note}</p>
      </section>

      <section className="rounded-3xl border border-sky-100 bg-white/80 p-8">
        <h2 className="text-xl font-semibold text-sky-950">{copy.clinic.featuresTitle}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {copy.clinic.features.map((feature) => (
            <li
              key={feature}
              className="rounded-full bg-sky-100 px-3 py-1.5 text-sm text-sky-900"
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-sky-100 bg-white/80 p-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold text-sky-950">{copy.clinic.prices}</h2>
          <Link href="/catalog" className="text-sm font-medium text-sky-700">
            {copy.common.prices}
          </Link>
        </div>
        <Suspense fallback={<p className="text-slate-500">{copy.clinic.loadingPrices}</p>}>
          <TreatmentPrices locale={locale} />
        </Suspense>
      </section>

      <section className="rounded-3xl border border-sky-100 bg-white/80 p-8">
        <h2 className="text-xl font-semibold text-sky-950">{copy.clinic.reviews}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {copy.clinic.localGuide} · {copy.clinic.reviewDate}
        </p>
        <p className="mt-3 text-3xl font-semibold text-sky-900">
          {formatRating(clinic.rating, locale)}
          <span className="ml-2 text-base font-medium text-slate-500">
            {copy.clinic.outOfFive}
          </span>
        </p>
      </section>
    </div>
  );
}

async function TreatmentPrices({ locale }: { locale: Locale }) {
  const products = await listProducts(locale, { kind: "treatment" });
  return (
    <ul className="mt-4 divide-y divide-sky-100">
      {products.map((item) => (
        <li key={item.slug} className="flex flex-wrap items-baseline justify-between gap-2 py-4">
          <div>
            <Link href={`/products/${item.slug}`} className="font-medium text-sky-950">
              {item.name}
            </Link>
            <p className="text-sm text-slate-500">{item.unit}</p>
          </div>
          <p className="font-semibold text-sky-900">{formatRub(item.priceRub, locale)}</p>
        </li>
      ))}
    </ul>
  );
}
