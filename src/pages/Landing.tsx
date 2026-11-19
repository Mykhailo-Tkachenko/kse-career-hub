import { Link } from 'react-router-dom'
import { companies } from '../data/mockData'

export default function Landing() {
  return (
    <div>
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <span className="inline-block text-xs font-semibold tracking-wide uppercase text-indigo-600 bg-indigo-50 rounded-full px-3 py-1 mb-4">
          Проєкт KSE Project Management course
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
          Платформа, що з'єднує студентів KSE <br /> з кращими стажуваннями та роботою
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
          KSE Career Hub — централізований простір, де студенти знаходять релевантні вакансії, а
          партнерські компанії знаходять талановитих випускників.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/listings"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Знайти вакансію
          </Link>
          <Link
            to="/company"
            className="border border-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Я компанія-партнер
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-semibold text-slate-900">Релевантний підбір</h3>
          <p className="text-sm text-slate-500 mt-1">
            Фільтри за категорією, типом зайнятості та локацією під запит студента.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="text-3xl mb-2">🤝</div>
          <h3 className="font-semibold text-slate-900">Перевірені партнери</h3>
          <p className="text-sm text-slate-500 mt-1">
            Компанії, що вже співпрацюють з KSE, публікують вакансії напряму.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-semibold text-slate-900">Швидкий відгук</h3>
          <p className="text-sm text-slate-500 mt-1">
            Проста форма подачі заявки без зайвої бюрократії.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-slate-200">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-slate-500 mb-6">
          Партнерські компанії
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {companies.map((c) => (
            <div key={c.id} className="flex items-center gap-2 text-slate-700">
              <span className="text-2xl">{c.logo}</span>
              <span className="font-medium">{c.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
