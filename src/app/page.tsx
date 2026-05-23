"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Quote, Play, Clock, MapPin, ChefHat, VolumeX, Volume2, Percent } from "lucide-react";
import { imageUrl } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/i18n";

const defaultStats = [
  { label: "stats.years", value: "25+" },
  { label: "stats.guests", value: "0" },
  { label: "stats.menuItems", value: "0" },
  { label: "stats.awards", value: "0" },
];

const defaultFeatured = [
  { name: "The Blacksmith Flamin Chicken Burger", description: "Signature flame-grilled chicken burger with special house sauce", price: "120 DH", tag: "Signature", image: "The Blacksmith Flamin Chicken Burger.jpg", discountPercent: 0 },
  { name: "Shish Tawook", description: "Marinated chicken skewers grilled to perfection", price: "95 DH", tag: "Popular", image: "Shish Tawook.jpg", discountPercent: 0 },
  { name: "Lamb Shank", description: "Slow-cooked lamb shank with aromatic herbs and vegetables", price: "150 DH", tag: "Chef's Pick", image: "Lamb Shank.jpg", discountPercent: 0 },
  { name: "Chocolate Lava Cake", description: "Warm chocolate cake with molten center, served with ice cream", price: "65 DH", tag: "Dessert", image: "Chocolate Lava Cake.jpg", discountPercent: 0 },
];

