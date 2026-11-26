import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchMyCompany } from '../lib/applications'
import { useQuery } from '../lib/listings'

// Рендерить children лише для акаунтів, прив'язаних до компанії (company_members)
export default function CompanyGate({ children }: { children: (company: string) => ReactNode }) {
  const { user } = useAuth()
  const { data: company, loading, error } = useQuery(() => fetchMyCompany(user!.id), [user!.id])

  if (loading) {
    return <p className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">Завантаження...</p>
  }

  if (error) {
    return (
      <p className="max-w-5xl mx-auto px-4 py-16 text-center text-red-700">
        Не вдалося завантажити дані: {error}
      </p>
    )
  }

  if (!company) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Акаунт не прив'язаний до компанії</h1>
        <p className="text-slate-500">
          Ви увійшли як {user!.email}, але цей акаунт ще не має доступу до сторінки компанії.
          Зверніться до адміністратора KSE Career Hub, щоб вас додали. Якщо вас уже запросили —
          вийдіть і увійдіть знову.
        </p>
      </div>
    )
  }

  return <>{children(company)}</>
}
