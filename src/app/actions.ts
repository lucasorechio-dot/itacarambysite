"use server";

import { createPublicClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export type ContactState = { status: "idle" | "ok" | "error"; message?: string; whatsappText?: string };

const clip = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Campo escondido: robôs preenchem, pessoas não.
  if (clip(formData.get("website"), 200)) return { status: "ok" };

  const name = clip(formData.get("nome"), 120);
  const clinic = clip(formData.get("clinica"), 160);
  const phone = clip(formData.get("telefone"), 40);
  const subject = clip(formData.get("assunto"), 80);
  const message = clip(formData.get("mensagem"), 4000);

  if (!name || !message) return { status: "error", message: "Preencha seu nome e a mensagem." };

  const whatsappText = [
    `Olá! Sou ${name}${clinic ? ` (${clinic})` : ""}.`,
    subject ? `Assunto: ${subject}` : "",
    message,
    phone ? `Telefone: ${phone}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (supabaseConfigured) {
    const { error } = await createPublicClient()
      .from("ita_messages")
      .insert({ name, clinic, phone, subject, message });
    if (error) {
      console.error("Erro ao salvar mensagem:", error);
      return { status: "error", message: "Não conseguimos enviar agora. Tente pelo WhatsApp.", whatsappText };
    }
  }

  return { status: "ok", whatsappText };
}
