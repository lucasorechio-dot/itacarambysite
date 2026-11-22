-- Itacaramby: loja (modelos de estudo físicos/digitais e cursos) e pedidos.

-- ============ PRODUTOS (modelos de estudo) ============
create table if not exists public.ita_products (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('fisico', 'digital')),
  name text not null,
  description text not null default '',
  price_cents int not null check (price_cents >= 0),
  image_url text not null default '',
  file_path text not null default '',          -- arquivo do produto digital (bucket privado)
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.ita_products enable row level security;
create policy "público lê produtos publicados" on public.ita_products for select to anon, authenticated using (published or public.ita_is_admin());
create policy "admin edita produtos" on public.ita_products for all to authenticated using (public.ita_is_admin()) with check (public.ita_is_admin());

-- ============ CURSOS ============
create table if not exists public.ita_courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  image_url text not null default '',
  highlights text[] not null default '{}',
  price_monthly_cents int,                       -- null = sem opção mensal
  price_full_cents int,                          -- null = sem opção de compra única
  access_days int not null default 365,          -- validade da compra única
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.ita_courses enable row level security;
create policy "público lê cursos publicados" on public.ita_courses for select to anon, authenticated using (published or public.ita_is_admin());
create policy "admin edita cursos" on public.ita_courses for all to authenticated using (public.ita_is_admin()) with check (public.ita_is_admin());

-- ============ PEDIDOS ============
create table if not exists public.ita_orders (
  id uuid primary key default gen_random_uuid(),
  number serial,
  token uuid not null default gen_random_uuid(),     -- dá acesso à página do pedido
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_cpf text not null default '',
  delivery text not null check (delivery in ('envio', 'retirada', 'nenhuma')),
  address jsonb,
  subtotal_cents int not null,
  shipping_cents int not null default 0,
  total_cents int not null,
  status text not null default 'pendente' check (status in ('pendente', 'pago', 'enviado', 'entregue', 'cancelado')),
  gateway text not null default 'demo',
  gateway_ref text not null default '',
  admin_notes text not null default '',
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
alter table public.ita_orders enable row level security;
create policy "admin gerencia pedidos" on public.ita_orders for all to authenticated using (public.ita_is_admin()) with check (public.ita_is_admin());
create index if not exists ita_orders_created_idx on public.ita_orders (created_at desc);

create table if not exists public.ita_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.ita_orders (id) on delete cascade,
  item_type text not null check (item_type in ('produto', 'curso')),
  product_id uuid references public.ita_products (id) on delete set null,
  course_id uuid references public.ita_courses (id) on delete set null,
  plan text check (plan in ('mensal', 'completo')),
  kind text,                                        -- fisico/digital (produtos)
  name text not null,
  unit_price_cents int not null,
  quantity int not null default 1 check (quantity between 1 and 50)
);
alter table public.ita_order_items enable row level security;
create policy "admin gerencia itens" on public.ita_order_items for all to authenticated using (public.ita_is_admin()) with check (public.ita_is_admin());

grant select on public.ita_products, public.ita_courses to anon, authenticated;
grant select, insert, update, delete on public.ita_products, public.ita_courses, public.ita_orders, public.ita_order_items to authenticated;
grant usage, select on sequence public.ita_orders_number_seq to authenticated;

-- ============ CRIAR PEDIDO (preços sempre vêm do banco, nunca do navegador) ============
create or replace function public.ita_create_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  it jsonb;
  v_order_id uuid;
  v_token uuid;
  v_number int;
  v_subtotal int := 0;
  v_shipping int := 0;
  v_has_physical boolean := false;
  v_delivery text := coalesce(payload->>'delivery', 'nenhuma');
  v_qty int;
  p record;
  c record;
  v_price int;
  v_plan text;
  items_out jsonb := '[]'::jsonb;
