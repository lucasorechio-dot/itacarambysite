import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSessionClient } from "@/lib/supabase/server";

// Recebe o link do e-mail de recuperação, abre a sessão e leva para a tela de nova senha.
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const nextParam = url.searchParams.get("next") ?? "/admin/nova-senha";
  // Só permite voltar para páginas do próprio painel.
  const next = nextParam.startsWith("/admin") && !nextParam.startsWith("//") ? nextParam : "/admin/nova-senha";

  const supabase = await createSessionClient();
  let ok = false;
  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  }

  const dest = request.nextUrl.clone();
  dest.search = "";
  dest.pathname = ok ? next : "/admin/recuperar";
  if (!ok) dest.searchParams.set("erro", "link");
  return NextResponse.redirect(dest);
}
