-- Прив'язка компанії із company_invites не лише при реєстрації, а при кожному вході.
-- Виконати після auth.sql у Supabase Dashboard → SQL Editor. Замінює тригер з auth.sql.

-- Прив'язуємо лише підтверджену пошту: інакше хтось міг би зареєструватися
-- з чужим запрошеним email і отримати доступ ще до підтвердження.
-- Якщо акаунт уже прив'язаний до компанії, нічого не змінюємо.
create or replace function public.link_invited_company()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null then
    insert into public.company_members (user_id, company)
    select new.id, ci.company
    from public.company_invites ci
    where ci.email = lower(new.email)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

-- Спрацьовує при реєстрації, при підтвердженні пошти і при кожному вході
-- (Supabase Auth оновлює last_sign_in_at на кожен логін)
drop trigger if exists on_auth_user_created_link_company on auth.users;
drop trigger if exists on_auth_user_link_company on auth.users;
create trigger on_auth_user_link_company
  after insert or update of last_sign_in_at, email_confirmed_at on auth.users
  for each row execute function public.link_invited_company();

-- Одразу прив'язуємо вже наявні акаунти, для яких є запрошення
insert into public.company_members (user_id, company)
select u.id, ci.company
from auth.users u
join public.company_invites ci on ci.email = lower(u.email)
where u.email_confirmed_at is not null
on conflict (user_id) do nothing;
