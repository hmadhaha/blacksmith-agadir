"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/i18n";

const navLinks = [
  { href: "/", label: "nav.home" },
  { href: "/menu", label: "nav.menu" },
  { href: "/about", label: "nav.about" },
  { href: "/gallery", label: "nav.gallery" },
  { href: "/reservations", label: "nav.reservations" },
  { href: "/contact", label: "nav.contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { locale, dir } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.jpg" alt="The Blacksmith" className="h-8 lg:h-9 w-auto rounded" />
            <span className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
              The
              <span className="text-primary"> Blacksmith</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
              >
                {t(locale, link.label)}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link
              href="/reservations"
              className="ml-2 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-all"
            >
              {t(locale, "common.bookTable")}
            </Link>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                  >
                    {t(locale, link.label)}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/reservations"
                onClick={() => setOpen(false)}
                className="w-full mt-4 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-all"
              >
                {t(locale, "common.bookTable")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
