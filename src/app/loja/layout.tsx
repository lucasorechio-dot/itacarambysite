import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { LogoMark } from "@/components/Logo";
import { getContent } from "@/lib/content";
import { SITE_NAME, whatsappLink } from "@/content/site";

export const metadata: Metadata = {
  title: `Loja — ${SITE_NAME}`,
  description: "Modelos de estudo e cursos de prótese dentária do laboratório Itacaramby.",
};

export default async function LojaLayout({ children }: LayoutProps<"/loja">) {
  const { settings } = await getContent();
  return (
    <>
      <Header whatsapp={settings.contact.whatsapp} />
      <main className="flex-1 bg-porcelain">{children}</main>
      <footer className="bg-navy py-10 text-sm text-ivory/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 text-copper">
            <LogoMark className="h-6 w-auto" />
            <span className="font-serif text-ivory">{SITE_NAME}</span>
          </Link>
          <p>
            Dúvidas sobre a loja?{" "}
            <a href={whatsappLink(settings.contact.whatsapp, "Olá! Tenho uma dúvida sobre a loja.")} target="_blank" rel="noopener noreferrer" className="text-copper underline">
              Fale no WhatsApp
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
