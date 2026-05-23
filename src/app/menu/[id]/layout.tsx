import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | The Blacksmith Agadir",
  description: "Explore our diverse menu featuring Moroccan specialties, grilled meats, seafood, pizzas, pastas, and more.",
};

export default function MenuItemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
