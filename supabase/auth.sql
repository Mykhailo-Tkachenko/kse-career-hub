-- Обмеження реєстрації: студенти — лише пошта @kse.org.ua, компанії — за запрошенням.
-- Виконати після applications.sql у Supabase Dashboard → SQL Editor,
-- потім увімкнути хук: Authentication → Hooks → Before User Created →
-- Postgres function → public.hook_restrict_signup.

-- 1. Запрошення компаній: адмін додає email, людина реєструється сама
--    і автоматично отримує доступ до сторінки компанії.
create table if not exists public.company_invites (
  email text primary key check (email = lower(email)),
  company text not null
);

-- RLS без політик: таблицю бачать лише адміни та security definer функції нижче
alter table public.company_invites enable row level security;

-- 2. Хук: викликається Supabase Auth перед створенням будь-якого користувача
--    (email/пароль, Google тощо). Повертає помилку — користувача не створено.
create or replace function public.hook_restrict_signup(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  user_email text := lower(event -> 'user' ->> 'email');
begin
  if user_email like '%@kse.org.ua'
     or exists (select 1 from public.company_invites where email = user_email) then
    return '{}'::jsonb;
  end if;

  return jsonb_build_object(
    'error', jsonb_build_object(
      'http_code', 403,
      'message', 'Реєстрація доступна лише з поштою @kse.org.ua'
    )
  );
end;
$$;

grant execute on function public.hook_restrict_signup to supabase_auth_admin;
revoke execute on function public.hook_restrict_signup from authenticated, anon, public;

-- 3. Новий користувач із запрошенням → одразу прив'язується до компанії
--    (company_invites_on_login.sql замінює цей тригер: перевірка при кожному вході)
create or replace function public.link_invited_company()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.company_members (user_id, company)
  select new.id, ci.company
  from public.company_invites ci
  where ci.email = lower(new.email)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_link_company on auth.users;
create trigger on_auth_user_created_link_company
  after insert on auth.users
  for each row execute function public.link_invited_company();

-- 4. Відгукуватися можуть лише студенти KSE (захист і на рівні бази)
drop policy if exists "authenticated can apply" on public.applications;
create policy "authenticated can apply" on public.applications
  for insert to authenticated
  with check (
    applicant_id = auth.uid()
    and applicant_email = auth.jwt() ->> 'email'
    and lower(auth.jwt() ->> 'email') like '%@kse.org.ua'
    and cv_path like auth.uid()::text || '/%'
  );

-- Як запросити компанію:
-- insert into public.company_invites (email, company) values ('hr@lucas.ua', 'Lucas Confectionery');
