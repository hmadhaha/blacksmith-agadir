"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Globe, Heart, Trophy } from "lucide-react";

const timeline = [
  { year: "2000", title: "The Beginning", description: "Chef Omar returns to Agadir after traveling the world, bringing international culinary expertise." },
  { year: "2005", title: "Growing Reputation", description: "The Blacksmith becomes a local favorite, known for its unique fusion of Moroccan and international cuisines." },
  { year: "2012", title: "Expansion", description: "Renovated and expanded to accommodate the growing number of guests with two indoor dining areas and a terrace." },
  { year: "2020", title: "A Decade of Excellence", description: "Celebrated 20 years as one of Agadir's top-rated restaurants with a 4.7-star rating." },
];

const values = [
  { icon: ChefHat, title: "Passion for Food", text: "Every dish is crafted with love and precision using the finest ingredients." },
  { icon: Globe, title: "Global Inspiration", text: "Drawing flavors from around the world while honoring Moroccan culinary traditions." },
  { icon: Heart, title: "Warm Hospitality", text: "Every guest is treated like family in our welcoming atmosphere." },
  { icon: Trophy, title: "Commitment to Quality", text: "Consistently delivering exceptional dining experiences that keep guests coming back." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-card border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 px-3 py-1">About Us</Badge>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-6xl font-heading font-bold mb-4">
            Our <span className="text-primary">Story</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            For over 25 years, Chef Omar has been crafting unforgettable dining experiences at The Blacksmith, blending Moroccan tradition with global flavors.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">A Journey of <span className="text-primary">Flavors</span></h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Chef Omar&apos;s culinary journey began 25 years ago when he left Morocco to explore the world&apos;s cuisines. From the bustling kitchens of Paris to the spice markets of Istanbul, he absorbed techniques and flavors that would later define The Blacksmith&apos;s unique menu.</p>
                <p>In 2000, he returned to Agadir with a dream: to create a restaurant where Moroccan hospitality meets international culinary excellence. The Blacksmith was born, and it quickly became a beloved destination for locals and travelers alike.</p>
                <p>Today, The Blacksmith stands as a testament to Chef Omar&apos;s vision, offering a diverse menu that ranges from traditional tagines to gourmet burgers, wood-fired pizzas, and fresh seafood.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="aspect-[4/5] rounded-2xl overflow-hidden relative">
              <img src="/about-hero.jpg" alt="The Blacksmith Restaurant" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Values */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {values.map((value, i) => (
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
                <h3 className="font-heading font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-border hidden lg:block" />
            {timeline.map((item, i) => (
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
                  {item.year.slice(2)}
                </div>
                <div className="flex-1 bg-card border border-border rounded-xl p-6">
                  <Badge variant="secondary" className="mb-2">{item.year}</Badge>
                  <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
