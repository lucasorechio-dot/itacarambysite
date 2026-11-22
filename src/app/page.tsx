import Image from "next/image";
import { Header } from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";
import { LogoFull, LogoMark } from "@/components/Logo";
import { getContent } from "@/lib/content";
import { SITE_NAME, SITE_TAGLINE, mapsLink, steps, whatsappLink } from "@/content/site";

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] ${light ? "text-copper" : "text-aqua"}`}>
      {children}
    </p>
  );
}

const btnPrimary =
  "rounded-full bg-copper px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-navy transition hover:bg-ivory";

export default async function Home() {
  const { settings, services, gallery, partners, testimonials } = await getContent();
  const { contact, hero, about, owner } = settings;
  const wa = (msg?: string) => whatsappLink(contact.whatsapp, msg);
  const askTable = wa("Olá! Gostaria de receber a lista de serviços e valores do laboratório.");
  const heroImage = gallery[0]?.image_url || "/img/coroas-implante.png";

  return (
    <>
      <Header whatsapp={contact.whatsapp} />

      <main className="flex-1">
        {/* HERO */}
        <section id="inicio" className="relative overflow-hidden bg-navy text-ivory">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-aqua/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-48 -left-32 h-[420px] w-[420px] rounded-full bg-copper/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-36 lg:grid-cols-[1.15fr_1fr] lg:pb-32 lg:pt-44">
            <div>
              <Eyebrow light>{hero.eyebrow}</Eyebrow>
              <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                {hero.title1}
                <br />
                <span className="italic text-copper">{hero.title2}</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/75 sm:text-lg">{hero.text}</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <a href={wa("Olá! Gostaria de enviar um caso para o laboratório.")} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                  Enviar um caso
                </a>
                <a
                  href={askTable}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-ivory/30 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] transition hover:border-copper hover:text-copper"
                >
                  Solicitar tabela
                </a>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ivory/70">
                {settings.cro && <li>✓ {settings.cro}</li>}
                <li>✓ Prazos a partir de 5 dias úteis</li>
                {settings.city && <li>✓ {settings.city}</li>}
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-3 rounded-[2rem] border border-copper/40" />
              <Image
                src={heroImage}
                alt="Trabalho feito pelo laboratório"
                width={1074}
                height={577}
                preload
                className="relative aspect-[4/3] w-full rounded-[1.6rem] object-cover shadow-2xl"
              />
              <span className="absolute -left-3 top-8 rounded-full bg-ivory px-4 py-2 text-xs font-semibold text-navy shadow-lg">
                E.max & Rosetta
              </span>
              <span className="absolute -right-3 bottom-10 rounded-full bg-copper px-4 py-2 text-xs font-semibold text-navy shadow-lg">
                Protocolos
              </span>
            </div>
          </div>
        </section>

        {/* SOBRE */}
        <section id="sobre" className="bg-ivory py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <Eyebrow>O laboratório</Eyebrow>
              <h2 className="font-serif text-3xl text-navy sm:text-4xl">{about.title}</h2>
              {about.paragraphs.map((p, i) => (
                <p key={i} className="mt-5 leading-relaxed text-ink/75">
                  {p}
                </p>
              ))}
              {about.stats.length > 0 && (
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {about.stats.map((s, i) => (
                    <div key={i} className="rounded-2xl border border-navy/10 bg-porcelain px-5 py-5">
                      <p className="font-serif text-2xl text-navy">{s.value}</p>
                      <p className="mt-1 text-xs text-ink/65">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {owner.photo && (
              <figure className="relative mx-auto w-full max-w-sm">
                <div className="absolute -inset-3 translate-x-4 translate-y-4 rounded-[2rem] bg-copper/20" />
                <Image
                  src={owner.photo}
                  alt={owner.name}
                  width={486}
                  height={606}
                  sizes="(min-width:1024px) 384px, 90vw"
                  className="relative aspect-[486/606] w-full rounded-[1.6rem] object-cover shadow-xl"
                />
                <figcaption className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-navy px-5 py-4 text-ivory shadow-lg">
                  <p className="font-serif text-lg">{owner.name}</p>
                  <p className="text-xs text-ivory/65">{owner.role}</p>
                </figcaption>
              </figure>
            )}
          </div>
        </section>

        {/* SERVIÇOS */}
        <section id="servicos" className="bg-porcelain py-24">
          <div className="mx-auto max-w-6xl px-5">
            <Eyebrow>Serviços</Eyebrow>
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <h2 className="max-w-2xl font-serif text-3xl text-navy sm:text-4xl">Próteses para cada etapa do tratamento.</h2>
              <a
                href={askTable}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-navy underline decoration-copper decoration-2 underline-offset-4 hover:text-copper"
              >
                Fale conosco e solicite a sua lista de valores →
              </a>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s) => (
                <article
                  key={s.id}
                  className="flex flex-col overflow-hidden rounded-2xl bg-ivory shadow-sm ring-1 ring-navy/5 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative grid aspect-[16/10] place-items-center bg-navy">
                    {s.image_url ? (
                      <Image src={s.image_url} alt={s.title} fill sizes="(min-width:1024px) 280px, (min-width:640px) 45vw, 90vw" className="object-cover" />
                    ) : (
                      <LogoMark className="w-24 text-copper" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-lg text-navy">{s.title}</h3>
                    {s.text && <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.text}</p>}
                    <ul className="mt-4 space-y-1.5 text-sm text-ink/80">
                      {s.items.map((it, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            {/* PRAZOS + COMO FUNCIONA */}
            <div className="mt-20 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-3xl bg-navy p-8 text-ivory sm:p-10">
                <Eyebrow light>Como funciona</Eyebrow>
                <h3 className="font-serif text-2xl sm:text-3xl">Do seu consultório até a entrega.</h3>
                <ol className="mt-10 grid gap-8 sm:grid-cols-2">
                  {steps.map((s, i) => (
                    <li key={s.title}>
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-copper/60 font-serif text-copper">
                        {i + 1}
                      </span>
                      <p className="mt-4 font-semibold">{s.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ivory/65">{s.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
              {settings.leadTimes.length > 0 && (
                <div className="rounded-3xl bg-ivory p-8 ring-1 ring-navy/10 sm:p-10">
                  <Eyebrow>Tempo de produção</Eyebrow>
                  <h3 className="font-serif text-2xl text-navy">Prazos de entrega.</h3>
                  <dl className="mt-6 divide-y divide-navy/10 text-sm">
                    {settings.leadTimes.map((l, i) => (
                      <div key={i} className="flex items-center justify-between gap-4 py-3">
                        <dt className="text-ink/75">{l.item}</dt>
                        <dd className="shrink-0 font-semibold text-navy">{l.days}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* GALERIA */}
        {gallery.length > 0 && (
          <section id="galeria" className="bg-ivory py-24">
            <div className="mx-auto max-w-6xl px-5">
              <Eyebrow>Galeria de casos</Eyebrow>
              <h2 className="max-w-2xl font-serif text-3xl text-navy sm:text-4xl">Trabalhos que saíram da nossa bancada.</h2>
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((g, i) => (
                  <figure
                    key={g.id}
                    className={`group relative overflow-hidden rounded-2xl bg-black ${i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}`}
                  >
                    <Image
                      src={g.image_url}
                      alt={g.title}
                      width={900}
                      height={506}
                      sizes={i === 0 ? "(min-width:1024px) 760px, 90vw" : "(min-width:1024px) 380px, 90vw"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/95 to-transparent p-5 text-ivory">
                      {g.tag && (
                        <span className="rounded-full bg-copper px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-navy">
                          {g.tag}
                        </span>
                      )}
                      <p className="mt-2 font-serif text-lg">{g.title}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PARCEIROS */}
        <section id="parceiros" className="bg-porcelain py-24">
          <div className="mx-auto max-w-6xl px-5">
            <Eyebrow>Parceiros</Eyebrow>
            <h2 className="max-w-2xl font-serif text-3xl text-navy sm:text-4xl">Dentistas que confiam no nosso trabalho.</h2>
            {partners.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {partners.map((p) => (
                  <div
                    key={p.id}
                    className="relative grid h-24 place-items-center rounded-xl border border-navy/10 bg-ivory px-4 text-center text-xs font-semibold uppercase tracking-wider text-navy/60"
                  >
                    {p.logo_url ? (
                      <Image src={p.logo_url} alt={p.name} fill sizes="200px" className="object-contain p-4" />
                    ) : (
                      p.name
                    )}
                  </div>
                ))}
              </div>
            )}
            {testimonials.length > 0 && (
              <div className="mt-12 grid gap-5 lg:grid-cols-3">
                {testimonials.map((t) => (
                  <blockquote key={t.id} className="rounded-2xl bg-ivory p-7 shadow-sm ring-1 ring-navy/5">
                    <p className="font-serif text-4xl leading-none text-copper">“</p>
                    <p className="mt-2 leading-relaxed text-ink/80">{t.quote}</p>
                    <footer className="mt-5 text-sm">
                      <p className="font-semibold text-navy">{t.name}</p>
                      {t.role && <p className="text-ink/55">{t.role}</p>}
                    </footer>
                  </blockquote>
                ))}
              </div>
            )}
            <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-copper/40 bg-ivory p-7 sm:flex-row sm:items-center">
              <div>
                <p className="font-serif text-xl text-navy">É dentista e quer ser parceiro?</p>
                <p className="mt-1 text-sm text-ink/65">Fale com a gente e receba nossa lista de serviços e condições.</p>
              </div>
              <a
                href={wa("Olá! Sou dentista e quero conhecer as condições de parceria.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-navy px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ivory transition hover:bg-navy-2"
              >
                Quero ser parceiro
              </a>
            </div>
          </div>
        </section>

        {/* CONTATO */}
        <section id="contato" className="bg-ivory py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <Eyebrow>Contato</Eyebrow>
              <h2 className="font-serif text-3xl text-navy sm:text-4xl">Fale com a gente.</h2>
              <dl className="mt-8 space-y-6 text-sm">
                <ContactItem label="WhatsApp" href={wa()} text={contact.whatsappLabel} external />
                {contact.email && <ContactItem label="E-mail" href={`mailto:${contact.email}`} text={contact.email} />}
                {contact.address && <ContactItem label="Endereço" href={mapsLink(contact.address)} text={contact.address} external />}
                {contact.instagram && (
                  <ContactItem
                    label="Instagram"
                    href={`https://instagram.com/${contact.instagram.replace(/^@/, "")}`}
                    text={`@${contact.instagram.replace(/^@/, "")}`}
                    external
                  />
                )}
                {settings.cro && (
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-aqua">Registro</dt>
                    <dd className="mt-1 text-ink/80">{settings.cro}</dd>
                  </div>
                )}
              </dl>
            </div>
            <ContactForm whatsapp={contact.whatsapp} />
          </div>
        </section>
      </main>

      <footer className="bg-navy py-12 text-ivory/60">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <LogoFull className="w-64 text-copper" />
            {settings.verse.text && (
              <p className="mt-4 max-w-md font-serif text-sm italic text-ivory/70">
                “{settings.verse.text}” <span className="not-italic text-copper">— {settings.verse.ref}</span>
              </p>
            )}
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-ivory/10 pt-6 text-xs sm:flex-row sm:justify-between">
            <p>
              {SITE_NAME} — {SITE_TAGLINE} · {settings.cro} · {settings.city}
            </p>
            <p className="flex items-center gap-4">
              <span>© {SITE_NAME}. Todos os direitos reservados.</span>
              <a href="/admin" rel="nofollow" className="inline-flex items-center gap-1.5 text-ivory/40 transition hover:text-copper">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
                Área restrita
              </a>
            </p>
          </div>
        </div>
      </footer>

      <a
        href={wa()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl transition hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.6-.5-1-1.1-1.4-1.8-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.6.6-.9 1.4-.9 2.2.1 1 .5 1.9 1.1 2.7 1.1 1.6 2.5 2.9 4.2 3.7.5.2 1 .4 1.4.5.5.1 1 .1 1.5 0 .6-.1 1.1-.5 1.4-1 .2-.4.2-.8.1-1.2l-.4-.3z" />
        </svg>
      </a>
    </>
  );
}

function ContactItem({ label, href, text, external }: { label: string; href: string; text: string; external?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-aqua">{label}</dt>
      <dd className="mt-1">
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-ink/80 hover:text-copper"
        >
          {text}
        </a>
      </dd>
    </div>
  );
}
