import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { listings } from '../data/mockData'

export default function ListingDetail() {
  const { id } = useParams()
  const listing = listings.find((l) => l.id === id)
  const [applied, setApplied] = useState(false)

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">Вакансію не знайдено.</p>
        <Link to="/listings" className="text-indigo-600 font-medium">
          ← Повернутись до списку
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/listings" className="text-sm text-indigo-600 font-medium">
        ← Усі вакансії
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{listing.companyLogo}</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{listing.title}</h1>
            <p className="text-slate-500">
              {listing.company} · {listing.remote ? 'Віддалено' : listing.location}
            </p>
          </div>
        </div>
        <button
          onClick={() => setApplied(true)}
          disabled={applied}
          className={`px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            applied
              ? 'bg-emerald-100 text-emerald-700 cursor-default'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {applied ? '✓ Заявку надіслано' : 'Apply'}
        </button>
      </div>

      <div className="mt-6 flex gap-2 text-xs">
        <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
          {listing.category}
        </span>
        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
          {listing.applicants} заявок
        </span>
      </div>

      <div className="mt-8">
        <h2 className="font-semibold text-slate-900 mb-2">Опис вакансії</h2>
        <p className="text-slate-600">{listing.description}</p>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold text-slate-900 mb-2">Вимоги</h2>
        <ul className="list-disc list-inside text-slate-600 space-y-1">
          {listing.requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
