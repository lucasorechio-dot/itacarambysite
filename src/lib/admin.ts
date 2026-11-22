import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

/** Garante que quem está acessando é um administrador. Use em toda página e ação do painel. */
export async function requireAdmin() {
  const supabase = await createSessionClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims) redirect("/admin/login");

  const { data: isAdmin, error } = await supabase.rpc("ita_is_admin");
  if (error || !isAdmin) redirect("/admin/login?erro=sem-permissao");

  return { supabase, email: (claims.email as string | undefined) ?? "" };
}
