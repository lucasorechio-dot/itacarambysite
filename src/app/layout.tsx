import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SITE_NAME, SITE_TAGLINE } from "@/content/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description:
    "Laboratório de prótese dentária em Anápolis (GO). Coroas, facetas, protocolos, próteses totais e removíveis em cerâmica, E.max, Rosetta, Signum, Resilab e metalocerâmica.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
