import { formatLocales, type Locale } from "./i18n";

export function formatRub(amount: number, locale: Locale) {
  return new Intl.NumberFormat(formatLocales[locale], {
    style: "currency",
    currency: "RUB",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatRating(rating: number, locale: Locale) {
  return new Intl.NumberFormat(formatLocales[locale], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
}
