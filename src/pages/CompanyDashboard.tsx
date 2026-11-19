import { Link } from 'react-router-dom'
import { listings } from '../data/mockData'

// Для демо показуємо вакансії першої компанії зі списку мок-даних
const MY_COMPANY = 'Lucas Confectionery'

export default function CompanyDashboard() {
  const myListings = listings.filter((l) => l.company === MY_COMPANY)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Мої вакансії</h1>
          <p className="text-slate-500">{MY_COMPANY}</p>
        </div>
        <Link
          to="/company/new"
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          + Нова вакансія
        </Link>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Назва</th>
              <th className="px-4 py-3 font-medium">Тип</th>
              <th className="px-4 py-3 font-medium">Опубліковано</th>
              <th className="px-4 py-3 font-medium">Заявки</th>
            </tr>
          </thead>
          <tbody>
            {myListings.map((l) => (
              <tr key={l.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{l.title}</td>
                <td className="px-4 py-3 text-slate-600">{l.type}</td>
                <td className="px-4 py-3 text-slate-600">{l.postedAt}</td>
                <td className="px-4 py-3 text-slate-600">{l.applicants}</td>
              </tr>
            ))}
            {myListings.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Ще немає опублікованих вакансій.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
