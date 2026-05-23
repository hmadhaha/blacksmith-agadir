import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | The Blacksmith Agadir",
  description: "Get in touch with The Blacksmith in Agadir. Call, email, or visit us for reservations, inquiries, or feedback.",
  openGraph: {
    title: "Contact | The Blacksmith Agadir",
    description: "Get in touch with The Blacksmith in Agadir.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
