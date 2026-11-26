import { Link, useNavigate, useParams } from 'react-router-dom'
import CompanyGate from '../components/CompanyGate'
import ListingForm from '../components/ListingForm'
import { fetchListing, updateListing, useQuery } from '../lib/listings'

export default function EditListing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: listing, loading, error } = useQuery(() => fetchListing(id!), [id])

  return (
    <CompanyGate>
      {(company) => {
        if (loading) {
          return <p className="max-w-2xl mx-auto px-4 py-16 text-center text-slate-500">Завантаження...</p>
        }
        if (!listing || listing.company !== company) {
          return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
              <p className="text-slate-500">
                {error ? `Помилка: ${error}` : 'Вакансію не знайдено або вона належить іншій компанії.'}
              </p>
              <Link to="/company" className="text-indigo-600 font-medium">
                ← До моїх вакансій
              </Link>
            </div>
          )
        }
        return (
          <div className="max-w-2xl mx-auto px-4 py-10">
            <Link to="/company" className="text-sm text-indigo-600 font-medium">
              ← Мої вакансії
            </Link>
            <h1 className="mt-4 text-2xl font-bold text-slate-900 mb-6">Редагування вакансії</h1>
            <ListingForm
              initial={listing}
              submitLabel="Зберегти зміни"
              onSubmit={async (input) => {
                await updateListing(listing.id, input)
                navigate('/company')
              }}
            />
          </div>
        )
      }}
    </CompanyGate>
  )
}
