import { useNavigate } from 'react-router-dom'
import CompanyGate from '../components/CompanyGate'
import ListingForm from '../components/ListingForm'
import { createListing } from '../lib/listings'

export default function PostListing() {
  const navigate = useNavigate()

  return (
    <CompanyGate>
      {(company) => (
        <div className="max-w-2xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Нова вакансія</h1>
          <p className="text-slate-500 mb-6">
            Вакансія від імені {company}. Після публікації її одразу побачать студенти KSE.
          </p>
          <ListingForm
            submitLabel="Опублікувати вакансію"
            onSubmit={async (input) => {
              await createListing(company, input)
              navigate('/company')
            }}
          />
        </div>
      )}
    </CompanyGate>
  )
}
