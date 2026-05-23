import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews | The Blacksmith Agadir",
  description: "Read reviews from our guests at The Blacksmith in Agadir. Share your own dining experience with us.",
  openGraph: {
    title: "Reviews | The Blacksmith Agadir",
    description: "Read reviews from our guests at The Blacksmith.",
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
