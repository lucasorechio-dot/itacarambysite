import { requireAdmin } from "@/lib/admin";
import { updateOrder } from "../../../actions";
import { SubmitButton, inputCls } from "@/components/admin/ui";
import { brl, whatsappLink } from "@/content/site";

export const instant = false;

const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });
const STATUS = [
  ["pendente", "Aguardando pagamento"],
  ["pago", "Pago"],
  ["enviado", "Enviado"],
  ["entregue", "Entregue"],
  ["cancelado", "Cancelado"],
] as const;
const COLOR: Record<string, string> = {
  pendente: "bg-amber-100 text-amber-900",
  pago: "bg-green-100 text-green-900",
  enviado: "bg-sky-100 text-sky-900",
  entregue: "bg-green-100 text-green-900",
  cancelado: "bg-red-100 text-red-900",
};

type Item = { name: string; quantity: number; unit_price_cents: number; item_type: string; kind: string | null };
type Order = {
  id: string; number: number; created_at: string; status: string; customer_name: string; customer_email: string;
  customer_phone: string; customer_cpf: string; delivery: string; address: Record<string, string> | null;
  total_cents: number; shipping_cents: number; admin_notes: string; ita_order_items: Item[];
};

export default async function PedidosPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("ita_orders")
    .select("*, ita_order_items(name,quantity,unit_price_cents,item_type,kind)")
    .order("created_at", { ascending: false })
    .limit(200);
  const orders = (data ?? []) as Order[];

  return (
    <>
      <h1 className="font-serif text-3xl text-navy">Loja — Pedidos</h1>
      <p className="mb-6 mt-1 text-sm text-ink/60">
        Enquanto o pagamento online não está ativo, confirme o pagamento pelo WhatsApp e marque o pedido como <strong>Pago</strong>.
      </p>
      {!orders.length && <p className="rounded-2xl bg-white p-6 text-sm text-ink/60">Nenhum pedido ainda.</p>}
      <div className="grid gap-4">
        {orders.map((o) => {
          const phone = o.customer_phone.replace(/\D/g, "");
          return (
            <article key={o.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-navy/5">
              <header className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-navy">
                  Pedido nº {o.number} · {brl(o.total_cents)}
                  <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs ${COLOR[o.status]}`}>{STATUS.find((s) => s[0] === o.status)?.[1]}</span>
                </p>
                <time className="text-xs text-ink/50">{fmt.format(new Date(o.created_at))}</time>
              </header>
              <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="font-semibold">{o.customer_name}</p>
                  <p className="text-ink/65">{o.customer_email} · {o.customer_phone}{o.customer_cpf && ` · CPF ${o.customer_cpf}`}</p>
                  <p className="mt-2 text-ink/65">
                    {o.delivery === "envio" && o.address
                      ? `📦 Envio: ${o.address.street}, ${o.address.number} ${o.address.complement ?? ""} — ${o.address.district}, ${o.address.city}/${o.address.state} · CEP ${o.address.cep} (frete ${brl(o.shipping_cents)})`
                      : o.delivery === "retirada"
                        ? "🏠 Retirada no laboratório"
                        : "💻 Sem entrega física"}
                  </p>
                </div>
                <ul className="text-ink/80">
                  {o.ita_order_items.map((i, k) => (
                    <li key={k}>
                      {i.quantity > 1 && `${i.quantity}× `}
                      {i.name} — {brl(i.unit_price_cents * i.quantity)}
                    </li>
                  ))}
                </ul>
              </div>
              <form action={updateOrder} className="mt-4 flex flex-wrap items-end gap-3 border-t border-navy/10 pt-4">
                <input type="hidden" name="id" value={o.id} />
                <label className="grid gap-1 text-xs font-semibold text-navy/70">
                  Situação
                  <select name="status" defaultValue={o.status} className={inputCls}>
                    {STATUS.map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </label>
                <label className="grid flex-1 gap-1 text-xs font-semibold text-navy/70">
                  Observações internas
                  <input name="admin_notes" defaultValue={o.admin_notes} placeholder="ex.: Pix recebido 21/11, código de rastreio…" className={inputCls} />
                </label>
                <SubmitButton>Salvar</SubmitButton>
                {phone.length >= 10 && (
                  <a
                    href={whatsappLink(phone.length <= 11 ? `55${phone}` : phone, `Olá, ${o.customer_name.split(" ")[0]}! Aqui é do laboratório Itacaramby, sobre o seu pedido nº ${o.number}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#25d366] px-4 py-2 text-xs font-semibold text-white"
                  >
                    WhatsApp do cliente
                  </a>
                )}
              </form>
            </article>
          );
        })}
      </div>
    </>
  );
}
