import { requireAdmin } from "@/lib/admin";
import { deleteMessage, setMessageRead } from "../../actions";
import { ConfirmButton } from "@/components/admin/ui";
import { whatsappLink } from "@/content/site";

export const instant = false;

const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });

export default async function MensagensPage() {
  const { supabase } = await requireAdmin();
  const { data: messages } = await supabase.from("ita_messages").select("*").order("created_at", { ascending: false }).limit(200);

  return (
    <>
      <h1 className="font-serif text-3xl text-navy">Mensagens</h1>
      <p className="mb-6 mt-1 text-sm text-ink/60">Contatos enviados pelo formulário do site.</p>

      {!messages?.length && <p className="rounded-2xl bg-white p-6 text-sm text-ink/60">Nenhuma mensagem ainda.</p>}

      <div className="grid gap-4">
        {messages?.map((m) => {
          const phoneDigits = String(m.phone).replace(/\D/g, "");
          return (
            <article key={m.id} className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ${m.read ? "ring-navy/5 opacity-75" : "ring-copper/60"}`}>
              <header className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="font-semibold text-navy">
                    {!m.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-copper" />}
                    {m.name}
                    {m.clinic && <span className="font-normal text-ink/60"> · {m.clinic}</span>}
                  </p>
                  <p className="text-xs text-ink/55">
                    {m.subject}
                    {m.phone && <> · {m.phone}</>}
                  </p>
                </div>
                <time className="text-xs text-ink/50">{fmt.format(new Date(m.created_at))}</time>
              </header>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink/85">{m.message}</p>
              <footer className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                {phoneDigits.length >= 10 && (
                  <a
                    href={whatsappLink(phoneDigits.length <= 11 ? `55${phoneDigits}` : phoneDigits, `Olá, ${m.name}! Aqui é do laboratório Itacaramby.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#25d366] px-3 py-1.5 font-semibold text-white"
                  >
                    Responder no WhatsApp
                  </a>
                )}
                <form action={setMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="read" value={String(!m.read)} />
                  <button className="underline">{m.read ? "Marcar como não lida" : "Marcar como lida"}</button>
                </form>
                <form action={deleteMessage} className="ml-auto">
                  <input type="hidden" name="id" value={m.id} />
                  <ConfirmButton message="Apagar esta mensagem?" className="text-red-700 underline">Apagar</ConfirmButton>
                </form>
              </footer>
            </article>
          );
        })}
      </div>
    </>
  );
}
