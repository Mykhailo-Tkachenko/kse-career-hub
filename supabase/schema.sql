-- Довідкова схема для нового проєкту. Таблиця listings у wqbnyrnxidjjbbjullyv уже існує
-- (без company_logo і created_by, posted_at — timestamptz), тому повторно цей файл там не запускати.
-- Виконати в Supabase Dashboard → SQL Editor
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  company_logo text not null default '🏢',
  type text not null check (type in ('internship', 'part-time', 'full-time')),
  location text not null default '',
  remote boolean not null default false,
  category text not null default '',
  description text not null default '',
  requirements text[] not null default '{}',
  posted_at date not null default current_date,
  applicants integer not null default 0,
  created_by uuid references auth.users (id) default auth.uid()
);

alter table public.listings enable row level security;

-- Вакансії бачать усі (навіть без логіну)
create policy "listings are public" on public.listings
  for select using (true);

-- Створювати вакансії можуть лише залогінені користувачі
create policy "authenticated can insert" on public.listings
  for insert to authenticated with check (created_by = auth.uid());

-- Початкові дані (колишній mockData)
insert into public.listings
  (title, company, company_logo, type, location, remote, category, description, requirements, posted_at, applicants)
values
  ('Data Analyst Intern', 'Raiffeisen Bank Ukraine', '🏦', 'internship', 'Київ', false, 'Data / Analytics',
   'Шукаємо студента 3-4 курсу для аналізу клієнтських даних та побудови дашбордів у команді ризик-менеджменту.',
   array['SQL', 'Excel', 'Базове розуміння статистики', 'Python — буде плюсом'], '2026-11-10', 14),
  ('Marketing Assistant', 'Lucas Confectionery', '🍬', 'part-time', 'Київ', true, 'Marketing',
   'Підтримка SMM-команди: модерація коментарів, аналітика залучення, допомога з контент-планом.',
   array['Грамотна українська', 'Досвід з соцмережами', 'Уважність до деталей'], '2026-11-05', 22),
  ('Junior ML Engineer Intern', 'EPAM Systems', '💻', 'internship', 'Віддалено', true, 'Engineering',
   'Стажування в команді, що розробляє ML-рішення для внутрішніх продуктів. Менторство від senior-інженерів.',
   array['Python', 'Основи ML (курси з DL/NLP — плюс)', 'Git'], '2026-11-15', 31),
  ('Research Assistant', 'Kyiv School of Economics', '🎓', 'part-time', 'Київ', false, 'Research',
   'Допомога викладачам з literature review, збором та обробкою даних для досліджень з економіки.',
   array['Academic writing', 'Excel/Stata — плюс', 'Англійська B2+'], '2026-11-01', 9);
