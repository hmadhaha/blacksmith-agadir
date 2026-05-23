import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservations | The Blacksmith Agadir",
  description: "Book your table at The Blacksmith in Agadir. Reserve online for an unforgettable dining experience.",
  openGraph: {
    title: "Reservations | The Blacksmith Agadir",
    description: "Book your table at The Blacksmith in Agadir.",
  },
};

export default function ReservationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
