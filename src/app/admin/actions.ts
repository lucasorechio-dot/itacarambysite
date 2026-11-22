"use server";

import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { CONTENT_TAG } from "@/lib/content";
import { createSessionClient } from "@/lib/supabase/server";
import type { Settings } from "@/content/site";

type Table = "services" | "gallery" | "partners" | "testimonials";
const TABLES: Table[] = ["services", "gallery", "partners", "testimonials"];

const str = (f: FormData, k: string, max = 2000) => String(f.get(k) ?? "").trim().slice(0, max);
const lines = (f: FormData, k: string) =>
  str(f, k, 8000)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

function table(f: FormData): Table {
  const t = str(f, "_table") as Table;
  if (!TABLES.includes(t)) throw new Error("Tabela inválida");
  return t;
}

function done() {
  updateTag(CONTENT_TAG);
  refresh();
}

// ---------- LOGIN ----------
export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = str(formData, "email", 200);
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Informe e-mail e senha." };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "E-mail ou senha incorretos." };

  const { data: isAdmin } = await supabase.rpc("ita_is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "Este usuário não tem acesso ao painel." };
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- ITENS (serviços, galeria, parceiros, depoimentos) ----------
function rowFromForm(t: Table, f: FormData) {
  const published = f.get("published") === "on";
  switch (t) {
    case "services":
      return { title: str(f, "title", 120), text: str(f, "text", 400), items: lines(f, "items"), image_url: str(f, "image_url", 600), published };
    case "gallery":
      return { title: str(f, "title", 120), tag: str(f, "tag", 40), image_url: str(f, "image_url", 600), published };
    case "partners":
      return { name: str(f, "name", 120), logo_url: str(f, "logo_url", 600), published };
    case "testimonials":
      return { quote: str(f, "quote", 800), name: str(f, "name", 120), role: str(f, "role", 120), published };
  }
}

export async function saveItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const t = table(formData);
  const id = str(formData, "id", 64);
  const row = rowFromForm(t, formData);
  if (t === "gallery" && !("image_url" in row && row.image_url)) throw new Error("Escolha uma foto para a galeria.");

  if (id) {
    const { error } = await supabase.from(`ita_${t}`).update(row).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data: last } = await supabase.from(`ita_${t}`).select("position").order("position", { ascending: false }).limit(1).maybeSingle();
    const { error } = await supabase.from(`ita_${t}`).insert({ ...row, position: (last?.position ?? 0) + 1 });
    if (error) throw new Error(error.message);
  }
  done();
}

export async function deleteItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const t = table(formData);
  const id = str(formData, "id", 64);
  const { error } = await supabase.from(`ita_${t}`).delete().eq("id", id);
  if (error) throw new Error(error.message);
  done();
}

export async function moveItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const t = table(formData);
  const id = str(formData, "id", 64);
  const dir = str(formData, "dir", 4) === "up" ? -1 : 1;

  const { data: rows, error } = await supabase.from(`ita_${t}`).select("id,position").order("position", { ascending: true });
  if (error || !rows) throw new Error(error?.message ?? "Erro ao ordenar");
  const i = rows.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= rows.length) return;

  // Renumera tudo em sequência, trocando os dois de lugar.
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await Promise.all(rows.map((r, idx) => supabase.from(`ita_${t}`).update({ position: idx + 1 }).eq("id", r.id)));
  done();
}

// ---------- MENSAGENS ----------
export async function setMessageRead(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id", 64);
  const read = str(formData, "read", 5) === "true";
  const { error } = await supabase.from("ita_messages").update({ read }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteMessage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("ita_messages").delete().eq("id", str(formData, "id", 64));
  if (error) throw new Error(error.message);
  refresh();
}

// ---------- TEXTOS E CONTATOS ----------
export type SettingsState = { ok?: boolean; error?: string };

export async function saveSettings(_prev: SettingsState, f: FormData): Promise<SettingsState> {
  const { supabase } = await requireAdmin();

  const stats = [0, 1, 2]
    .map((i) => ({ value: str(f, `stat_value_${i}`, 40), label: str(f, `stat_label_${i}`, 80) }))
    .filter((s) => s.value);

  const leadTimes = lines(f, "leadTimes").map((l) => {
    const [item, ...rest] = l.split("|");
    return { item: item.trim(), days: rest.join("|").trim() };
  });

  const data: Settings = {
    cro: str(f, "cro", 40),
    city: str(f, "city", 80),
    hero: { eyebrow: str(f, "hero_eyebrow", 120), title1: str(f, "hero_title1", 120), title2: str(f, "hero_title2", 120), text: str(f, "hero_text", 600) },
    about: {
      title: str(f, "about_title", 160),
      paragraphs: str(f, "about_text", 4000).split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean),
      stats,
    },
    owner: { name: str(f, "owner_name", 120), role: str(f, "owner_role", 160), photo: str(f, "owner_photo", 600) },
    contact: {
      whatsapp: str(f, "whatsapp", 20).replace(/\D/g, ""),
      whatsappLabel: str(f, "whatsappLabel", 40),
      email: str(f, "email", 160),
      instagram: str(f, "instagram", 60).replace(/^@/, ""),
      address: str(f, "address", 300),
    },
    leadTimes,
    verse: { text: str(f, "verse_text", 400), ref: str(f, "verse_ref", 60) },
  };

  if (data.contact.whatsapp.length < 10) return { error: "WhatsApp inválido: use só números com DDI e DDD (ex.: 5562984490810)." };

  const { error } = await supabase.from("ita_site_settings").upsert({ id: 1, data, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };
  done();
  return { ok: true };
}
