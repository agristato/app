import type { Metadata } from "next";
import { Domine, Geist, Sen } from "next/font/google";
import "./globals.css";

// Geist replaces Outfit to align with the app's design system
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const domine = Domine({
  variable: "--font-domine",
  subsets: ["latin"],
});

const sen = Sen({
  variable: "--font-sen",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Agristato",
  description: "Transforme dados do solo em decisões inteligentes",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${domine.variable} ${sen.variable} antialiased`}>{children}</body>
    </html>
  );
}
