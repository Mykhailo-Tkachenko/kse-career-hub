-- Керування вакансіями компаніями: створення, редагування, закриття, видалення.
-- Виконати після applications.sql і auth.sql у Supabase Dashboard → SQL Editor.

-- 1. Нові колонки
alter table public.listings
  add column if not exists is_active boolean not null default true,
  add column if not exists created_by uuid references auth.users (id) on delete set null default auth.uid();

alter table public.listings alter column posted_at set default now();
alter table public.listings alter column applicants set default 0;

-- 2. Чи є поточний користувач представником компанії
create or replace function public.is_company_member(company_name text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.company_members
    where user_id = auth.uid() and company = company_name
  );
$$;

-- 3. Політики listings: видаляємо всі наявні й задаємо повний набір заново
alter table public.listings enable row level security;

do $$
declare
  p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'listings' loop
    execute format('drop policy %I on public.listings', p.policyname);
  end loop;
end;
$$;

-- Відкриті вакансії бачать усі; закриті — лише сама компанія
create policy "listings read" on public.listings
  for select using (is_active or public.is_company_member(company));

-- Компанія створює вакансії лише від свого імені
create policy "company inserts own listings" on public.listings
  for insert to authenticated
  with check (public.is_company_member(company) and created_by = auth.uid() and applicants = 0);

-- Редагувати можна лише свої вакансії і не можна "передати" їх іншій компанії
create policy "company updates own listings" on public.listings
  for update to authenticated
  using (public.is_company_member(company))
  with check (public.is_company_member(company));

create policy "company deletes own listings" on public.listings
  for delete to authenticated
  using (public.is_company_member(company));

-- Змінювати з клієнта можна лише зміст вакансії; лічильник заявок, автора й дату — ні
-- (лічильник веде тригер нижче). Revoke однієї колонки не діє при праві на всю таблицю,
-- тому забираємо UPDATE повністю і видаємо по колонках.
revoke update on public.listings from authenticated, anon;
grant update (title, type, location, remote, category, description, requirements, is_active)
  on public.listings to authenticated;

-- 4. Лічильник заявок listings.applicants рахується автоматично
create or replace function public.sync_applicants_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.listings
  set applicants = (select count(*) from public.applications where listing_id = coalesce(new.listing_id, old.listing_id))
  where id = coalesce(new.listing_id, old.listing_id);
  return null;
end;
$$;

drop trigger if exists on_application_change_sync_count on public.applications;
create trigger on_application_change_sync_count
  after insert or delete on public.applications
  for each row execute function public.sync_applicants_count();

-- Вирівнюємо наявні значення під реальну кількість заявок
update public.listings l
set applicants = (select count(*) from public.applications a where a.listing_id = l.id);

-- 5. Відгукнутися можна лише на відкриту вакансію (решта умов — як в auth.sql)
drop policy if exists "authenticated can apply" on public.applications;
create policy "authenticated can apply" on public.applications
  for insert to authenticated
  with check (
    applicant_id = auth.uid()
    and applicant_email = auth.jwt() ->> 'email'
    and lower(auth.jwt() ->> 'email') like '%@kse.org.ua'
    and cv_path like auth.uid()::text || '/%'
    and exists (select 1 from public.listings l where l.id = listing_id and l.is_active)
  );
