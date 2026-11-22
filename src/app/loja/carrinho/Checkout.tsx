"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useCart } from "@/components/store/CartProvider";
import { brl } from "@/content/site";
import { createOrder, type CheckoutState } from "../actions";

const field =
  "w-full rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-aqua focus:ring-2 focus:ring-aqua/30";
const label = "grid gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy/70";

export function Checkout({ shippingFlatCents, pickupNote }: { shippingFlatCents: number; pickupNote: string }) {
  const cart = useCart();
  const [delivery, setDelivery] = useState<"envio" | "retirada">("envio");
  const [state, action, pending] = useActionState<CheckoutState, FormData>(createOrder, {});

  const shipping = cart.hasPhysical && delivery === "envio" ? shippingFlatCents : 0;
  const total = cart.subtotal + shipping;

  if (!cart.ready) return <div className="mx-auto max-w-6xl px-5 py-16 text-ink/50">Carregando…</div>;

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-ink/70">Seu carrinho está vazio.</p>
        <Link href="/loja" className="mt-4 inline-block rounded-full bg-navy px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ivory">
          Ver a loja
        </Link>
      </div>
    );
  }

  async function lookupCep(cep: string) {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const d = await r.json();
      if (d.erro) return;
      const set = (n: string, v: string) => {
        const el = document.querySelector<HTMLInputElement>(`input[name="${n}"]`);
        if (el && !el.value) el.value = v;
      };
      set("street", d.logradouro ?? "");
      set("district", d.bairro ?? "");
      set("city", d.localidade ?? "");
      set("state", d.uf ?? "");
    } catch {}
  }

  return (
    <form action={action} className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1.3fr_1fr]">
      <input type="hidden" name="items" value={JSON.stringify(cart.items.map((i) => ({ type: i.type, id: i.id, plan: i.plan, qty: i.qty })))} />
      <input type="hidden" name="delivery" value={cart.hasPhysical ? delivery : "nenhuma"} />

      <div className="grid content-start gap-6">
        {/* ITENS */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-navy/5">
          <h2 className="mb-4 font-serif text-xl text-navy">Itens</h2>
          <ul className="divide-y divide-navy/10">
            {cart.items.map((i) => (
              <li key={i.key} className="flex items-center gap-4 py-3">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-navy">
                  {i.image_url && <Image src={i.image_url} alt="" fill sizes="80px" className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy">{i.name}</p>
                  <p className="text-xs text-ink/55">
                    {i.type === "curso" ? (i.plan === "mensal" ? "Cobrança mensal" : "Pagamento único") : i.kind === "digital" ? "Arquivo digital" : "Modelo físico"}
                  </p>
                </div>
                {i.type === "produto" && i.kind === "fisico" ? (
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={i.qty}
                    onChange={(e) => cart.setQty(i.key, Number(e.target.value))}
                    className="w-16 rounded-lg border border-navy/15 px-2 py-1 text-sm"
                    aria-label="Quantidade"
                  />
                ) : null}
                <p className="w-24 text-right text-sm font-semibold text-navy">{brl(i.price_cents * i.qty)}</p>
                <button type="button" onClick={() => cart.remove(i.key)} className="text-xs text-red-700 underline">
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* DADOS */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-navy/5">
          <h2 className="mb-4 font-serif text-xl text-navy">Seus dados</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={`${label} sm:col-span-2`}>Nome completo<input name="name" required maxLength={120} autoComplete="name" className={field} /></label>
            <label className={label}>E-mail<input name="email" type="email" required maxLength={160} autoComplete="email" className={field} /></label>
            <label className={label}>WhatsApp<input name="phone" type="tel" required maxLength={40} autoComplete="tel" className={field} /></label>
            <label className={label}>CPF (opcional)<input name="cpf" maxLength={20} inputMode="numeric" className={field} /></label>
          </div>
          {cart.items.some((i) => i.type === "curso") && (
            <p className="mt-4 rounded-lg bg-aqua/10 p-3 text-xs text-navy/80">
              Use o mesmo e-mail para criar seu acesso na Área do Aluno: o curso fica vinculado a ele.
            </p>
          )}
        </section>

        {/* ENTREGA */}
        {cart.hasPhysical && (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-navy/5">
            <h2 className="mb-4 font-serif text-xl text-navy">Entrega dos modelos físicos</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["envio", "Envio pelo correio", `Frete fixo: ${brl(shippingFlatCents)}`],
                  ["retirada", "Retirar no laboratório", "Sem custo · Anápolis - GO"],
                ] as const
              ).map(([v, t, d]) => (
                <label key={v} className={`cursor-pointer rounded-xl border p-4 ${delivery === v ? "border-copper bg-copper/5" : "border-navy/10"}`}>
                  <input type="radio" name="_delivery" value={v} checked={delivery === v} onChange={() => setDelivery(v)} className="mr-2 accent-copper" />
                  <span className="font-semibold text-navy">{t}</span>
                  <span className="mt-1 block text-xs text-ink/60">{d}</span>
                </label>
              ))}
            </div>
            {delivery === "retirada" ? (
              <p className="mt-4 text-sm text-ink/70">{pickupNote}</p>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-6">
                <label className={`${label} sm:col-span-2`}>CEP<input name="cep" required inputMode="numeric" maxLength={9} onBlur={(e) => lookupCep(e.target.value)} className={field} /></label>
                <label className={`${label} sm:col-span-4`}>Rua<input name="street" required maxLength={160} className={field} /></label>
                <label className={`${label} sm:col-span-2`}>Número<input name="number" required maxLength={20} className={field} /></label>
                <label className={`${label} sm:col-span-4`}>Complemento<input name="complement" maxLength={80} className={field} /></label>
                <label className={`${label} sm:col-span-3`}>Bairro<input name="district" required maxLength={80} className={field} /></label>
                <label className={`${label} sm:col-span-2`}>Cidade<input name="city" required maxLength={80} className={field} /></label>
                <label className={`${label} sm:col-span-1`}>UF<input name="state" required maxLength={2} className={field} /></label>
              </div>
            )}
          </section>
        )}
      </div>

      {/* RESUMO */}
      <aside className="h-fit rounded-2xl bg-navy p-6 text-ivory lg:sticky lg:top-24">
        <h2 className="font-serif text-xl">Resumo</h2>
        <dl className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between"><dt className="text-ivory/70">Subtotal</dt><dd>{brl(cart.subtotal)}</dd></div>
          {cart.hasPhysical && (
            <div className="flex justify-between"><dt className="text-ivory/70">Frete</dt><dd>{shipping ? brl(shipping) : "Grátis (retirada)"}</dd></div>
          )}
          <div className="mt-2 flex justify-between border-t border-ivory/15 pt-3 text-lg font-semibold"><dt>Total</dt><dd>{brl(total)}</dd></div>
        </dl>
        {cart.items.some((i) => i.plan === "mensal") && (
          <p className="mt-3 text-xs text-ivory/60">A assinatura é cobrada todo mês. O valor acima é a primeira mensalidade.</p>
        )}
        {state.error && <p className="mt-4 rounded-lg bg-red-500/15 p-3 text-sm text-red-200">{state.error}</p>}
        <button disabled={pending} className="mt-6 w-full rounded-full bg-copper py-3.5 text-xs font-semibold uppercase tracking-wider text-navy disabled:opacity-60">
          {pending ? "Enviando pedido…" : "Finalizar pedido"}
        </button>
        <p className="mt-3 text-center text-[11px] text-ivory/50">Os valores são conferidos no servidor ao finalizar.</p>
        <Link href="/loja" className="mt-4 block text-center text-xs text-ivory/70 underline">Continuar comprando</Link>
      </aside>
    </form>
  );
}
