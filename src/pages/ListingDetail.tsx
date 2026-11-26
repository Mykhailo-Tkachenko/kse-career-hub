import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { fetchListing, useQuery } from '../lib/listings'
import { applyToListing, hasApplied } from '../lib/applications'
import { useAuth } from '../context/AuthContext'
import { KSE_DOMAIN, isKseEmail } from '../lib/auth'

export default function ListingDetail() {
  const { id } = useParams()
  const { data: listing, loading, error } = useQuery(() => fetchListing(id!), [id])
  const { user } = useAuth()
  const location = useLocation()
  const { data: alreadyApplied } = useQuery(
    () => (user ? hasApplied(id!, user.id) : Promise.resolve(false)),
    [id, user?.id],
  )
  const [justApplied, setJustApplied] = useState(false)
  const [cv, setCv] = useState<File | null>(null)
  const [applying, setApplying] = useState(false)
  const [applyError, setApplyError] = useState<string | null>(null)
  const applied = justApplied || alreadyApplied === true

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    if (!cv) return
    setApplyError(null)
    setApplying(true)
    try {
      await applyToListing(id!, cv)
      setJustApplied(true)
    } catch (err) {
      setApplyError((err as Error).message)
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return <p className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">Завантаження...</p>
  }

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">{error ? `Помилка: ${error}` : 'Вакансію не знайдено.'}</p>
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
      </div>

      {!listing.isActive && (
        <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Вакансію закрито — студенти її не бачать і не можуть відгукнутися.
        </p>
      )}

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

      <div className="mt-10 border border-slate-200 rounded-xl bg-white p-6">
        <h2 className="font-semibold text-slate-900 mb-1">Відгукнутися на вакансію</h2>
        {!listing.isActive ? (
          <p className="text-sm text-slate-500">Набір на цю вакансію завершено.</p>
        ) : !user ? (
          <>
            <p className="text-sm text-slate-500 mb-4">
              Переглядати вакансії може кожен, а відгукнутися — лише після входу.
            </p>
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Увійти, щоб відгукнутися
            </Link>
          </>
        ) : !isKseEmail(user.email) ? (
          <p className="text-sm text-slate-500">
            Відгукуватися можуть лише студенти з поштою @{KSE_DOMAIN}. Ви увійшли як {user.email}.
          </p>
        ) : applied ? (
          <p className="bg-emerald-50 text-emerald-700 rounded-lg px-4 py-3 text-sm font-medium">
            ✓ Заявку надіслано. Компанія побачить ваше CV.
          </p>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            <p className="text-sm text-slate-500">Завантажте своє CV у форматі PDF (до 5 МБ).</p>
            <input
              type="file"
              accept="application/pdf"
              required
              onChange={(e) => setCv(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {applyError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{applyError}</p>
            )}
            <button
              type="submit"
              disabled={!cv || applying}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {applying ? 'Надсилаємо...' : 'Надіслати заявку'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
