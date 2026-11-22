import { requireAdmin } from "@/lib/admin";
import { ItemsEditor } from "../ItemsEditor";

export const instant = false;

export default async function GaleriaPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("ita_gallery").select("*").order("position");
  return (
    <>
      <h1 className="font-serif text-3xl text-navy">Galeria de casos</h1>
      <p className="mb-6 mt-1 text-sm text-ink/60">
        A primeira foto aparece em destaque (maior) e também no topo do site. Fotos de até 8 MB.
      </p>
      <ItemsEditor kind="gallery" rows={data ?? []} addLabel="Adicionar foto" />
    </>
  );
}
