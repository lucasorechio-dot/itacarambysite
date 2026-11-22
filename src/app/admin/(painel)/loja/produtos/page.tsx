import { requireAdmin } from "@/lib/admin";
import { ItemsEditor } from "../../ItemsEditor";

export const instant = false;

export default async function ProdutosPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("ita_products").select("*").order("position");
  return (
    <>
      <h1 className="font-serif text-3xl text-navy">Loja — Modelos de estudo</h1>
      <p className="mb-6 mt-1 text-sm text-ink/60">
        Modelos físicos (envio ou retirada) e arquivos digitais (download após o pagamento). Os itens com &quot;valor de exemplo&quot; precisam do preço real.
      </p>
      <ItemsEditor kind="products" rows={data ?? []} addLabel="Adicionar modelo" />
    </>
  );
}
