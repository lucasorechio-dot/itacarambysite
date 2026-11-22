"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

/** Campo de imagem: envia a foto direto para o Supabase Storage e guarda o link num input escondido. */
export function ImageField({ name, defaultValue = "", label = "Foto", folder }: { name: string; defaultValue?: string; label?: string; folder: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError("A foto passa de 8 MB. Diminua antes de enviar.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const supabase = createBrowserSupabase();
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("itacaramby").upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      setUrl(supabase.storage.from("itacaramby").getPublicUrl(path).data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar a foto.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-navy/70">{label}</span>
      <div className="flex items-center gap-4">
        <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-lg bg-navy/90 text-[10px] text-ivory/60">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            "sem foto"
          )}
        </div>
        <div className="grid gap-2 text-sm">
          <label className="inline-flex w-fit cursor-pointer rounded-full bg-navy px-4 py-2 text-xs font-semibold text-ivory hover:bg-navy-2">
            {busy ? "Enviando…" : url ? "Trocar foto" : "Escolher foto"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={onFile} disabled={busy} className="hidden" />
          </label>
          {url && (
            <button type="button" onClick={() => setUrl("")} className="w-fit text-xs text-red-700 underline">
              Remover foto
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
      <input type="hidden" name={name} value={url} />
    </div>
  );
}
