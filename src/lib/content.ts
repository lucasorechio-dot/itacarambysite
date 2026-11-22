import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { defaultContent, defaultSettings, type Settings, type SiteContent } from "@/content/site";

export const CONTENT_TAG = "site-content";

/** Junta o que veio do banco com o padrão, para nunca faltar campo. */
function mergeSettings(data: Partial<Settings> | null | undefined): Settings {
  const d = data ?? {};
  return {
    ...defaultSettings,
    ...d,
    hero: { ...defaultSettings.hero, ...d.hero },
    about: { ...defaultSettings.about, ...d.about },
    owner: { ...defaultSettings.owner, ...d.owner },
    contact: { ...defaultSettings.contact, ...d.contact },
    verse: { ...defaultSettings.verse, ...d.verse },
    leadTimes: d.leadTimes ?? defaultSettings.leadTimes,
  };
}

/** Conteúdo público do site. Fica em cache e é atualizado quando o painel salva algo. */
export async function getContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);

  if (!supabaseConfigured) {
    cacheLife("max");
    return defaultContent;
  }

  try {
    const db = createPublicClient();
    const order = { ascending: true } as const;
    const [settings, services, gallery, partners, testimonials] = await Promise.all([
      db.from("ita_site_settings").select("data").eq("id", 1).maybeSingle(),
      db.from("ita_services").select("id,title,text,items,image_url").eq("published", true).order("position", order),
      db.from("ita_gallery").select("id,title,tag,image_url").eq("published", true).order("position", order),
      db.from("ita_partners").select("id,name,logo_url").eq("published", true).order("position", order),
      db.from("ita_testimonials").select("id,quote,name,role").eq("published", true).order("position", order),
    ]);
    const err = settings.error ?? services.error ?? gallery.error ?? partners.error ?? testimonials.error;
    if (err) throw err;

    cacheLife("max");
    return {
      settings: mergeSettings(settings.data?.data as Partial<Settings> | undefined),
      services: services.data ?? [],
      gallery: gallery.data ?? [],
      partners: partners.data ?? [],
      testimonials: testimonials.data ?? [],
    };
  } catch (e) {
    console.error("Falha ao ler conteúdo do Supabase, usando o padrão:", e);
    // Erro temporário: guarda o padrão só por pouco tempo e tenta o banco de novo depois.
    cacheLife("minutes");
    return defaultContent;
  }
}

export { mergeSettings };
