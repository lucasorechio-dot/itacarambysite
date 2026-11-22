import type { Metadata } from "next";
import { supabaseConfigured } from "@/lib/supabase/env";

// O painel depende da sessão do usuário: renderiza sempre no servidor, na hora do acesso.
export const instant = false;

export const metadata: Metadata = {
  title: "Painel — Itacaramby",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  if (!supabaseConfigured) {
    return (
      <main className="grid min-h-screen place-items-center bg-porcelain p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 shadow">
          <h1 className="font-serif text-2xl text-navy">Painel ainda não configurado</h1>
          <p className="mt-3 text-sm text-ink/70">
            Faltam as variáveis <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>.
          </p>
        </div>
      </main>
    );
  }
  return <div className="min-h-screen bg-porcelain text-ink">{children}</div>;
}
