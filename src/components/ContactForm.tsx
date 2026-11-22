"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/actions";
import { whatsappLink } from "@/content/site";

export function ContactForm({ whatsapp }: { whatsapp: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, { status: "idle" });

  const field =
    "w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-aqua focus:ring-2 focus:ring-aqua/30";
  const label = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-navy/70";

  if (state.status === "ok") {
    return (
      <div className="grid place-items-start gap-4 rounded-2xl bg-porcelain p-8">
        <p className="font-serif text-2xl text-navy">Mensagem enviada!</p>
        <p className="text-sm text-ink/70">Recebemos seu contato e vamos responder em breve.</p>
        {state.whatsappText && (
          <a
            href={whatsappLink(whatsapp, state.whatsappText)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25d366] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white"
          >
            Continuar no WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 rounded-2xl bg-porcelain p-6 sm:grid-cols-2 sm:p-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div>
        <label htmlFor="nome" className={label}>Nome</label>
        <input id="nome" name="nome" required maxLength={120} className={field} />
      </div>
      <div>
        <label htmlFor="clinica" className={label}>Clínica / consultório</label>
        <input id="clinica" name="clinica" maxLength={160} className={field} />
      </div>
      <div>
        <label htmlFor="telefone" className={label}>Telefone</label>
        <input id="telefone" name="telefone" type="tel" maxLength={40} className={field} />
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
        <textarea id="mensagem" name="mensagem" rows={4} required maxLength={4000} className={field} />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-navy px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ivory transition hover:bg-navy-2 disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Enviar mensagem"}
        </button>
        {state.status === "error" && (
          <p className="text-sm text-red-700">
            {state.message}{" "}
            {state.whatsappText && (
              <a className="underline" href={whatsappLink(whatsapp, state.whatsappText)} target="_blank" rel="noopener noreferrer">
                Abrir WhatsApp
              </a>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
