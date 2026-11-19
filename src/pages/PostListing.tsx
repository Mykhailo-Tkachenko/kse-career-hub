import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PostListing() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Для демо — без реального збереження на backend
    setSubmitted(true)
    setTimeout(() => navigate('/company'), 1200)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Нова вакансія</h1>
      <p className="text-slate-500 mb-6">Заповніть форму, щоб опублікувати пропозицію для студентів KSE.</p>

      {submitted ? (
        <div className="bg-emerald-50 text-emerald-700 rounded-lg px-4 py-6 text-center font-medium">
          ✓ Вакансію опубліковано! Переходимо до списку...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Назва позиції</label>
            <input
              required
              placeholder="Наприклад, Marketing Intern"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Тип зайнятості</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="internship">Стажування</option>
                <option value="part-time">Часткова зайнятість</option>
                <option value="full-time">Повна зайнятість</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Категорія</label>
              <input
                placeholder="Marketing, Data, ..."
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Локація</label>
            <input
              placeholder="Київ або 'Віддалено'"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Опис вакансії</label>
            <textarea
              required
              rows={4}
              placeholder="Чим займатиметься студент, які інструменти використовує команда..."
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Вимоги (через кому)
            </label>
            <input
              placeholder="Excel, SQL, англійська B2"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Опублікувати вакансію
          </button>
        </form>
      )}
    </div>
  )
}
