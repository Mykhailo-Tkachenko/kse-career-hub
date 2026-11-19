# KSE Career Hub — демо

Демо-версія платформи для проєкту KSE Career Hub (KSE Project Management course).
Показує два флоу без реальної авторизації — перемикач "Я студент / Я компанія" у навбарі.

## Стек
- React + TypeScript + Vite
- Tailwind CSS 4 (через `@tailwindcss/vite`)
- react-router-dom
- Мок-дані в `src/data/mockData.ts` (без backend)

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
