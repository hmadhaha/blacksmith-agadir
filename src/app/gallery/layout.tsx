import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | The Blacksmith Agadir",
  description: "Browse through our gallery featuring the ambiance, dishes, and moments at The Blacksmith in Agadir.",
  openGraph: {
    title: "Gallery | The Blacksmith Agadir",
    description: "Browse through our gallery at The Blacksmith.",
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
