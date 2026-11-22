-- Itacaramby: tabelas do painel admin, segurança (RLS), armazenamento de fotos e conteúdo inicial.

-- ============ ADMINISTRADORES ============
create table if not exists public.ita_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.ita_admins enable row level security;

create or replace function public.ita_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.ita_admins where user_id = (select auth.uid()));
$$;

create policy "admin lê admins" on public.ita_admins for select to authenticated using (public.ita_is_admin());

-- ============ CONFIGURAÇÕES (textos e contatos) ============
create table if not exists public.ita_site_settings (
  id smallint primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.ita_site_settings enable row level security;
create policy "público lê configurações" on public.ita_site_settings for select to anon, authenticated using (true);
create policy "admin edita configurações" on public.ita_site_settings for all to authenticated using (public.ita_is_admin()) with check (public.ita_is_admin());

-- ============ SERVIÇOS ============
create table if not exists public.ita_services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text not null default '',
  items text[] not null default '{}',
  image_url text not null default '',
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.ita_services enable row level security;
create policy "público lê serviços publicados" on public.ita_services for select to anon, authenticated using (published or public.ita_is_admin());
create policy "admin edita serviços" on public.ita_services for all to authenticated using (public.ita_is_admin()) with check (public.ita_is_admin());

-- ============ GALERIA ============
create table if not exists public.ita_gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text not null default '',
  image_url text not null,
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.ita_gallery enable row level security;
create policy "público lê galeria publicada" on public.ita_gallery for select to anon, authenticated using (published or public.ita_is_admin());
create policy "admin edita galeria" on public.ita_gallery for all to authenticated using (public.ita_is_admin()) with check (public.ita_is_admin());

-- ============ PARCEIROS ============
create table if not exists public.ita_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null default '',
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.ita_partners enable row level security;
create policy "público lê parceiros publicados" on public.ita_partners for select to anon, authenticated using (published or public.ita_is_admin());
create policy "admin edita parceiros" on public.ita_partners for all to authenticated using (public.ita_is_admin()) with check (public.ita_is_admin());

-- ============ DEPOIMENTOS ============
create table if not exists public.ita_testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text not null default '',
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.ita_testimonials enable row level security;
create policy "público lê depoimentos publicados" on public.ita_testimonials for select to anon, authenticated using (published or public.ita_is_admin());
create policy "admin edita depoimentos" on public.ita_testimonials for all to authenticated using (public.ita_is_admin()) with check (public.ita_is_admin());

-- ============ MENSAGENS DO FORMULÁRIO ============
create table if not exists public.ita_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  clinic text not null default '' check (char_length(clinic) <= 160),
  phone text not null default '' check (char_length(phone) <= 40),
  subject text not null default '' check (char_length(subject) <= 80),
  message text not null check (char_length(message) between 1 and 4000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.ita_messages enable row level security;
-- O público só pode ENVIAR (nunca ler) mensagens.
create policy "público envia mensagem" on public.ita_messages for insert to anon, authenticated with check (read = false);
create policy "admin lê mensagens" on public.ita_messages for select to authenticated using (public.ita_is_admin());
create policy "admin atualiza mensagens" on public.ita_messages for update to authenticated using (public.ita_is_admin()) with check (public.ita_is_admin());
create policy "admin apaga mensagens" on public.ita_messages for delete to authenticated using (public.ita_is_admin());
create index if not exists ita_messages_created_at_idx on public.ita_messages (created_at desc);

-- ============ PERMISSÕES (as políticas RLS acima continuam valendo) ============
grant select on public.ita_site_settings, public.ita_services, public.ita_gallery, public.ita_partners, public.ita_testimonials to anon, authenticated;
grant insert on public.ita_messages to anon, authenticated;
grant select, insert, update, delete on public.ita_site_settings, public.ita_services, public.ita_gallery, public.ita_partners, public.ita_testimonials, public.ita_messages to authenticated;
grant select on public.ita_admins to authenticated;
revoke all on function public.ita_is_admin() from public;
grant execute on function public.ita_is_admin() to anon, authenticated;

-- ============ ARMAZENAMENTO DE FOTOS ============
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('itacaramby', 'itacaramby', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "itacaramby: admin envia fotos" on storage.objects for insert to authenticated
  with check (bucket_id = 'itacaramby' and public.ita_is_admin());
create policy "itacaramby: admin atualiza fotos" on storage.objects for update to authenticated
  using (bucket_id = 'itacaramby' and public.ita_is_admin());
create policy "itacaramby: admin apaga fotos" on storage.objects for delete to authenticated
  using (bucket_id = 'itacaramby' and public.ita_is_admin());

-- ============ CONTEÚDO INICIAL (o que já está no site) ============
insert into public.ita_site_settings (id, data) values (1, $json${
  "cro": "CRO 430",
  "city": "Anápolis - GO",
  "hero": {
    "eyebrow": "ESTÉTICA • PRECISÃO • COMPROMISSO",
    "title1": "O sorriso do seu paciente",
    "title2": "começa na nossa bancada.",
    "text": "Coroas, facetas, protocolos e próteses totais e removíveis feitas com materiais de primeira linha e acabamento estético. Envie seu caso pelo WhatsApp e receba no prazo."
  },
  "about": {
    "title": "Onde a técnica encontra o detalhe.",
    "paragraphs": [
      "O Itacaramby é um laboratório de prótese dentária em Anápolis dedicado à estética. Trabalhamos lado a lado com o dentista, do planejamento à entrega, para que cada peça chegue ao consultório pronta para o paciente.",
      "Seguimos investindo em cursos, equipamentos e materiais de qualidade — E.max, Rosetta, Signum, Resilab, metalocerâmica e ligas metálicas — para entregar trabalhos com adaptação precisa e aparência natural."
    ],
    "stats": [
      {"value": "CRO 430", "label": "laboratório registrado"},
      {"value": "5 dias", "label": "prazo a partir de 5 dias úteis"},
      {"value": "30+", "label": "tipos de trabalho"}
    ]
  },
  "owner": {
    "name": "Cesar Itacaramby",
    "role": "Técnico em Prótese Dentária · Responsável técnico",
    "photo": "/img/responsavel.png"
  },
  "contact": {
    "whatsapp": "5562984490810",
    "whatsappLabel": "(62) 98449-0810",
    "email": "itacaramby76@outlook.com",
    "instagram": "",
    "address": "Rua Dinamarca, Qd. 37, Lt. 14, nº 14 — Vila Santa Isabel, Anápolis - GO, CEP 75083-323"
  },
  "leadTimes": [
    {"item": "N.M.F / R.M.F", "days": "5 dias úteis"},
    {"item": "Montagem de dentes", "days": "5 dias úteis"},
    {"item": "Acrilização", "days": "5 dias úteis"},
    {"item": "Metal C.M.C", "days": "7 dias úteis"},
    {"item": "Grade da PPR", "days": "10 dias úteis"},
    {"item": "C.M.C direta", "days": "10 dias úteis"},
    {"item": "Estrutura metálica de protocolo", "days": "10 dias úteis"},
    {"item": "Metal C.M.C sobre implante", "days": "10 dias úteis"}
  ],
  "verse": {
    "text": "Confia os teus cuidados ao Senhor, e ele te sustentará; jamais permitirá que o justo seja abalado.",
    "ref": "Salmos 55.22"
  }
}$json$::jsonb)
on conflict (id) do nothing;

insert into public.ita_services (title, text, items, image_url, position)
select * from (values
  ('E.max e Rosetta', 'Cerâmicas de alta estética para coroas, facetas e lentes.', array['Coroa','Onlay / Inlay','Faceta ou lente','Fragmento','E.max'], '/img/dissilicato.png', 1),
  ('Metalocerâmica', 'Resistência e estética para unitários, pontes e implantes.', array['Coroa metalocerâmica','Coroa sobre implante','Protocolo metalocerâmico','Protocolo com gengiva cerâmica'], '/img/coroas-implante.png', 2),
  ('Signum e Resilab', 'Resinas laboratoriais para coroas e restaurações indiretas.', array['Coroa Signum','Coroa Resilab','Onlay / Inlay Signum','Onlay / Inlay Resilab'], '/img/ceramica.png', 3),
  ('Protocolos sobre implantes', 'Reabilitações fixas sobre implantes, do provisório ao definitivo.', array['Protocolo em resina','Protocolo provisório','Barra de protocolo','Barra com O-ring'], '/img/protocolo-ceramica.png', 4),
  ('Próteses totais', 'Dentaduras com acabamento rosa, caracterizado ou customizado.', array['Prótese total rosa','Prótese total caracterizada','Prótese total customizada','Prótese total imediata','Clonagem de PT'], '/img/protese-total.png', 5),
  ('Removíveis e estruturas metálicas', 'PPR e núcleos em liga de prata, cromo e metal amarelo.', array['Prótese parcial removível','N.M.F e R.M.F (prata, cromo, metal amarelo)','Coping metálico'], '/img/ppr.png', 6),
  ('Placas, guias e outros', 'Trabalhos complementares para o dia a dia do consultório.', array['Guia cirúrgico','Placa de clareamento','Placa de bruxismo (silicone ou acrílica)','Veneer em Art Glass ou resina acrílica'], '/img/protocolo-resina.png', 7),
  ('Trabalhos fracionados', 'Etapas avulsas para complementar o seu fluxo.', array['Provisório','Moldeira individual','Montagem e prensagem (PT/PPR)','Troca de dentes','Aplicação de cerâmica'], '', 8)
) as v(title, text, items, image_url, position)
where not exists (select 1 from public.ita_services);

insert into public.ita_gallery (title, tag, image_url, position)
select * from (values
  ('Coroas sobre implante', 'Metalocerâmica', '/img/coroas-implante.png', 1),
  ('Protocolo com gengiva', 'Implantes', '/img/protocolo-ceramica.png', 2),
  ('Coroas em cerâmica', 'Cerâmica', '/img/ceramica.png', 3),
  ('Prótese total', 'PT', '/img/protese-total.png', 4),
  ('Protocolo em resina', 'Implantes', '/img/protocolo-resina.png', 5),
  ('Prótese parcial removível', 'PPR', '/img/ppr.png', 6),
  ('Onlays em dissilicato', 'E.max', '/img/dissilicato.png', 7)
) as v(title, tag, image_url, position)
where not exists (select 1 from public.ita_gallery);
