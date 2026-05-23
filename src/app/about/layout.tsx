import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | The Blacksmith Agadir",
  description: "Discover the story behind The Blacksmith — Agadir's beloved restaurant serving authentic Moroccan cuisine since 2000.",
  openGraph: {
    title: "About | The Blacksmith Agadir",
    description: "Discover the story behind The Blacksmith.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