begin
  if coalesce(trim(payload->>'name'), '') = '' or coalesce(trim(payload->>'email'), '') = '' or coalesce(trim(payload->>'phone'), '') = '' then
    raise exception 'Preencha nome, e-mail e telefone.';
  end if;
  if jsonb_array_length(coalesce(payload->'items', '[]'::jsonb)) = 0 then
    raise exception 'Carrinho vazio.';
  end if;

  for it in select * from jsonb_array_elements(payload->'items') loop
    if it->>'type' = 'produto' then
      select * into p from public.ita_products where id = (it->>'id')::uuid and published;
      if not found then raise exception 'Produto indisponível.'; end if;
      v_qty := case when p.kind = 'digital' then 1 else greatest(1, least(50, coalesce((it->>'qty')::int, 1))) end;
      if p.kind = 'fisico' then v_has_physical := true; end if;
      v_subtotal := v_subtotal + p.price_cents * v_qty;
      items_out := items_out || jsonb_build_object('item_type', 'produto', 'product_id', p.id, 'kind', p.kind, 'name', p.name, 'unit', p.price_cents, 'qty', v_qty);
    elsif it->>'type' = 'curso' then
      select * into c from public.ita_courses where id = (it->>'id')::uuid and published;
      if not found then raise exception 'Curso indisponível.'; end if;
      v_plan := it->>'plan';
      v_price := case when v_plan = 'mensal' then c.price_monthly_cents when v_plan = 'completo' then c.price_full_cents end;
      if v_price is null then raise exception 'Plano indisponível para este curso.'; end if;
      v_subtotal := v_subtotal + v_price;
      items_out := items_out || jsonb_build_object('item_type', 'curso', 'course_id', c.id, 'plan', v_plan,
        'name', c.title || case when v_plan = 'mensal' then ' — assinatura mensal' else ' — curso completo' end, 'unit', v_price, 'qty', 1);
    else
      raise exception 'Item inválido.';
    end if;
  end loop;

  if v_has_physical then
    if v_delivery not in ('envio', 'retirada') then raise exception 'Escolha envio ou retirada.'; end if;
    if v_delivery = 'envio' then
      v_shipping := coalesce((select (data->'store'->>'shippingFlatCents')::int from public.ita_site_settings where id = 1), 0);
      if coalesce(trim(payload->'address'->>'cep'), '') = '' or coalesce(trim(payload->'address'->>'street'), '') = '' then
        raise exception 'Informe o endereço de entrega.';
      end if;
    end if;
  else
    v_delivery := 'nenhuma';
  end if;

  insert into public.ita_orders (customer_name, customer_email, customer_phone, customer_cpf, delivery, address,
                                 subtotal_cents, shipping_cents, total_cents, user_id)
  values (left(trim(payload->>'name'), 120), left(lower(trim(payload->>'email')), 160), left(trim(payload->>'phone'), 40),
          left(regexp_replace(coalesce(payload->>'cpf', ''), '\D', '', 'g'), 14), v_delivery,
          case when v_delivery = 'envio' then payload->'address' else null end,
          v_subtotal, v_shipping, v_subtotal + v_shipping, (select auth.uid()))
  returning id, token, number into v_order_id, v_token, v_number;

  insert into public.ita_order_items (order_id, item_type, product_id, course_id, plan, kind, name, unit_price_cents, quantity)
  select v_order_id, x->>'item_type', (x->>'product_id')::uuid, (x->>'course_id')::uuid, x->>'plan', x->>'kind', x->>'name',
         (x->>'unit')::int, (x->>'qty')::int
  from jsonb_array_elements(items_out) x;

  return jsonb_build_object('id', v_order_id, 'token', v_token, 'number', v_number, 'total_cents', v_subtotal + v_shipping);
end;
$$;

