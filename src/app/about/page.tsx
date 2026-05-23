"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Globe, Heart, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/i18n";

const timelineKeys = [
  { year: "aboutPage.timeline1Year", title: "aboutPage.timeline1Title", desc: "aboutPage.timeline1Desc" },
  { year: "aboutPage.timeline2Year", title: "aboutPage.timeline2Title", desc: "aboutPage.timeline2Desc" },
  { year: "aboutPage.timeline3Year", title: "aboutPage.timeline3Title", desc: "aboutPage.timeline3Desc" },
  { year: "aboutPage.timeline4Year", title: "aboutPage.timeline4Title", desc: "aboutPage.timeline4Desc" },
];

const valueKeys = [
  { icon: ChefHat, title: "aboutPage.values.passion", text: "aboutPage.valuesText.passion" },
  { icon: Globe, title: "aboutPage.values.globe", text: "aboutPage.valuesText.globe" },
  { icon: Heart, title: "aboutPage.values.heart", text: "aboutPage.valuesText.heart" },
  { icon: Trophy, title: "aboutPage.values.trophy", text: "aboutPage.valuesText.trophy" },
];

export default function AboutPage() {
  const { locale } = useLanguage();
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-card border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 px-3 py-1">{t(locale, "aboutPage.title")}</Badge>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-6xl font-heading font-bold mb-4">
            {t(locale, "aboutPage.title")} <span className="text-primary">{t(locale, "aboutPage.storyTitleSpan")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            {t(locale, "aboutPage.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">{t(locale, "aboutPage.storyTitle")} <span className="text-primary">{t(locale, "aboutPage.storyTitleSpan")}</span></h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t(locale, "aboutPage.storyP1")}</p>
                <p>{t(locale, "aboutPage.storyP2")}</p>
                <p>{t(locale, "aboutPage.storyP3")}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="aspect-[4/5] rounded-2xl overflow-hidden relative">
              <img src="/about-hero.jpg" alt="The Blacksmith Restaurant" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Values */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {valueKeys.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl bg-card border border-border"
              >
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="size-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{t(locale, value.title)}</h3>
                <p className="text-sm text-muted-foreground">{t(locale, value.text)}</p>
              </motion.div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-border hidden lg:block" />
            {timelineKeys.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-start gap-8 mb-12 last:mb-0 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
              >
                <div className="flex-1" />
                <div className="hidden lg:flex size-10 rounded-full bg-primary text-primary-foreground items-center justify-center text-sm font-bold shrink-0 relative z-10">
                  {t(locale, item.year).slice(2)}
                </div>
                <div className="flex-1 bg-card border border-border rounded-xl p-6">
                  <Badge variant="secondary" className="mb-2">{t(locale, item.year)}</Badge>
                  <h3 className="font-heading font-semibold text-lg mb-2">{t(locale, item.title)}</h3>
                  <p className="text-sm text-muted-foreground">{t(locale, item.desc)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
