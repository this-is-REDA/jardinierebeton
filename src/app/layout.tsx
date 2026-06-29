import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jardinière Béton | Béton allégé · Indoor & Outdoor",
    template: "%s | Jardinière Béton",
  },
  description:
    "Jardinières en béton allégé, indoor & outdoor, fabriquées au Maroc. Jardinière rectangle et carrée, teintées dans la masse. Livraison partout au Maroc.",
  icons: {
    icon: [{ url: "/images/favicon.png", type: "image/png" }],
    apple: [{ url: "/images/favicon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${dmSans.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#1c1917] font-sans text-[#e8e2d3] antialiased">
        {children}
      </body>
    </html>
  );
}
