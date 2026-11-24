import { formatRating } from "@/lib/format";
import type { Locale } from "@/lib/i18n";

const reviewLabels = {
  ru: { one: "отзыв", few: "отзыва", many: "отзывов", other: "отзыва" },
  en: { one: "review", other: "reviews" },
};

export function StarRating({
  rating,
  count,
  locale,
}: {
  rating: number;
  count?: number;
  locale: Locale;
}) {
  const filled = Math.round(rating);
  const forms: Partial<Record<Intl.LDMLPluralRule, string>> = reviewLabels[locale];
  const countLabel = count === undefined ? null : forms[new Intl.PluralRules(locale).select(count)] ?? forms.other;

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
      <span className="text-sky-600" aria-hidden>
        {"★".repeat(filled)}
        {"☆".repeat(5 - filled)}
      </span>
      <span className="font-semibold text-sky-900">{formatRating(rating, locale)}</span>
      {typeof count === "number" ? (
        <span className="text-slate-500">({count} {countLabel})</span>
      ) : null}
    </span>
  );
}
