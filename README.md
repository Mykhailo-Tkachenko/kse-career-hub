# KSE Career Hub — демо

Демо-версія платформи для проєкту KSE Career Hub (KSE Project Management course).
Показує два флоу без реальної авторизації — перемикач "Я студент / Я компанія" у навбарі.

## Стек
- React + TypeScript + Vite
- Tailwind CSS 4 (через `@tailwindcss/vite`)
- react-router-dom
- Supabase (`@supabase/supabase-js`): таблиця `listings` + Supabase Auth (email/пароль)
- Мок-дані компаній у `src/data/mockData.ts`

## Налаштування Supabase
1. Скопіювати `.env.example` у `.env` і вписати `VITE_SUPABASE_URL` та `VITE_SUPABASE_ANON_KEY` (Dashboard → Project Settings → API).
2. У Supabase SQL Editor виконати `supabase/schema.sql` — створить таблицю `listings`, RLS-політики та початкові дані.
3. Виконати `supabase/applications.sql` — таблиці `applications` і `company_members`, приватний бакет `cvs` для CV (PDF) та RLS.
4. Виконати `supabase/auth.sql` — реєстрація лише для `@kse.org.ua` та запрошених компаній.
   Потім `supabase/company_invites_on_login.sql` — прив'язка компанії із запрошення при кожному вході, а не лише при реєстрації.
   Потім `supabase/company_listings.sql` — компанії створюють, редагують, закривають і видаляють свої вакансії.
5. Authentication → Hooks → **Before User Created** → Postgres function `public.hook_restrict_signup` → Enable.
6. Google-логін: Authentication → Sign In / Providers → Google (Client ID і Secret з Google Cloud Console,
   Authorized redirect URI — `https://wqbnyrnxidjjbbjullyv.supabase.co/auth/v1/callback`).
7. Authentication → URL Configuration → Redirect URLs: додати `http://localhost:5173/**` (і домен продакшну).
8. Запросити компанію: `insert into public.company_invites (email, company) values ('hr@lucas.ua', 'Lucas Confectionery');` —
   при наступному вході (або реєстрації) з цим email акаунт автоматично отримає доступ до сторінки компанії.

## Запуск у WebStorm
1. Відкрити папку проєкту у WebStorm.
2. У терміналі: `npm install`
3. `npm run dev` — піднімає dev-сервер (зазвичай http://localhost:5173)
4. WebStorm також підхопить запуск через конфігурацію npm scripts (праворуч на іконці `package.json` → Run 'dev').

## Структура
```
src/
  pages/        Landing, Listings, ListingDetail, CompanyDashboard, PostListing
  components/   Navbar, ListingCard, FilterBar
  context/      RoleContext — перемикач ролі студент/компанія (demo-only)
  data/         mockData.ts — вакансії та компанії
  types/        спільні TS-типи
```

## Що далі (ідеї для продовження)
- Форма "Нова вакансія" зараз не зберігає дані — можна підв'язати до стейту/localStorage.
- Додати сторінку профілю студента.
- Реальна авторизація замість перемикача ролей.
- Підключити справжній backend/БД, якщо знадобиться для захисту проєкту.

## Деплой (Vercel)
Продакшн: https://kse-career-hub-demo.vercel.app
1. Vercel → Project Settings → Environment Variables: `VITE_SUPABASE_URL` і `VITE_SUPABASE_ANON_KEY`
   (Vite вбудовує їх під час збірки, тому після зміни потрібен новий деплой).
2. `npx vercel --prod` (Node 20.19+). `vercel.json` віддає `index.html` на всі шляхи, щоб працювали прямі посилання на кшталт `/listings/<id>`.
3. Supabase → Authentication → URL Configuration: Site URL — `https://kse-career-hub-demo.vercel.app`,
   у Redirect URLs додати `https://kse-career-hub-demo.vercel.app/**` (для Google-логіну і листів підтвердження).
