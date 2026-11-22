import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { CONTENT_TAG } from "@/lib/content";
import type { Course, Product } from "@/content/site";

/** Produtos e cursos publicados (em cache; atualiza quando o painel salva). */
export async function getStore(): Promise<{ products: Product[]; courses: Course[] }> {
  "use cache";
  cacheTag(CONTENT_TAG);
  if (!supabaseConfigured) {
    cacheLife("max");
    return { products: [], courses: [] };
  }
  const db = createPublicClient();
  const [p, c] = await Promise.all([
    db.from("ita_products").select("id,kind,name,description,price_cents,image_url").eq("published", true).order("position"),
    db
      .from("ita_courses")
      .select("id,slug,title,subtitle,description,image_url,highlights,price_monthly_cents,price_full_cents,access_days")
      .eq("published", true)
      .order("position"),
  ]);
  if (p.error || c.error) {
    console.error("Erro ao ler a loja:", p.error ?? c.error);
    cacheLife("minutes");
    return { products: [], courses: [] };
  }
  cacheLife("max");
  return { products: (p.data ?? []) as Product[], courses: (c.data ?? []) as Course[] };
}
