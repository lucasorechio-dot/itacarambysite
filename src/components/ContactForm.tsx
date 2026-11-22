"use client";

import { useState } from "react";
import { whatsappLink } from "@/content/site";

// Por enquanto o formulário monta a mensagem e abre o WhatsApp.
// Na próxima etapa ele também vai salvar no banco e aparecer no painel admin.
export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const msg = [
      `Olá! Sou ${data.get("nome")}${data.get("clinica") ? ` (${data.get("clinica")})` : ""}.`,
      `Assunto: ${data.get("assunto")}`,
      String(data.get("mensagem") ?? ""),
      data.get("telefone") ? `Telefone: ${data.get("telefone")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  const field =
    "w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-aqua focus:ring-2 focus:ring-aqua/30";
  const label = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-navy/70";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl bg-porcelain p-6 sm:grid-cols-2 sm:p-8">
      <div>
        <label htmlFor="nome" className={label}>Nome</label>
        <input id="nome" name="nome" required className={field} />
      </div>
      <div>
        <label htmlFor="clinica" className={label}>Clínica / consultório</label>
        <input id="clinica" name="clinica" className={field} />
      </div>
      <div>
        <label htmlFor="telefone" className={label}>Telefone</label>
        <input id="telefone" name="telefone" type="tel" className={field} />
      </div>
      <div>
        <label htmlFor="assunto" className={label}>Assunto</label>
        <select id="assunto" name="assunto" className={field} defaultValue="Enviar um caso">
          <option>Enviar um caso</option>
          <option>Orçamento</option>
          <option>Quero ser parceiro</option>
          <option>Outro</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="mensagem" className={label}>Mensagem</label>
        <textarea id="mensagem" name="mensagem" rows={4} required className={field} />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          className="rounded-full bg-navy px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ivory transition hover:bg-navy-2"
        >
          Enviar mensagem
        </button>
        {sent && <p className="text-sm text-navy/70">Abrimos o WhatsApp com sua mensagem.</p>}
      </div>
    </form>
  );
}
