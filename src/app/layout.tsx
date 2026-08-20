import type { Metadata } from "next";
import { Geist, Geist_Mono, Sen } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/PostHogProvider";

// The exact font stack the product app itself loads (app/layout.tsx) —
// Sen for the brand wordmark and display type, Geist for body, Geist Mono
// for data. The landing page should look like it belongs to the product.
const sen = Sen({
  variable: "--font-sen",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agristato",
  description:
    "Da amostra ao talhão, em uma dose só. Calagem, gessagem, adubação e inteligência de mercado com o rigor do Boletim IAC 100 e da EMBRAPA Cerrados.",
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
      <body className={`${sen.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div
          className="grain-overlay"
          aria-hidden
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
