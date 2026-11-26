-- Відгуки на вакансії + CV у Storage.
-- Виконати один раз у Supabase Dashboard → SQL Editor.

-- 1. Прив'язка акаунтів до компаній.
-- Заповнюється лише вручну адміном (через SQL Editor / Table Editor),
-- щоб ніхто не міг сам "стати" компанією і читати чужі CV.
create table if not exists public.company_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  company text not null
);

alter table public.company_members enable row level security;

create policy "members see own membership" on public.company_members
  for select to authenticated using (user_id = auth.uid());

-- 2. Відгуки
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  applicant_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  applicant_email text not null,
  cv_path text not null,
  created_at timestamptz not null default now(),
  unique (listing_id, applicant_id)
);

alter table public.applications enable row level security;

-- Відгукнутися може лише залогінений користувач, від свого імені і зі своїм CV
create policy "authenticated can apply" on public.applications
  for insert to authenticated
  with check (
    applicant_id = auth.uid()
    and applicant_email = auth.jwt() ->> 'email'
    and cv_path like auth.uid()::text || '/%'
  );

-- Кандидат бачить свої відгуки, компанія — відгуки на свої вакансії
create policy "applicant or company can read" on public.applications
  for select to authenticated
  using (
    applicant_id = auth.uid()
    or exists (
      select 1
      from public.listings l
      join public.company_members cm on cm.company = l.company
      where l.id = applications.listing_id and cm.user_id = auth.uid()
    )
  );

-- 3. Приватний бакет для CV: лише PDF, до 5 МБ
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cvs', 'cvs', false, 5242880, array['application/pdf'])
on conflict (id) do nothing;

-- Завантажувати можна лише у власну папку: cvs/<user_id>/...
create policy "upload own cv" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'cvs' and (storage.foldername(name))[1] = auth.uid()::text);

-- Читати CV може власник або компанія, на чию вакансію подано відгук
create policy "read own or applied cv" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'cvs'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1
        from public.applications a
        join public.listings l on l.id = a.listing_id
        join public.company_members cm on cm.company = l.company
        where a.cv_path = storage.objects.name and cm.user_id = auth.uid()
      )
    )
  );

-- Як прив'язати акаунт компанії (після того як людина зареєструвалась):
-- insert into public.company_members (user_id, company)
-- select id, 'Lucas Confectionery' from auth.users where email = 'hr@lucas.ua';
