"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Camera } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/i18n";

export function SiteFooter() {
  const { locale } = useLanguage();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.jpg" alt="The Blacksmith" className="h-8 w-auto rounded" />
              <h3 className="text-xl font-heading font-bold">
                The <span className="text-primary">Blacksmith</span>
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(locale, "footer.description")}
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">{t(locale, "footer.quickLinks")}</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "nav.home" },
                { href: "/menu", label: "nav.menu" },
                { href: "/about", label: "nav.about" },
                { href: "/gallery", label: "nav.gallery" },
                { href: "/contact", label: "nav.contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(locale, link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">{t(locale, "footer.hours")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>{t(locale, "footer.monThu")}</span>
                <span>8:30 AM - 12:00 AM</span>
              </li>
              <li className="flex justify-between">
                <span>{t(locale, "footer.friSun")}</span>
                <span>8:30 AM - 1:00 AM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">{t(locale, "footer.contact")}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://maps.google.com/?q=2+Rue+des+Orangers+Agadir+80000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <MapPin className="size-4 mt-0.5 shrink-0" />
                  <span>2 Rue des Orangers, Agadir 80000</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+212808600401"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="size-4 shrink-0" />
                  <span>+212 8086 00401</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/blacksmithagadir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Camera className="size-4 shrink-0" />
                  <span>Instagram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} The Blacksmith Agadir. {t(locale, "footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
