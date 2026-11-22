"use client";

import { useActionState } from "react";
import { saveSettings, type SettingsState } from "../../actions";
import { ImageField } from "@/components/admin/ImageField";
import { inputCls, labelCls } from "@/components/admin/ui";
import type { Settings } from "@/content/site";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-navy/5">
      <h2 className="mb-4 font-serif text-xl text-navy">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function SettingsForm({ s }: { s: Settings }) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(saveSettings, {});
  const full = `${labelCls} sm:col-span-2`;

  return (
    <form action={action} className="grid gap-6">
      <Card title="Contato">
        <label className={labelCls}>
          WhatsApp (só números, com 55 + DDD)
          <input name="whatsapp" required defaultValue={s.contact.whatsapp} className={inputCls} inputMode="numeric" />
        </label>
        <label className={labelCls}>
          WhatsApp como aparece no site
          <input name="whatsappLabel" defaultValue={s.contact.whatsappLabel} className={inputCls} />
        </label>
        <label className={labelCls}>E-mail<input name="email" type="email" defaultValue={s.contact.email} className={inputCls} /></label>
        <label className={labelCls}>Instagram (sem @)<input name="instagram" defaultValue={s.contact.instagram} className={inputCls} placeholder="itacaramby" /></label>
        <label className={full}>Endereço<input name="address" defaultValue={s.contact.address} className={inputCls} /></label>
        <label className={labelCls}>Registro<input name="cro" defaultValue={s.cro} className={inputCls} /></label>
        <label className={labelCls}>Cidade<input name="city" defaultValue={s.city} className={inputCls} /></label>
      </Card>

      <Card title="Topo do site">
        <label className={full}>Frase pequena (acima do título)<input name="hero_eyebrow" defaultValue={s.hero.eyebrow} className={inputCls} /></label>
        <label className={labelCls}>Título — linha 1<input name="hero_title1" defaultValue={s.hero.title1} className={inputCls} /></label>
        <label className={labelCls}>Título — linha 2 (em destaque)<input name="hero_title2" defaultValue={s.hero.title2} className={inputCls} /></label>
        <label className={full}>Texto<textarea name="hero_text" rows={3} defaultValue={s.hero.text} className={inputCls} /></label>
      </Card>

      <Card title="Sobre o laboratório">
        <label className={full}>Título<input name="about_title" defaultValue={s.about.title} className={inputCls} /></label>
        <label className={full}>
          Texto (deixe uma linha em branco entre parágrafos)
          <textarea name="about_text" rows={7} defaultValue={s.about.paragraphs.join("\n\n")} className={inputCls} />
        </label>
        {[0, 1, 2].map((i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr] gap-2 sm:col-span-2">
            <label className={labelCls}>Número {i + 1}<input name={`stat_value_${i}`} defaultValue={s.about.stats[i]?.value ?? ""} className={inputCls} /></label>
            <label className={labelCls}>Legenda {i + 1}<input name={`stat_label_${i}`} defaultValue={s.about.stats[i]?.label ?? ""} className={inputCls} /></label>
          </div>
        ))}
      </Card>

      <Card title="Responsável técnico">
        <label className={labelCls}>Nome<input name="owner_name" defaultValue={s.owner.name} className={inputCls} /></label>
        <label className={labelCls}>Cargo<input name="owner_role" defaultValue={s.owner.role} className={inputCls} /></label>
        <ImageField name="owner_photo" defaultValue={s.owner.photo} folder="equipe" />
      </Card>

      <Card title="Prazos de produção">
        <label className={full}>
          Um por linha, no formato: serviço | prazo
          <textarea
            name="leadTimes"
            rows={9}
            defaultValue={s.leadTimes.map((l) => `${l.item} | ${l.days}`).join("\n")}
            className={`${inputCls} font-mono`}
          />
        </label>
      </Card>

      <Card title="Loja — entrega dos modelos físicos">
        <label className={labelCls}>
          Frete fixo para envio (R$)
          <input name="shipping_flat" inputMode="decimal" defaultValue={(s.store.shippingFlatCents / 100).toFixed(2).replace(".", ",")} className={inputCls} />
        </label>
        <label className={full}>
          Instruções de retirada no laboratório
          <textarea name="pickup_note" rows={2} defaultValue={s.store.pickupNote} className={inputCls} />
        </label>
      </Card>

      <Card title="Versículo do rodapé">
        <label className={full}>Texto<textarea name="verse_text" rows={2} defaultValue={s.verse.text} className={inputCls} /></label>
        <label className={labelCls}>Referência<input name="verse_ref" defaultValue={s.verse.ref} className={inputCls} /></label>
      </Card>

      <div className="sticky bottom-4 flex items-center justify-end gap-4 rounded-2xl bg-navy/95 p-4 shadow-lg">
        {state.error && <p className="mr-auto text-sm text-red-300">{state.error}</p>}
        {state.ok && !pending && <p className="mr-auto text-sm text-green-300">Salvo! Já está no site.</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-copper px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-navy disabled:opacity-60"
        >
          {pending ? "Salvando…" : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}
