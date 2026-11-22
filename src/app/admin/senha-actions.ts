"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

export type FormState = { ok?: boolean; error?: string };

async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "itacaramby.vercel.app";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Envia o e-mail de recuperação. Sempre responde igual, para não revelar quais e-mails existem. */
export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  if (!email.includes("@")) return { error: "Informe um e-mail válido." };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await siteOrigin()}/admin/auth/callback?next=/admin/nova-senha`,
  });
  if (error && /rate|too many|seconds/i.test(error.message)) {
    return { error: "Muitas tentativas. Aguarde alguns minutos e tente de novo." };
  }
  if (error) console.error("Erro ao pedir recuperação de senha:", error.message);
  return { ok: true };
}

/** Define a nova senha do usuário logado (após o link do e-mail ou pelo painel). */
export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 10) return { error: "Use pelo menos 10 caracteres." };
  if (password !== confirm) return { error: "As duas senhas não são iguais." };

  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { error: "O link expirou. Peça um novo em “Esqueci minha senha”." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (/same|different/i.test(error.message)) return { error: "A nova senha precisa ser diferente da anterior." };
    if (/weak|pwned|leaked|strength/i.test(error.message)) return { error: "Senha fraca ou já vazada na internet. Escolha outra." };
    return { error: "Não foi possível trocar a senha. Tente de novo." };
  }
  redirect("/admin?senha=alterada");
}
