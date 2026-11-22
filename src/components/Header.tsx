"use client";

import { useEffect, useState } from "react";
import { LogoMark, LogoName } from "@/components/Logo";
import { site, whatsappLink } from "@/content/site";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#galeria", label: "Galeria" },
  { href: "#parceiros", label: "Parceiros" },
  { href: "#contato", label: "Contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled || open ? "bg-navy/95 shadow-lg backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 py-4">
        <a href="#inicio" className="flex items-center gap-3 text-copper" aria-label={`${site.name} — início`}>
          <LogoMark className="h-8 w-auto" />
          <LogoName className="h-5 w-auto sm:h-6" title={site.name} />
        </a>

        <nav className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.15em] text-ivory/80 xl:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-copper">
              {l.label}
            </a>
          ))}
          <a
            href={whatsappLink("Olá! Gostaria de enviar um caso para o laboratório.")}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-full bg-copper px-5 py-2.5 text-navy transition hover:bg-ivory"
          >
            Enviar caso
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-ivory xl:hidden"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ivory/10 px-5 pb-6 pt-2 xl:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-semibold uppercase tracking-[0.15em] text-ivory/85"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