const reviews = [
  { author: "Tomasz S.", text: "Very nice restaurant. The staff are extremely friendly and welcoming. The atmosphere is great with two different indoor seating areas and a lovely outdoor terrace.", rating: 5 },
  { author: "Elena P.", text: "Fantastic meal! We had the mixed grill followed by creme caramel and tiramisu. The meat was great, desserts were homemade, and the prices were fantastic!", rating: 5 },
  { author: "Marny C.", text: "Great restaurant! Food was delicious - really enjoyed the garlic bread as starter and shish kebab as main. Mojitos are also great, as well as crème brûlée.", rating: 5 },
];

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: "easeOut" }} className={className}>
      {children}
    </motion.section>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const { locale } = useLanguage();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const [featuredDishes, setFeaturedDishes] = useState(defaultFeatured);
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    fetch("/api/settings?key=stats")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.items) setStats(data.items);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((items: { id: string; name: string; description: string; price: number; discountPercent: number; image: string | null; popular: boolean }[]) => {
        if (items.length > 0) {
          const featured = items.filter((i) => i.popular).slice(0, 4);
          if (featured.length === 0) {
            setFeaturedDishes(items.slice(0, 4).map((i) => ({
              name: i.name, description: i.description,
              price: i.discountPercent > 0 ? `${Math.round(i.price * (1 - i.discountPercent / 100))} DH` : `${i.price} DH`,
              tag: i.popular ? "Popular" : "Featured",
              image: i.image || "",
              discountPercent: i.discountPercent,
            })));
          } else {
            setFeaturedDishes(featured.map((i) => ({
              name: i.name, description: i.description,
              price: i.discountPercent > 0 ? `${Math.round(i.price * (1 - i.discountPercent / 100))} DH` : `${i.price} DH`,
              tag: i.popular ? "Popular" : "Featured",
              image: i.image || "",
              discountPercent: i.discountPercent,
            })));
          }
        }
      })
      .catch(() => {});
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />
          <video ref={videoRef} autoPlay muted loop playsInline poster="/hero-poster.jpg" className="w-full h-full object-cover">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </motion.div>
        {/* Sound toggle */}
        <button onClick={toggleSound} className="absolute top-6 right-6 z-30 size-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all">
          {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
        <motion.div style={{ opacity: heroOpacity }} className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs tracking-widest uppercase bg-white/10 text-white border-white/20 backdrop-blur-sm">
              {t(locale, "home.heroBadge")}
            </Badge>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-6 text-shadow">
            <img src="/logo.jpg" alt="The Blacksmith" className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto mx-auto mb-4 rounded-xl" />
            The<span className="text-primary block mt-2">Blacksmith</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t(locale, "home.heroSubtitle")}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/reservations" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-base font-medium transition-all">
              {t(locale, "home.heroReserve")} <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link href="/menu" className="inline-flex items-center justify-center rounded-lg border border-white/20 text-white hover:bg-white/10 px-8 py-4 text-base font-medium transition-all">
              <Play className="mr-2 size-4" /> {t(locale, "home.heroViewMenu")}
            </Link>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 text-white/60 text-xs tracking-widest uppercase">
            <span>Scroll</span>
            <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5">
              <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-3xl lg:text-4xl font-heading font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{t(locale, stat.label)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <AnimatedSection className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 px-3 py-1">{t(locale, "home.featuredBadge")}</Badge>
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">{t(locale, "home.featuredTitle")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t(locale, "home.featuredDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDishes.map((dish, i) => (
              <motion.div
                key={dish.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute top-3 left-3 z-20 flex gap-2">
                    <Badge className="bg-primary/90 text-primary-foreground text-xs">{dish.tag}</Badge>
                    {(dish as { discountPercent?: number }).discountPercent ? (
                      <Badge className="bg-green-500 text-white text-xs"><Percent className="size-2.5 mr-0.5" /> {(dish as { discountPercent: number }).discountPercent}%</Badge>
                    ) : null}
                  </div>
                  <img src={imageUrl(dish.image)} alt={dish.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading font-semibold text-lg">{dish.name}</h3>
                    <span className="text-primary font-heading font-bold text-lg">{dish.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{dish.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
            <Link href="/menu" className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted px-6 py-3 text-sm font-medium transition-all">
              {t(locale, "common.viewFullMenu")} <ArrowRight className="ml-2 size-4" />
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* About */}
      <AnimatedSection className="py-20 lg:py-28 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 px-3 py-1">{t(locale, "home.aboutBadge")}</Badge>
              <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-6">{t(locale, "home.aboutTitle")} <span className="text-primary">{t(locale, "home.aboutTitleSpan")}</span></h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{t(locale, "home.aboutText")}</p>
              <div className="flex flex-col gap-4 mb-8">
                {[
                  { icon: ChefHat, textKey: "home.aboutYears" },
                  { icon: MapPin, textKey: "home.aboutLocation" },
                  { icon: Clock, textKey: "home.aboutHours" },
                ].map((item) => (
                  <div key={item.textKey} className="flex items-center gap-3 text-sm">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="size-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{t(locale, item.textKey)}</span>
                  </div>
                ))}
              </div>
              <Link href="/about" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-sm font-medium transition-all">
                {t(locale, "home.aboutLink")} <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
                <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                  <source src="/kitchen-video.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/5 rounded-2xl -z-10" />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary -z-10 rounded-2xl" />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Reviews */}
      <AnimatedSection className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 px-3 py-1">{t(locale, "home.reviewsBadge")}</Badge>
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">{t(locale, "home.reviewsTitle")}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t(locale, "home.reviewsSubtitle")} <span className="text-primary font-semibold">4.7</span> {t(locale, "home.reviewsOnGoogle")} 3,500 {t(locale, "home.reviewsReviews")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={review.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border relative"
              >
                <Quote className="size-6 text-primary/20 absolute top-4 right-4" />
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <p className="text-sm font-semibold">- {review.author}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
            <Link href="/reviews" className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted px-6 py-3 text-sm font-medium transition-all">
              {t(locale, "common.readAll")} <ArrowRight className="ml-2 size-4" />
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl lg:text-5xl font-heading font-bold text-white mb-4">
            {t(locale, "home.ctaTitle")}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            {t(locale, "home.ctaSubtitle")}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/reservations" className="inline-flex items-center justify-center rounded-lg bg-white text-primary hover:bg-white/90 px-8 py-4 text-base font-medium transition-all">
              {t(locale, "home.ctaBook")} <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link href="tel:+212808600401" className="inline-flex items-center justify-center rounded-lg border border-white/30 text-white hover:bg-white/10 px-8 py-4 text-base font-medium transition-all">
              <Play className="mr-2 size-4" /> {t(locale, "home.ctaCall")}
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  );
}
