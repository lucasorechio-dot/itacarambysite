import { requireAdmin } from "@/lib/admin";
import { mergeSettings } from "@/lib/content";
import type { Settings } from "@/content/site";
import { SettingsForm } from "./SettingsForm";

export const instant = false;

export default async function TextosPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("ita_site_settings").select("data").eq("id", 1).maybeSingle();
  const settings = mergeSettings(data?.data as Partial<Settings> | undefined);
  return (
    <>
      <h1 className="font-serif text-3xl text-navy">Textos e contatos</h1>
      <p className="mb-6 mt-1 text-sm text-ink/60">Edite os textos fixos do site e os dados de contato.</p>
      <SettingsForm s={settings} />
    </>
  );
}
