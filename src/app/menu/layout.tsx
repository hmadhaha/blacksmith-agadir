import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | The Blacksmith Agadir – Moroccan Grill, Pizza & Seafood",
  description: "View the full menu at The Blacksmith in Agadir. From Moroccan tagines and grilled meats to wood-fired pizzas, pasta, seafood, and indulgent desserts.",
  openGraph: {
    title: "Menu | The Blacksmith Agadir – Moroccan Grill, Pizza & Seafood",
    description: "View the full menu at Agadir's finest restaurant.",
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
