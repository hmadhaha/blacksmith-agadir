"use client";

import { useLanguage } from "@/contexts/language-context";
import { localeNames, type Locale } from "@/lib/i18n";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const locales: Locale[] = ["en", "fr", "ar"];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
      >
        <Globe className="size-4" />
        <span className="hidden sm:inline">{localeNames[locale]}</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-32 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => { setLocale(l); setOpen(false); }}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-secondary/50 transition-colors flex items-center gap-2 ${locale === l ? "font-bold text-primary bg-primary/5" : "text-muted-foreground"}`}
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
