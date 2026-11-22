import { deleteItem, moveItem, saveItem } from "../actions";
import { ImageField } from "@/components/admin/ImageField";
import { ConfirmButton, IconButton, SubmitButton, inputCls, labelCls } from "@/components/admin/ui";

export type Kind = "services" | "gallery" | "partners" | "testimonials";
type Row = Record<string, unknown> & { id: string; published: boolean };

const titleOf = (kind: Kind, r: Row) => String(kind === "testimonials" ? r.name : kind === "partners" ? r.name : r.title);

function Fields({ kind, r }: { kind: Kind; r?: Row }) {
  const v = (k: string) => (r?.[k] as string | undefined) ?? "";
  switch (kind) {
    case "services":
      return (
        <>
          <label className={labelCls}>Nome do serviço<input name="title" required defaultValue={v("title")} className={inputCls} /></label>
          <label className={labelCls}>Descrição curta<input name="text" defaultValue={v("text")} className={inputCls} /></label>
          <label className={`${labelCls} sm:col-span-2`}>
            Itens (um por linha)
            <textarea name="items" rows={4} defaultValue={((r?.items as string[]) ?? []).join("\n")} className={inputCls} />
          </label>
          <ImageField name="image_url" defaultValue={v("image_url")} folder="servicos" />
        </>
      );
    case "gallery":
      return (
        <>
          <label className={labelCls}>Título<input name="title" required defaultValue={v("title")} className={inputCls} /></label>
          <label className={labelCls}>Etiqueta (ex.: Implantes, E.max)<input name="tag" defaultValue={v("tag")} className={inputCls} /></label>
          <ImageField name="image_url" defaultValue={v("image_url")} folder="galeria" />
        </>
      );
    case "partners":
      return (
        <>
          <label className={labelCls}>Nome da clínica / dentista<input name="name" required defaultValue={v("name")} className={inputCls} /></label>
          <ImageField name="logo_url" defaultValue={v("logo_url")} label="Logo (opcional)" folder="parceiros" />
        </>
      );
    case "testimonials":
      return (
        <>
          <label className={labelCls}>Nome<input name="name" required defaultValue={v("name")} className={inputCls} placeholder="Dra. Maria Silva" /></label>
          <label className={labelCls}>Cargo / especialidade<input name="role" defaultValue={v("role")} className={inputCls} placeholder="Implantodontista" /></label>
          <label className={`${labelCls} sm:col-span-2`}>
            Depoimento
            <textarea name="quote" required rows={3} defaultValue={v("quote")} className={inputCls} />
          </label>
        </>
      );
  }
}

function ItemForm({ kind, r }: { kind: Kind; r?: Row }) {
  return (
    <form action={saveItem} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="_table" value={kind} />
      {r && <input type="hidden" name="id" value={r.id} />}
      <Fields kind={kind} r={r} />
      <div className="flex items-center justify-between gap-4 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={r ? r.published : true} className="h-4 w-4 accent-copper" />
          Mostrar no site
        </label>
        <SubmitButton>{r ? "Salvar" : "Adicionar"}</SubmitButton>
      </div>
    </form>
  );
}

export function ItemsEditor({ kind, rows, addLabel }: { kind: Kind; rows: Row[]; addLabel: string }) {
  return (
    <div className="grid gap-4">
      {rows.map((r, i) => (
        <details key={r.id} className="group rounded-2xl bg-white shadow-sm ring-1 ring-navy/5">
          <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
            {typeof (r.image_url ?? r.logo_url) === "string" && (r.image_url || r.logo_url) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={String(r.image_url || r.logo_url)} alt="" className="h-12 w-16 shrink-0 rounded-md bg-navy object-cover" />
            ) : null}
            <span className="flex-1">
              <span className="font-semibold text-navy">{titleOf(kind, r)}</span>
              {!r.published && <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 text-[10px] uppercase">oculto</span>}
            </span>
            <span className="text-xs text-aqua group-open:hidden">Editar</span>
          </summary>
          <div className="grid gap-4 border-t border-navy/10 p-4">
            <ItemForm kind={kind} r={r} />
            <div className="flex items-center gap-2 border-t border-navy/10 pt-3">
              <form action={moveItem}>
                <input type="hidden" name="_table" value={kind} />
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="dir" value="up" />
                {i > 0 && <IconButton title="Subir">↑</IconButton>}
              </form>
              <form action={moveItem}>
                <input type="hidden" name="_table" value={kind} />
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="dir" value="down" />
                {i < rows.length - 1 && <IconButton title="Descer">↓</IconButton>}
              </form>
              <form action={deleteItem} className="ml-auto">
                <input type="hidden" name="_table" value={kind} />
                <input type="hidden" name="id" value={r.id} />
                <ConfirmButton message="Apagar este item? Não dá para desfazer." className="text-xs text-red-700 underline">
                  Apagar
                </ConfirmButton>
              </form>
            </div>
          </div>
        </details>
      ))}
      {rows.length === 0 && <p className="rounded-2xl bg-white p-6 text-sm text-ink/60">Nada cadastrado ainda.</p>}

      <details className="rounded-2xl border-2 border-dashed border-copper/50 bg-white/60">
        <summary className="cursor-pointer list-none p-4 font-semibold text-copper">+ {addLabel}</summary>
        <div className="border-t border-navy/10 p-4">
          <ItemForm kind={kind} />
        </div>
      </details>
    </div>
  );
}
