import { requireAdmin } from "@/lib/admin";
import { ItemsEditor } from "../ItemsEditor";

export const instant = false;

export default async function ParceirosPage() {
  const { supabase } = await requireAdmin();
  const [partners, testimonials] = await Promise.all([
    supabase.from("ita_partners").select("*").order("position"),
    supabase.from("ita_testimonials").select("*").order("position"),
  ]);
  return (
    <>
      <h1 className="font-serif text-3xl text-navy">Parceiros e depoimentos</h1>
      <p className="mb-6 mt-1 text-sm text-ink/60">
        Só publique nomes, logos e depoimentos com autorização dos dentistas.
      </p>

      <h2 className="mb-3 mt-8 font-serif text-xl text-navy">Clínicas parceiras</h2>
      <ItemsEditor kind="partners" rows={partners.data ?? []} addLabel="Adicionar parceiro" />

      <h2 className="mb-3 mt-12 font-serif text-xl text-navy">Depoimentos</h2>
      <ItemsEditor kind="testimonials" rows={testimonials.data ?? []} addLabel="Adicionar depoimento" />
    </>
  );
}
