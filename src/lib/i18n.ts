import ru from "./messages/ru.json";
import en from "./messages/en.json";

export const locales = ["ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";
export const localeCookie = "krasnaya-locale";

export function isLocale(value: unknown): value is Locale {
  return value === "ru" || value === "en";
}

export const messages = { ru, en } satisfies Record<Locale, typeof ru>;
export const formatLocales = { ru: "ru-RU", en: "en-GB" } satisfies Record<Locale, string>;
