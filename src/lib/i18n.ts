import { en } from "@/locales/en";
import { fr } from "@/locales/fr";
import { ar } from "@/locales/ar";

export type Locale = "en" | "fr" | "ar";

const translations: Record<Locale, typeof en> = { en, fr, ar };

export const localeNames: Record<Locale, string> = {
  en: "🇬🇧 EN",
  fr: "🇫🇷 FR",
  ar: "🇲🇦 AR",
};

const RTL_LOCALES = new Set<Locale>(["ar"]);

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.has(locale);
}

export function getTranslation(locale: Locale) {
  return translations[locale] || translations.en;
}

export function t(locale: Locale, path: string): string {
  const keys = path.split(".");
  let value: unknown = getTranslation(locale);
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      value = getTranslation("en");
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return path;
        }
      }
      return value as string;
    }
  }
  return typeof value === "string" ? value : path;
}
