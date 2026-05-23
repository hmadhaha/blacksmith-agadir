import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/language-context";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Blacksmith | Best Restaurant in Agadir – Moroccan Cuisine & Grill",
  description:
    "The Blacksmith is Agadir's top-rated restaurant for authentic Moroccan cuisine, grilled meats, seafood, and wood-fired pizzas. Open daily 8:30AM–1AM. Reserve your table now.",
  keywords: [
    "The Blacksmith Agadir",
    "restaurant Agadir",
    "best restaurant in Agadir",
    "Moroccan restaurant Agadir",
    "Agadir dining",
    "where to eat in Agadir",
    "Agadir grill",
    "مطعم أكادير",
    "أكل مغربي أكادير",
    "أفضل مطعم في أكادير",
    "Agadir fine dining",
    "Agadir restaurant menu",
    "Blacksmith menu Agadir",
    "Agadir seafood restaurant",
    "مطعم ذا بلاك سميث أكادير",
  ],
  openGraph: {
    title: "The Blacksmith | Best Restaurant in Agadir – Moroccan Cuisine & Grill",
    description: "Agadir's top-rated restaurant for authentic Moroccan cuisine, grilled meats, and seafood. Open daily 8:30AM–1AM.",
    type: "website",
    locale: "en_US",
    siteName: "The Blacksmith Agadir",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <Toaster position="top-center" richColors />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