-- ============ CONSULTAR PEDIDO (com o token do link) ============
create or replace function public.ita_get_order(p_id uuid, p_token uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'id', o.id, 'number', o.number, 'status', o.status, 'created_at', o.created_at, 'paid_at', o.paid_at,
    'customer_name', o.customer_name, 'delivery', o.delivery, 'address', o.address,
    'subtotal_cents', o.subtotal_cents, 'shipping_cents', o.shipping_cents, 'total_cents', o.total_cents,
    'items', coalesce((select jsonb_agg(jsonb_build_object('name', i.name, 'type', i.item_type, 'kind', i.kind, 'plan', i.plan,
                         'unit_price_cents', i.unit_price_cents, 'quantity', i.quantity, 'product_id', i.product_id) order by i.name)
                       from public.ita_order_items i where i.order_id = o.id), '[]'::jsonb))
  from public.ita_orders o
  where o.id = p_id and o.token = p_token;
$$;

revoke all on function public.ita_create_order(jsonb) from public;
revoke all on function public.ita_get_order(uuid, uuid) from public;
grant execute on function public.ita_create_order(jsonb) to anon, authenticated;
grant execute on function public.ita_get_order(uuid, uuid) to anon, authenticated;

-- ============ ARQUIVOS DIGITAIS (bucket privado) ============
insert into storage.buckets (id, name, public, file_size_limit)
values ('itacaramby-arquivos', 'itacaramby-arquivos', false, 209715200)
on conflict (id) do nothing;
create policy "itacaramby: admin envia arquivos" on storage.objects for insert to authenticated
  with check (bucket_id = 'itacaramby-arquivos' and public.ita_is_admin());
create policy "itacaramby: admin lê arquivos" on storage.objects for select to authenticated
  using (bucket_id = 'itacaramby-arquivos' and public.ita_is_admin());
create policy "itacaramby: admin apaga arquivos" on storage.objects for delete to authenticated
  using (bucket_id = 'itacaramby-arquivos' and public.ita_is_admin());

-- ============ CONFIGURAÇÕES DA LOJA (frete fixo, retirada) ============
update public.ita_site_settings
set data = data || jsonb_build_object('store', jsonb_build_object(
  'shippingFlatCents', 3500,
  'pickupNote', 'Retirada no laboratório: Rua Dinamarca, Qd. 37, Lt. 14, nº 14 — Vila Santa Isabel, Anápolis - GO. Combine o horário pelo WhatsApp.'))
where id = 1 and not (data ? 'store');

-- ============ EXEMPLOS (valores A CONFIRMAR — editar no painel) ============
insert into public.ita_products (kind, name, description, price_cents, image_url, position)
select * from (values
  ('fisico', 'Modelo de estudo — protocolo superior', 'Modelo físico de protocolo superior sobre implantes para estudo de anatomia e caracterização gengival. (valor de exemplo)', 18000, '/img/protocolo-ceramica.png', 1),
  ('fisico', 'Modelo de estudo — coroas e pontes', 'Modelo físico com preparos e coroas para treino de escultura, acabamento e polimento. (valor de exemplo)', 12000, '/img/ceramica.png', 2),
  ('digital', 'Arquivo STL — protocolo superior', 'Arquivo 3D (STL) do protocolo superior para impressão e estudo. Download liberado após o pagamento. (valor de exemplo)', 4900, '/img/protocolo-resina.png', 3)
) as v(kind, name, description, price_cents, image_url, position)
where not exists (select 1 from public.ita_products);

insert into public.ita_courses (slug, title, subtitle, description, image_url, highlights, price_monthly_cents, price_full_cents, access_days, position)
select 'masterclass-protocolo-natural', 'Masterclass Protocolo Natural',
  'A arte da caracterização em prótese acrílica sobre implantes',
  'Treinamento online do básico ao avançado: caracterização interna, externa e combinada de protocolos acrílicos, com teoria, demonstrações na bancada e exercícios práticos.',
  '/img/protocolo-ceramica.png',
  array['30 videoaulas em 8 módulos', '8 a 12 horas de conteúdo', 'Apostila do aluno e fichas de apoio', 'Do básico ao avançado', 'Projeto prático final'],
  9700, 69700, 365, 1
where not exists (select 1 from public.ita_courses where slug = 'masterclass-protocolo-natural');
