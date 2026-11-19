import type { Company, Listing } from '../types'

export const companies: Company[] = [
  {
    id: 'c1',
    name: 'Raiffeisen Bank Ukraine',
    logo: '🏦',
    industry: 'Finance',
    description: 'Один з найбільших банків України, активно наймає молодих спеціалістів.',
  },
  {
    id: 'c2',
    name: 'Lucas Confectionery',
    logo: '🍬',
    industry: 'FMCG',
    description: 'Українська кондитерська компанія, шукає маркетологів та аналітиків.',
  },
  {
    id: 'c3',
    name: 'EPAM Systems',
    logo: '💻',
    industry: 'IT',
    description: 'Глобальна IT-компанія з потужною програмою стажувань для студентів.',
  },
  {
    id: 'c4',
    name: 'Kyiv School of Economics',
    logo: '🎓',
    industry: 'Education',
    description: 'Дослідницькі та адміністративні позиції для студентів KSE.',
  },
]

export const listings: Listing[] = [
  {
    id: 'l1',
    title: 'Data Analyst Intern',
    company: 'Raiffeisen Bank Ukraine',
    companyLogo: '🏦',
    type: 'internship',
    location: 'Київ',
    remote: false,
    category: 'Data / Analytics',
    description:
      'Шукаємо студента 3-4 курсу для аналізу клієнтських даних та побудови дашбордів у команді ризик-менеджменту.',
    requirements: ['SQL', 'Excel', 'Базове розуміння статистики', 'Python — буде плюсом'],
    postedAt: '2026-11-10',
    applicants: 14,
  },
  {
    id: 'l2',
    title: 'Marketing Assistant',
    company: 'Lucas Confectionery',
    companyLogo: '🍬',
    type: 'part-time',
    location: 'Київ',
    remote: true,
    category: 'Marketing',
    description:
      'Підтримка SMM-команди: модерація коментарів, аналітика залучення, допомога з контент-планом.',
    requirements: ['Грамотна українська', 'Досвід з соцмережами', 'Уважність до деталей'],
    postedAt: '2026-11-05',
    applicants: 22,
  },
  {
    id: 'l3',
    title: 'Junior ML Engineer Intern',
    company: 'EPAM Systems',
    companyLogo: '💻',
    type: 'internship',
    location: 'Віддалено',
    remote: true,
    category: 'Engineering',
    description:
      'Стажування в команді, що розробляє ML-рішення для внутрішніх продуктів. Менторство від senior-інженерів.',
    requirements: ['Python', 'Основи ML (курси з DL/NLP — плюс)', 'Git'],
    postedAt: '2026-11-15',
    applicants: 31,
  },
  {
    id: 'l4',
    title: 'Research Assistant',
    company: 'Kyiv School of Economics',
    companyLogo: '🎓',
    type: 'part-time',
    location: 'Київ',
    remote: false,
    category: 'Research',
    description:
      'Допомога викладачам з literature review, збором та обробкою даних для досліджень з економіки.',
    requirements: ['Academic writing', 'Excel/Stata — плюс', 'Англійська B2+'],
    postedAt: '2026-11-01',
    applicants: 9,
  },
]
