import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatRub } from "@/lib/format";
import { StarRating } from "./StarRating";
import { messages, type Locale } from "@/lib/i18n";

export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const copy = messages[locale];
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_10px_30px_-18px_rgba(47,108,148,0.45)]">
      <div
        className="relative h-36"
        style={{
          background: `linear-gradient(160deg, ${product.accent} 0%, #eef7fc 100%)`,
        }}
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-semibold leading-snug text-slate-800">
          {product.name}
        </h3>
        <p className="text-sm leading-6 text-slate-500">{product.summary}</p>
        <StarRating rating={product.rating} count={product.reviewCount} locale={locale} />
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-lg font-semibold text-sky-900">
              {formatRub(product.priceRub, locale)}
            </p>
            <p className="text-xs text-slate-500">{product.unit}</p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="rounded-full bg-sky-100 px-3 py-1.5 text-sm font-medium text-sky-800 hover:bg-sky-200"
          >
            {copy.product.view}
          </Link>
        </div>
      </div>
    </article>
  );
}
