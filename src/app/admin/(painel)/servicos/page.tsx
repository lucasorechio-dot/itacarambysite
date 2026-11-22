import { requireAdmin } from "@/lib/admin";
import { ItemsEditor } from "../ItemsEditor";

export const instant = false;

export default async function ServicosPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("ita_services").select("*").order("position");
  return (
    <>
      <h1 className="font-serif text-3xl text-navy">Serviços</h1>
      <p className="mb-6 mt-1 text-sm text-ink/60">Os cartões da seção &quot;Serviços&quot;. Use as setas para mudar a ordem.</p>
      <ItemsEditor kind="services" rows={data ?? []} addLabel="Adicionar serviço" />
    </>
  );
}
