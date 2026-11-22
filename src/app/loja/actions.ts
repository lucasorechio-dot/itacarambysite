"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export type CheckoutState = { error?: string };

const s = (f: FormData, k: string, max = 200) => String(f.get(k) ?? "").trim().slice(0, max);

export async function createOrder(_prev: CheckoutState, f: FormData): Promise<CheckoutState> {
  if (!supabaseConfigured) return { error: "Loja indisponível no momento." };

  let items: unknown;
  try {
    items = JSON.parse(String(f.get("items") ?? "[]"));
  } catch {
    return { error: "Carrinho inválido." };
  }
  if (!Array.isArray(items) || items.length === 0) return { error: "Seu carrinho está vazio." };

  const payload = {
    name: s(f, "name", 120),
    email: s(f, "email", 160),
    phone: s(f, "phone", 40),
    cpf: s(f, "cpf", 20),
    delivery: s(f, "delivery", 20) || "nenhuma",
    address: {
      cep: s(f, "cep", 12),
      street: s(f, "street", 160),
      number: s(f, "number", 20),
      complement: s(f, "complement", 80),
      district: s(f, "district", 80),
      city: s(f, "city", 80),
      state: s(f, "state", 2).toUpperCase(),
    },
    items: items.slice(0, 30).map((i: { type?: string; id?: string; plan?: string; qty?: number }) => ({
      type: i.type,
      id: i.id,
      plan: i.plan,
      qty: i.qty,
    })),
  };

  if (!payload.email.includes("@")) return { error: "Informe um e-mail válido." };

  const supabase = await createSessionClient();
  const { data, error } = await supabase.rpc("ita_create_order", { payload });
  if (error || !data) {
    const msg = error?.message ?? "";
    // mensagens de validação vêm do banco em português
    return { error: /[áéíóúçãõ]|Preencha|Informe|Escolha|Carrinho|indisponível/i.test(msg) ? msg : "Não foi possível criar o pedido. Tente novamente." };
  }
  const order = data as { id: string; token: string };
  redirect(`/loja/pedido/${order.id}?t=${order.token}&novo=1`);
}
