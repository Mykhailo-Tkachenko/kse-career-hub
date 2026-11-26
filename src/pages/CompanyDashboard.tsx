import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import CompanyGate from '../components/CompanyGate'
import {
  deleteListing,
  fetchListings,
  setListingActive,
  typeLabel,
  useQuery,
} from '../lib/listings'
import { fetchApplications, getCvUrl } from '../lib/applications'
import type { Listing } from '../types'

export default function CompanyDashboard() {
  return <CompanyGate>{(company) => <CompanyListings company={company} />}</CompanyGate>
}

async function loadDashboard(company: string) {
  const listings = await fetchListings({ company })
  const applications = await fetchApplications(listings.map((l) => l.id))
  return { listings, applications }
}

function CompanyListings({ company }: { company: string }) {
  const { data, loading, error, reload } = useQuery(() => loadDashboard(company), [company])
  const [openListingId, setOpenListingId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function runAction(listingId: string, action: () => Promise<void>) {
    setActionError(null)
    setBusyId(listingId)
    try {
      await action()
      reload()
    } catch (err) {
      setActionError((err as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  function handleDelete(listing: Listing) {
    const warning =
      listing.applicants > 0
        ? `Видалити «${listing.title}»? Разом з нею зникнуть ${listing.applicants} заявок. Якщо набір просто завершено, краще закрити вакансію.`
        : `Видалити «${listing.title}»?`
    if (window.confirm(warning)) runAction(listing.id, () => deleteListing(listing.id))
  }

  async function openCv(cvPath: string) {
    setActionError(null)
    // Відкриваємо вкладку одразу по кліку, інакше браузер заблокує її як спливне вікно
    const tab = window.open('', '_blank')
    try {
      const url = await getCvUrl(cvPath)
      if (tab) tab.location.href = url
      else window.location.href = url
    } catch (err) {
      tab?.close()
      setActionError(`Не вдалося відкрити CV: ${(err as Error).message}`)
    }
  }

  if (loading && !data) {
    return <p className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">Завантаження...</p>
  }

  if (error || !data) {
    return (
      <p className="max-w-5xl mx-auto px-4 py-16 text-center text-red-700">
        Не вдалося завантажити дані: {error}
      </p>
    )
  }

  const applicationsFor = (listingId: string) =>
    data.applications.filter((a) => a.listingId === listingId)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Мої вакансії</h1>
          <p className="text-slate-500">{company}</p>
        </div>
        <Link
          to="/company/new"
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          + Нова вакансія
        </Link>
      </div>

      {actionError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>
      )}

      <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Назва</th>
              <th className="px-4 py-3 font-medium">Тип</th>
              <th className="px-4 py-3 font-medium">Опубліковано</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium">Відгуки</th>
              <th className="px-4 py-3 font-medium text-right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {data.listings.map((l) => {
              const apps = applicationsFor(l.id)
              const isOpen = openListingId === l.id
              const busy = busyId === l.id
              return (
                <Fragment key={l.id}>
                  <tr className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link to={`/listings/${l.id}`} className="hover:text-indigo-600">
                        {l.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{typeLabel[l.type]}</td>
                    <td className="px-4 py-3 text-slate-600">{l.postedAt}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          l.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {l.isActive ? 'Відкрита' : 'Закрита'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setOpenListingId(isOpen ? null : l.id)}
                        disabled={apps.length === 0}
                        className="text-indigo-600 font-medium disabled:text-slate-400"
                      >
                        {apps.length} {apps.length > 0 && (isOpen ? '▴' : '▾')}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2 whitespace-nowrap">
                        <Link
                          to={`/company/listings/${l.id}/edit`}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Редагувати
                        </Link>
                        <button
                          disabled={busy}
                          onClick={() => runAction(l.id, () => setListingActive(l.id, !l.isActive))}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                        >
                          {l.isActive ? 'Закрити' : 'Відкрити'}
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => handleDelete(l)}
                          className="px-3 py-1.5 rounded-lg border border-red-200 font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          Видалити
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-slate-50">
                      <td colSpan={6} className="px-4 py-3">
                        <ul className="divide-y divide-slate-200">
                          {apps.map((a) => (
                            <li key={a.id} className="flex items-center justify-between py-2">
                              <div>
                                <p className="font-medium text-slate-900">{a.applicantEmail}</p>
                                <p className="text-xs text-slate-500">
                                  {new Date(a.createdAt).toLocaleString('uk-UA')}
                                </p>
                              </div>
                              <button
                                onClick={() => openCv(a.cvPath)}
                                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-medium text-slate-700 hover:bg-slate-100"
                              >
                                📄 Відкрити CV
                              </button>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
            {data.listings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Ще немає опублікованих вакансій.{' '}
                  <Link to="/company/new" className="text-indigo-600 font-medium">
                    Створити першу →
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
