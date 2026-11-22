import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export const instant = false;

export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  const { senha } = await searchParams;
  const { supabase } = await requireAdmin();
  const count = (t: string) => supabase.from(`ita_${t}`).select("id", { count: "exact", head: true });
  const [unread, services, gallery, partners, testimonials] = await Promise.all([
    count("messages").eq("read", false),
    count("services"),
    count("gallery"),
    count("partners"),
    count("testimonials"),
  ]);

  const cards = [
    { href: "/admin/mensagens", label: "Mensagens não lidas", n: unread.count ?? 0, hl: (unread.count ?? 0) > 0 },
    { href: "/admin/servicos", label: "Serviços", n: services.count ?? 0 },
    { href: "/admin/galeria", label: "Fotos na galeria", n: gallery.count ?? 0 },
    { href: "/admin/parceiros", label: "Parceiros", n: partners.count ?? 0 },
    { href: "/admin/parceiros", label: "Depoimentos", n: testimonials.count ?? 0 },
  ];

  return (
    <>
      {senha === "alterada" && (
        <p className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-900">Senha alterada com sucesso.</p>
      )}
      <h1 className="font-serif text-3xl text-navy">Olá! 👋</h1>
      <p className="mt-1 text-sm text-ink/60">Tudo o que você salvar aqui aparece no site na hora.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-2xl bg-white p-6 shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow ${c.hl ? "ring-copper" : "ring-navy/5"}`}
          >
            <p className="font-serif text-4xl text-navy">{c.n}</p>
            <p className="mt-1 text-sm text-ink/60">{c.label}</p>
          </Link>
        ))}
        <Link href="/admin/textos" className="rounded-2xl bg-navy p-6 text-ivory shadow-sm transition hover:-translate-y-0.5">
          <p className="font-serif text-xl">Textos e contatos</p>
          <p className="mt-1 text-sm text-ivory/60">WhatsApp, endereço, sobre, prazos…</p>
        </Link>
      </div>
    </>
  );
}
